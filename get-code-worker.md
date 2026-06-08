/*
  =============================================================================
  GET-CODE-WORKER
  =============================================================================
  This file contains the Cloudflare Worker script and D1 SQL commands for manual
  deployment via the Cloudflare Dashboard.

  -----------------------------------------------------------------------------
  STEP 1: DATABASE SETUP (Cloudflare D1)
  -----------------------------------------------------------------------------
  1. Go to your Cloudflare Dashboard -> Workers & Pages -> D1.
  2. Click "Create Database" -> "Create D1 database".
  3. Enter Name: "naw-passcode-checkout" and click Create.
  4. Once created, click on your database, go to the "Console" tab, paste the
     following SQL schema, and click "Execute":

     CREATE TABLE IF NOT EXISTS purchases (
       transaction_id TEXT PRIMARY KEY,
       username TEXT NOT NULL,
       email TEXT NOT NULL,
       tournament_id TEXT NOT NULL,
       passcode TEXT UNIQUE NOT NULL,
       amount REAL NOT NULL,
       currency TEXT NOT NULL,
       purchased_at TEXT DEFAULT (datetime('now'))
     );

  -----------------------------------------------------------------------------
  STEP 2: WORKER CREATION & CONFIGURATION
  -----------------------------------------------------------------------------
  1. In Cloudflare Dashboard, go to Workers & Pages -> Create Application -> Create Worker.
  2. Name it "get-code-worker" and click Deploy.
  3. Click "Edit code", paste the entire code below, and click "Save and deploy".
  4. Go back to the worker dashboard, navigate to "Settings" -> "Variables".
  5. Add a D1 Database Binding:
     - Variable name: DB
     - Database: naw-passcode-checkout
  6. Add the following Environment Variables / Secrets under "Variables":
     - FLW_SECRET_KEY (Secret - Flutterwave Secret Key)
     - RESEND_API_KEY (Secret - Resend API Key)
     - Quick_Challenge_ID (Variable - e.g. "quick-challenge-id")
     - Weekend_Challenge_ID (Variable - e.g. "weekend-challenge-id")
     - ALLOWED_ORIGIN (Variable - Set to "*" or your domain "https://ajo-esusu.sampidia.com")
  =============================================================================
*/

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '*';
    const allowedOrigin = (!env.ALLOWED_ORIGIN || env.ALLOWED_ORIGIN === '*') ? origin : env.ALLOWED_ORIGIN;

    const headers = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    // CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    const url = new URL(request.url);

    // Route: GET /api/slots
    if (request.method === 'GET' && url.pathname === '/api/slots') {
      try {
        const tournamentType = url.searchParams.get('tournamentType'); // 'quick' | 'weekend'
        if (!tournamentType || (tournamentType !== 'quick' && tournamentType !== 'weekend')) {
          return new Response(
            JSON.stringify({ error: 'Invalid or missing tournamentType' }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        const tournamentId = tournamentType === 'weekend' ? env.Weekend_Challenge_ID : env.Quick_Challenge_ID;
        if (!tournamentId) {
          return new Response(
            JSON.stringify({ error: `Tournament ID for ${tournamentType} challenge not configured` }),
            { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        // 1. Fetch total count from Firebase API
        const firebaseCountUrl = `https://naw-passcode.sampidiablog.workers.dev/api/passcode/count?tournamentId=${tournamentId}`;
        const firebaseRes = await fetch(firebaseCountUrl);
        if (!firebaseRes.ok) {
          return new Response(
            JSON.stringify({ error: 'Failed to retrieve slot capacity from firebase API' }),
            { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }
        const firebaseData = await firebaseRes.json();
        const firebaseCount = parseInt(firebaseData.count || 0, 10);

        // 2. Query D1 database for sold passcodes
        if (!env.DB) {
          return new Response(
            JSON.stringify({ error: 'D1 Database binding (DB) is missing' }),
            { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }
        
        const { results } = await env.DB.prepare(
          "SELECT COUNT(*) as count FROM purchases WHERE tournament_id = ?"
        ).bind(tournamentId).all();
        
        const soldCount = results && results[0] ? parseInt(results[0].count || 0, 10) : 0;

        // 3. Compute remaining slots
        const availableSlots = Math.max(0, firebaseCount - soldCount);

        return new Response(
          JSON.stringify({ availableSlots, totalCount: firebaseCount, soldCount }),
          { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
        );

      } catch (err) {
        return new Response(
          JSON.stringify({ error: err.message || 'Internal Server Error' }),
          { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Route: POST /api/verify
    if (request.method === 'POST' && url.pathname === '/api/verify') {
      try {
        const { transactionId, tournamentType, username, email } = await request.json();

        if (!transactionId || !tournamentType || !username || !email) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields: transactionId, tournamentType, username, email' }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        const tournamentId = tournamentType === 'weekend' ? env.Weekend_Challenge_ID : env.Quick_Challenge_ID;
        if (!tournamentId) {
          return new Response(
            JSON.stringify({ error: `Tournament ID for ${tournamentType} challenge not configured` }),
            { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        if (!env.DB) {
          return new Response(
            JSON.stringify({ error: 'D1 Database binding (DB) is missing' }),
            { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        // 1. Check if transaction ID has already been verified/processed in D1
        const existingTx = await env.DB.prepare(
          "SELECT passcode FROM purchases WHERE transaction_id = ?"
        ).bind(transactionId).first();

        if (existingTx) {
          // If transaction already processed, return the existing passcode safely without charging or calling third-party API again
          return new Response(
            JSON.stringify({ success: true, passcode: existingTx.passcode, reissued: true }),
            { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        // 2. Verify payment with Flutterwave
        if (!env.FLW_SECRET_KEY) {
          return new Response(
            JSON.stringify({ error: 'FLW_SECRET_KEY is not configured in worker environment' }),
            { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        const flwResponse = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${env.FLW_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (!flwResponse.ok) {
          return new Response(
            JSON.stringify({ error: 'Failed to verify transaction status with Flutterwave' }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        const flwData = await flwResponse.json();
        
        if (flwData.status !== 'success' || flwData.data.status !== 'successful') {
          return new Response(
            JSON.stringify({ error: 'Transaction was not successful or could not be validated' }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        // Validate currency
        if (flwData.data.currency !== 'NGN') {
          return new Response(
            JSON.stringify({ error: `Invalid currency. Expected NGN, got ${flwData.data.currency}` }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        // Validate amount (₦200 for Quick Challenge, ₦500 for Weekend Challenge)
        const expectedAmount = tournamentType === 'weekend' ? 500 : 200;
        if (flwData.data.amount < expectedAmount) {
          return new Response(
            JSON.stringify({ error: `Incorrect payment amount. Expected at least ${expectedAmount}, received ${flwData.data.amount}` }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        // 3. Fetch passcode from Firebase passcode service
        const passcodeFetchUrl = `https://naw-passcode.sampidiablog.workers.dev/api/passcode?tournamentId=${tournamentId}`;
        const passcodeRes = await fetch(passcodeFetchUrl);
        if (!passcodeRes.ok) {
          return new Response(
            JSON.stringify({ error: 'Failed to retrieve passcode from tournament passcode API' }),
            { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        const textResponse = await passcodeRes.text();
        let passcode = textResponse;
        try {
          const parsed = JSON.parse(textResponse);
          passcode = parsed.passcode || parsed.code || (parsed.data && parsed.data.passcode) || parsed.data || textResponse;
        } catch (e) {
          // Response is raw text, use it as is
        }

        if (!passcode || typeof passcode !== 'string') {
          return new Response(
            JSON.stringify({ error: 'Invalid passcode format received from passcode API' }),
            { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        passcode = passcode.trim();

        // 4. Save the transaction and passcode mapping to D1
        await env.DB.prepare(
          "INSERT INTO purchases (transaction_id, username, email, tournament_id, passcode, amount, currency) VALUES (?, ?, ?, ?, ?, ?, ?)"
        ).bind(transactionId, username, email, tournamentId, passcode, flwData.data.amount, flwData.data.currency).run();

        // 5. Send confirmation emails using Resend
        if (!env.RESEND_API_KEY) {
          return new Response(
            JSON.stringify({ error: 'RESEND_API_KEY is not configured' }),
            { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        const emailHtml = `
          <div style="font-family: sans-serif; padding: 24px; color: #333; max-width: 600px; line-height: 1.6;">
            <h2 style="color: #ef4444; border-bottom: 2px solid #fee2e2; padding-bottom: 12px; margin-top: 0;">
              🎟️ Tournament Passcode Purchase Confirmation
            </h2>
            <p>Hi <strong>${username}</strong>,</p>
            <p>Thank you for purchasing your entry passcode. Your payment was validated, and your unique code is ready below.</p>
            
            <div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
              <span style="font-size: 12px; text-transform: uppercase; color: #b91c1c; font-weight: bold; letter-spacing: 0.1em;">Your Passcode</span>
              <div style="font-size: 32px; font-weight: 950; color: #dc2626; margin-top: 8px; letter-spacing: 1px; font-family: monospace;">
                ${passcode}
              </div>
            </div>
            
            <h3 style="color: #991b1b; margin-bottom: 8px; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px;">📊 Transaction Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Tournament:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; text-align: right; color: #111827;">${tournamentType === 'weekend' ? 'Weekend Challenge' : 'Quick Challenge'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Game Username:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; text-align: right; color: #111827;">${username}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Flutterwave Ref:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-family: monospace; text-align: right; color: #111827;">${transactionId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Amount Paid:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; text-align: right; color: #111827;">₦${flwData.data.amount}</td>
              </tr>
            </table>

            <p style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px; font-size: 13px; color: #b45309; margin-bottom: 24px;">
              💡 <strong>How to join:</strong> Copy the code above, open the <strong>Naija Ayo Worldwide</strong> mobile app, go to the tournament arena, select your challenge type, and paste the code to enter the lobby.
            </p>
            
            <p style="font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 12px; margin-top: 24px;">
              This email was automatically generated by the Afigo-Sam tournament ticketing system. If you did not make this purchase, please contact support.
            </p>
          </div>
        `;

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'admin@ajo-esusu.sampidia.com',
            to: [email, 'admin@ajo-esusu.sampidia.com'],
            subject: `🎟️ Tournament Passcode: ${username} (${tournamentType === 'weekend' ? 'Weekend' : 'Quick'})`,
            html: emailHtml,
          }),
        });

        // 6. Return passcode response to client
        return new Response(
          JSON.stringify({ success: true, passcode, reissued: false }),
          { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
        );

      } catch (err) {
        return new Response(
          JSON.stringify({ error: err.message || 'Internal Server Error' }),
          { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Fallback: 404 Route
    return new Response(JSON.stringify({ error: 'Route not found' }), {
      status: 404,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  },
};
