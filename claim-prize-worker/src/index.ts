export interface Env {
  RESEND_API_KEY: string;
  ALLOWED_ORIGIN: string;
  TURNSTILE_SECRET_KEY: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const origin = request.headers.get('Origin') || '*';
    const allowedOrigin = (!env.ALLOWED_ORIGIN || env.ALLOWED_ORIGIN === '*') ? origin : env.ALLOWED_ORIGIN;

    const headers = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    // Handle CORS preflight request
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    try {
      const {
        username,
        email,
        currency,
        bankName,
        accountNumber,
        accountName,
        otherInstructions,
        token,
      } = await request.json() as {
        username?: string;
        email?: string;
        currency?: string;
        bankName?: string;
        accountNumber?: string;
        accountName?: string;
        otherInstructions?: string;
        token?: string;
      };

      // Validate core required fields
      if (!username || !email || !currency) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: username, email, currency' }),
          { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
        );
      }

      // Validate payment fields based on currency
      if (currency !== 'Others') {
        if (!bankName || !accountNumber || !accountName) {
          return new Response(
            JSON.stringify({ error: 'Missing payment fields: bankName, accountNumber, accountName' }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }
      } else {
        if (!otherInstructions) {
          return new Response(
            JSON.stringify({ error: 'Missing required field: otherInstructions' }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }
      }

      // Turnstile server-side verification (skip if secret key not configured)
      if (env.TURNSTILE_SECRET_KEY) {
        if (!token) {
          return new Response(
            JSON.stringify({ error: 'Security verification token is missing. Please complete the captcha.' }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: env.TURNSTILE_SECRET_KEY,
            response: token,
            remoteip: request.headers.get('CF-Connecting-IP'),
          }),
        });

        const verifyResult = await verifyResponse.json() as { success: boolean };

        if (!verifyResult.success) {
          return new Response(
            JSON.stringify({ error: 'Security verification failed. Please try again.' }),
            { status: 403, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }
      }

      if (!env.RESEND_API_KEY) {
        return new Response(
          JSON.stringify({ error: 'RESEND_API_KEY is not configured in Cloudflare Worker secrets' }),
          { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
        );
      }

      // Build the payment details section of the email
      const paymentDetailsHtml = currency !== 'Others'
        ? `
          <p style="margin: 5px 0;"><strong>Currency:</strong> ${currency}</p>
          <p style="margin: 5px 0;"><strong>Bank / Mobile Money Name:</strong> ${bankName}</p>
          <p style="margin: 5px 0;"><strong>Account Number:</strong> ${accountNumber}</p>
          <p style="margin: 5px 0;"><strong>Account Name:</strong> ${accountName}</p>
        `
        : `
          <p style="margin: 5px 0;"><strong>Currency:</strong> ${currency}</p>
          <p style="margin: 5px 0;"><strong>Payment Instructions:</strong> ${otherInstructions}</p>
        `;

      // Send email via Resend
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'admin@afigo.sampidia.com',
          to: 'admin@afigo.sampidia.com',
          subject: `🏆 Prize Claim Request: ${username} (${currency})`,
          html: `
            <div style="font-family: sans-serif; padding: 24px; line-height: 1.7; color: #333; max-width: 600px;">
              <h2 style="color: #7c3aed; border-bottom: 2px solid #ede9fe; padding-bottom: 12px; margin-top: 0;">
                🏆 New Prize Claim Submission
              </h2>
              <p>A prize claim request has been submitted from the <strong>Afigo-Sam</strong> portal. Please process the payout as soon as possible.</p>

              <h3 style="color: #4c1d95; margin-bottom: 8px;">👤 Player Details</h3>
              <div style="background-color: #f5f3ff; border: 1px solid #ede9fe; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong>Game Username:</strong> ${username}</p>
                <p style="margin: 5px 0;"><strong>Game Email:</strong> ${email}</p>
              </div>

              <h3 style="color: #4c1d95; margin-bottom: 8px;">💳 Payout Details</h3>
              <div style="background-color: #f5f3ff; border: 1px solid #ede9fe; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                ${paymentDetailsHtml}
              </div>

              <p style="color: #d97706; font-weight: bold; background: #fffbeb; border: 1px solid #fde68a; padding: 12px; border-radius: 8px;">
                ⚠️ Please verify the player's account and process the payout promptly. Double-check all account details before initiating any transfer.
              </p>

              <p style="font-size: 12px; color: #9ca3af; margin-top: 24px; border-top: 1px solid #f3f4f6; padding-top: 12px;">
                This email was automatically generated by the Afigo-Sam prize claim system.
              </p>
            </div>
          `,
        }),
      });

      const responseData = await resendResponse.json() as any;

      if (!resendResponse.ok) {
        return new Response(
          JSON.stringify({ error: responseData.message || 'Failed to send email via Resend API' }),
          { status: resendResponse.status, headers: { ...headers, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(JSON.stringify({ success: true, id: responseData.id }), {
        status: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message || 'Internal Server Error' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
  },
};
