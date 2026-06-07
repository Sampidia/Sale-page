export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '*';
    const allowedOrigin = (!env.ALLOWED_ORIGIN || env.ALLOWED_ORIGIN === '*') ? origin : env.ALLOWED_ORIGIN;

    const headers = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

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
      const { email, username, appName, token } = await request.json();

      if (!email || !username || !appName) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: email, username, appName' }),
          { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
        );
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
          })
        });

        const verifyResult = await verifyResponse.json();

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

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'admin@ajo-esusu.sampidia.com',
          to: 'admin@ajo-esusu.sampidia.com',
          subject: `Account Deletion Request: ${username} (${appName})`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; color: #333;">
              <h2 style="color: #dc2626; border-bottom: 1px solid #eee; padding-bottom: 10px;">Account Deletion Request</h2>
              <p>A new account deletion request has been submitted from the <strong>Afigo Sam Page</strong> portal.</p>
              <div style="background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Username:</strong> ${username}</p>
                <p style="margin: 5px 0;"><strong>Email Address:</strong> ${email}</p>
                <p style="margin: 5px 0;"><strong>App Selection:</strong> ${appName}</p>
              </div>
              <p style="color: #d97706; font-weight: bold;">⚠️ SLA Note: Please process this request within 48 hours to meet platform terms.</p>
            </div>
          `,
        }),
      });

      const responseData = await resendResponse.json();

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

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message || 'Internal Server Error' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
  },
};
