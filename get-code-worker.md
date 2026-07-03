/*
  =============================================================================
  GET-CODE-WORKER  (updated — added /api/debug and /api/slots-v2)
  =============================================================================

  NEW DIAGNOSTIC ROUTES
  ─────────────────────
  GET /api/debug?tournamentType=quick|weekend
    Hits Firebase and D1 independently and returns their raw outputs side-by-side.
    Use this to find which side is returning the wrong value.

  GET /api/debug-raw?tournamentType=quick|weekend
    Same as above but also includes the full raw Firebase response body as a
    string, in case the field names are not what the worker expects.

  FIXED PRODUCTION ROUTE
  ──────────────────────
  GET /api/slots-v2?tournamentType=quick|weekend&firebaseCount=<n>
    Skips the Worker-to-Worker Firebase fetch entirely (Cloudflare blocks it
    via error 1042). The browser fetches the Firebase count directly and passes
    it here as the firebaseCount query param. This worker only touches D1.

  FRONTEND PATTERN  (replace your old /api/slots call with this)
  ──────────────────────────────────────────────────────────────
    async function getAvailableSlots(tournamentType) {
      const tournamentId = tournamentType === 'quick'
        ? 'quicky_challenge01'
        : 'weekend_Cup01';

      // Step 1: browser fetches Firebase directly (no worker-to-worker block)
      const firebaseRes = await fetch(
        `https://naw-passcode.sampidiablog.workers.dev/api/passcode/count?tournamentId=${tournamentId}`
      );
      const { remainingCount } = await firebaseRes.json();

      // Step 2: worker reads only D1 and computes the difference
      const slotsRes = await fetch(
        `https://get-code.sampidiablog.workers.dev/api/slots-v2?tournamentType=${tournamentType}&firebaseCount=${remainingCount}`
      );
      return await slotsRes.json(); // { availableSlots, totalCount, soldCount }
    }

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

    // ─────────────────────────────────────────────────────────────────────────
    // Route: GET /api/debug
    // Returns the raw output of Firebase AND D1 side-by-side so you can
    // identify which one is returning wrong/missing data.
    //
    // Usage:
    //   https://get-code.sampidiablog.workers.dev/api/debug?tournamentType=quick
    //   https://get-code.sampidiablog.workers.dev/api/debug?tournamentType=weekend
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'GET' && url.pathname === '/api/debug') {
      const tournamentType = url.searchParams.get('tournamentType');

      if (!tournamentType || (tournamentType !== 'quick' && tournamentType !== 'weekend')) {
        return new Response(
          JSON.stringify({ error: 'Missing or invalid tournamentType. Use "quick" or "weekend".' }),
          { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
        );
      }

      const tournamentId = tournamentType === 'weekend' ? env.Weekend_Challenge_ID : env.Quick_Challenge_ID;
      const result = {
        tournamentType,
        tournamentId: tournamentId || '(env var not set)',
        firebase: null,
        d1: null,
        computed: null,
        errors: [],
      };

      // ── Firebase ──────────────────────────────────────────────────────────
      try {
        const firebaseUrl = `https://naw-passcode.sampidiablog.workers.dev/api/passcode/count?tournamentId=${tournamentId}`;
        result.firebase = { url: firebaseUrl };

        const firebaseRes = await fetch(firebaseUrl);
        result.firebase.httpStatus = firebaseRes.status;

        const firebaseBody = await firebaseRes.json();
        result.firebase.rawBody = firebaseBody;

        // Show exactly which field the worker will pick up
        result.firebase.remainingCount = firebaseBody.remainingCount ?? null;
        result.firebase.count          = firebaseBody.count ?? null;
        result.firebase.resolvedValue  = parseInt(firebaseBody.remainingCount ?? firebaseBody.count ?? 0, 10);
      } catch (err) {
        result.firebase = result.firebase || {};
        result.firebase.error = err.message;
        result.errors.push(`Firebase fetch failed: ${err.message}`);
      }

      // ── D1 ────────────────────────────────────────────────────────────────
      try {
        if (!env.DB) throw new Error('D1 binding (DB) is not configured in worker settings');

        const { results } = await env.DB.prepare(
          'SELECT COUNT(*) as count FROM purchases WHERE tournament_id = ?'
        ).bind(tournamentId).all();

        const soldCount = results && results[0] ? parseInt(results[0].count || 0, 10) : 0;

        // Also pull the last 5 purchases so you can verify the tournament_id values stored
        const { results: recentRows } = await env.DB.prepare(
          'SELECT transaction_id, username, tournament_id, purchased_at FROM purchases WHERE tournament_id = ? ORDER BY purchased_at DESC LIMIT 5'
        ).bind(tournamentId).all();

        result.d1 = {
          soldCount,
          rawCountResult: results,
          recentPurchases: recentRows || [],
        };
      } catch (err) {
        result.d1 = { error: err.message };
        result.errors.push(`D1 query failed: ${err.message}`);
      }

      // ── Computed ──────────────────────────────────────────────────────────
      if (result.firebase && result.firebase.resolvedValue != null && result.d1 && result.d1.soldCount != null) {
        const total    = result.firebase.resolvedValue;
        const sold     = result.d1.soldCount;
        const available = Math.max(0, total - sold);
        result.computed = { totalFromFirebase: total, soldFromD1: sold, availableSlots: available };
      }

      return new Response(
        JSON.stringify(result, null, 2),
        { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Route: GET /api/debug-raw
    // Same as /api/debug but also captures the Firebase response as raw text
    // before JSON.parse — useful if the response body is malformed or the
    // field names don't match what the worker expects.
    //
    // Usage:
    //   https://get-code.sampidiablog.workers.dev/api/debug-raw?tournamentType=quick
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'GET' && url.pathname === '/api/debug-raw') {
      const tournamentType = url.searchParams.get('tournamentType');

      if (!tournamentType || (tournamentType !== 'quick' && tournamentType !== 'weekend')) {
        return new Response(
          JSON.stringify({ error: 'Missing or invalid tournamentType. Use "quick" or "weekend".' }),
          { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
        );
      }

      const tournamentId = tournamentType === 'weekend' ? env.Weekend_Challenge_ID : env.Quick_Challenge_ID;
      const result = {
        tournamentType,
        tournamentId: tournamentId || '(env var not set)',
        firebase: null,
        d1: null,
        errors: [],
      };

      // ── Firebase (raw text capture) ───────────────────────────────────────
      try {
        const firebaseUrl = `https://naw-passcode.sampidiablog.workers.dev/api/passcode/count?tournamentId=${tournamentId}`;
        result.firebase = { url: firebaseUrl };

        const firebaseRes = await fetch(firebaseUrl);
        result.firebase.httpStatus = firebaseRes.status;
        result.firebase.headers = Object.fromEntries(firebaseRes.headers.entries());

        const rawText = await firebaseRes.text();
        result.firebase.rawText = rawText;           // exact bytes returned
        result.firebase.rawTextLength = rawText.length;

        try {
          const parsed = JSON.parse(rawText);
          result.firebase.parsedBody   = parsed;
          result.firebase.allFieldNames = Object.keys(parsed);  // shows exactly what fields exist
        } catch (parseErr) {
          result.firebase.parseError = parseErr.message;
        }
      } catch (err) {
        result.firebase = result.firebase || {};
        result.firebase.fetchError = err.message;
        result.errors.push(`Firebase fetch failed: ${err.message}`);
      }

      // ── D1 (raw) ──────────────────────────────────────────────────────────
      try {
        if (!env.DB) throw new Error('D1 binding (DB) is not configured');

        const { results: countResults } = await env.DB.prepare(
          'SELECT COUNT(*) as count FROM purchases WHERE tournament_id = ?'
        ).bind(tournamentId).all();

        // Also show a sample of ALL distinct tournament_id values in the table
        // so you can check for typos or mismatches
        const { results: allIds } = await env.DB.prepare(
          'SELECT tournament_id, COUNT(*) as n FROM purchases GROUP BY tournament_id'
        ).all();

        result.d1 = {
          countResultForThisTournament: countResults,
          soldCount: countResults && countResults[0] ? parseInt(countResults[0].count || 0, 10) : 0,
          allTournamentIdsInTable: allIds || [],
        };
      } catch (err) {
        result.d1 = { error: err.message };
        result.errors.push(`D1 query failed: ${err.message}`);
      }

      return new Response(
        JSON.stringify(result, null, 2),
        { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Route: GET /api/slots-v2  (FIXED — no Worker-to-Worker call)
    // Browser fetches Firebase count directly and passes it as firebaseCount.
    // This worker only reads D1, avoiding Cloudflare's error 1042 block.
    //
    // Usage:
    //   https://get-code.sampidiablog.workers.dev/api/slots-v2?tournamentType=quick&firebaseCount=10
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'GET' && url.pathname === '/api/slots-v2') {
      try {
        const tournamentType  = url.searchParams.get('tournamentType');
        const firebaseCountRaw = url.searchParams.get('firebaseCount');

        if (!tournamentType || (tournamentType !== 'quick' && tournamentType !== 'weekend')) {
          return new Response(
            JSON.stringify({ error: 'Invalid or missing tournamentType' }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        if (firebaseCountRaw === null || firebaseCountRaw === '') {
          return new Response(
            JSON.stringify({ error: 'Missing firebaseCount query parameter. Fetch it from naw-passcode worker in the browser and pass it here.' }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        const firebaseCount = parseInt(firebaseCountRaw, 10);
        if (isNaN(firebaseCount)) {
          return new Response(
            JSON.stringify({ error: `firebaseCount must be a number, got: ${firebaseCountRaw}` }),
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

        const { results } = await env.DB.prepare(
          'SELECT COUNT(*) as count FROM purchases WHERE tournament_id = ?'
        ).bind(tournamentId).all();

        const soldCount = results && results[0] ? parseInt(results[0].count || 0, 10) : 0;
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

    // ─────────────────────────────────────────────────────────────────────────
    // Route: GET /api/slots  (ORIGINAL — kept for backwards compatibility)
    // Warning: Firebase fetch may fail with Cloudflare error 1042 (Worker-to-
    // Worker block). Use /api/slots-v2 + browser-fetched firebaseCount instead.
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'GET' && url.pathname === '/api/slots') {
      try {
        const tournamentType = url.searchParams.get('tournamentType');
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

        const firebaseCountUrl = `https://naw-passcode.sampidiablog.workers.dev/api/passcode/count?tournamentId=${tournamentId}`;
        const firebaseRes = await fetch(firebaseCountUrl);
        if (!firebaseRes.ok) {
          return new Response(
            JSON.stringify({ error: 'Failed to retrieve slot capacity from firebase API' }),
            { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }
        const firebaseData = await firebaseRes.json();
        const firebaseCount = parseInt(firebaseData.remainingCount ?? firebaseData.count ?? 0, 10);

        if (!env.DB) {
          return new Response(
            JSON.stringify({ error: 'D1 Database binding (DB) is missing' }),
            { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        const { results } = await env.DB.prepare(
          'SELECT COUNT(*) as count FROM purchases WHERE tournament_id = ?'
        ).bind(tournamentId).all();

        const soldCount = results && results[0] ? parseInt(results[0].count || 0, 10) : 0;
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

    // ─────────────────────────────────────────────────────────────────────────
    // Route: POST /api/verify
    // ─────────────────────────────────────────────────────────────────────────
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

        // 1. Check if already processed
        const existingTx = await env.DB.prepare(
          'SELECT passcode FROM purchases WHERE transaction_id = ?'
        ).bind(transactionId).first();

        if (existingTx) {
          return new Response(
            JSON.stringify({ success: true, passcode: existingTx.passcode, reissued: true }),
            { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        // 2. Verify payment with Flutterwave
        const QUICK_CHALLENGE_PRICE = Number(env.QUICK_CHALLENGE_PRICE ?? 200);
        const WEEKEND_CHALLENGE_PRICE = Number(env.WEEKEND_CHALLENGE_PRICE ?? 500);
        const expectedAmount = tournamentType === 'weekend' ? WEEKEND_CHALLENGE_PRICE : QUICK_CHALLENGE_PRICE;

        let flwData;
        if (expectedAmount === 0 && transactionId.startsWith('FREE_')) {
          flwData = {
            status: 'success',
            data: {
              status: 'successful',
              amount: 0,
              currency: 'NGN'
            }
          };
        } else {
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

          flwData = await flwResponse.json();
        }

        if (flwData.status !== 'success' || flwData.data.status !== 'successful') {
          return new Response(
            JSON.stringify({ error: 'Transaction was not successful or could not be validated' }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        if (flwData.data.currency !== 'NGN') {
          return new Response(
            JSON.stringify({ error: `Invalid currency. Expected NGN, got ${flwData.data.currency}` }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

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
          // Response is raw text
        }

        if (!passcode || typeof passcode !== 'string') {
          return new Response(
            JSON.stringify({ error: 'Invalid passcode format received from passcode API' }),
            { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        passcode = passcode.trim();

        // 4. Save to D1
        await env.DB.prepare(
          'INSERT INTO purchases (transaction_id, username, email, tournament_id, passcode, amount, currency) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(transactionId, username, email, tournamentId, passcode, flwData.data.amount, flwData.data.currency).run();

        // 5. Send confirmation emails via Resend
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

    // Fallback
    return new Response(JSON.stringify({ error: 'Route not found' }), {
      status: 404,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  },
};