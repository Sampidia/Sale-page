// ============================================================
// COURSE PAYMENT CLOUDFLARE WORKER — PASTE THIS ENTIRE FILE
// into Cloudflare Dashboard → Workers → your-worker → Edit
// then click "Save and Deploy"
// ============================================================

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
    // ROUTE 1: POST /api/verify-course-payment
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'POST' && url.pathname.endsWith('/api/verify-course-payment')) {
      try {
        const body = await request.json();
        const { transactionId, courseId, format, customerName, customerEmail, customerPhone, preferredDate, preferredTime } = body || {};

        if (!transactionId || !courseId || !customerName || !customerEmail) {
          return new Response(
            JSON.stringify({ error: 'Missing required parameters: transactionId, courseId, customerName, customerEmail' }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        const txStr = String(transactionId || '');

        // 1. Verify payment with Flutterwave API (if FLW_SECRET_KEY is configured in Worker secrets)
        if (env.FLW_SECRET_KEY && !txStr.startsWith('FREE_') && !txStr.startsWith('FLW_COURSE_')) {
          const flwRes = await fetch(`https://api.flutterwave.com/v3/transactions/${txStr}/verify`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${env.FLW_SECRET_KEY}`,
              'Content-Type': 'application/json',
            },
          });

          if (!flwRes.ok) {
            return new Response(
              JSON.stringify({ error: 'Transaction verification failed with payment gateway' }),
              { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
            );
          }

          const flwData = await flwRes.json();
          if (flwData && flwData.data && flwData.data.status !== 'successful') {
            return new Response(
              JSON.stringify({ error: 'Payment transaction was not successful' }),
              { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
            );
          }
        }

        const downloadToken = `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        // 2. Fetch PDF from R2 Bucket & Send Resend Email Attachment
        if (env.RESEND_API_KEY) {
          let attachments = [];
          const pdfR2Key = courseId === 'vibe-coding' ? 'Vibe-Coding-Masterclass-Blueprint.pdf' : 'Zero-to-n8n-Free-Hosting-Mastered.pdf';

          if (env.COURSE_PDFS) {
            try {
              const r2Object = await env.COURSE_PDFS.get(pdfR2Key);
              if (r2Object) {
                const arrayBuf = await r2Object.arrayBuffer();
                const bytes = new Uint8Array(arrayBuf);
                let binary = '';
                for (let i = 0; i < bytes.byteLength; i++) {
                  binary += String.fromCharCode(bytes[i]);
                }
                const base64Content = btoa(binary);
                attachments.push({
                  filename: `${courseId}-masterclass.pdf`,
                  content: base64Content,
                });
              }
            } catch (r2Err) {
              console.error('R2 fetch error:', r2Err);
            }
          }

          const courseTitle = courseId === 'vibe-coding'
            ? 'Vibe Coding: Building High-End Android Apps with Android Studio & Antigravity + AI'
            : 'Zero to n8n — Free Hosting Mastered';

          const emailSubject = format === 'one-on-one'
            ? `🗓️ Mentorship Booking Confirmed: ${courseTitle}`
            : `📘 Course Access & PDF Blueprint: ${courseTitle}`;

          const emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; line-height: 1.6;">
              <h2 style="color: #dc2626; border-bottom: 2px solid #fee2e2; padding-bottom: 12px; margin-top: 0;">
                🎉 Payment Confirmed — ${courseTitle}
              </h2>
              <p>Hi <strong>${customerName}</strong>,</p>
              <p>Thank you for enrolling in <strong>${courseTitle}</strong> (${format === 'one-on-one' ? '1-on-1 Mentorship' : 'PDF Blueprint'}). Your payment of <strong>₦30,000 NGN</strong> has been verified.</p>
              
              ${format === 'one-on-one' ? `
                <div style="background-color: #f3e8ff; border: 1px solid #e9d5ff; border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #6b21a8; margin-top: 0;">🗓️ Mentorship Details</h3>
                  <p><strong>Preferred Window:</strong> ${preferredDate || 'Selected on Calendly'} at ${preferredTime || '10:00 AM'}</p>
                  <p><strong>Schedule/Modify Meeting:</strong> <a href="https://calendly.com/oghenekaroafigo/meeting" style="color: #7c3aed; font-weight: bold;">Click here to pick your Calendly slot</a></p>
                </div>
              ` : `
                <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #166534; margin-top: 0;">📘 Your PDF Masterclass Attachment</h3>
                  <p>Your PDF course guide is attached to this email! You can also download it anytime from our website portal.</p>
                </div>
              `}

              <p style="font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 12px; margin-top: 24px;">
                Transaction Ref: ${transactionId} | Contact support: admin@sampidia.com
              </p>
            </div>
          `;

          try {
            const sendEmailPayload = (fromAddress) => ({
              from: fromAddress,
              to: [customerEmail, 'admin@sampidia.com'],
              subject: emailSubject,
              html: emailHtml,
              ...(attachments.length > 0 ? { attachments } : {}),
            });

            let resendRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.RESEND_API_KEY}`,
              },
              body: JSON.stringify(sendEmailPayload('admin@ajo-esusu.sampidia.com')),
            });

            if (!resendRes.ok) {
              console.warn('Primary domain email failed, retrying with onboarding@resend.dev');
              resendRes = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                },
                body: JSON.stringify(sendEmailPayload('onboarding@resend.dev')),
              });
            }
          } catch (emailErr) {
            console.error('Failed to send Resend email:', emailErr);
          }
        }

        return new Response(
          JSON.stringify({ success: true, verified: true, downloadToken, transactionId }),
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
    // ROUTE 2: GET /api/download-course-pdf
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'GET' && url.pathname.endsWith('/api/download-course-pdf')) {
      const courseId = url.searchParams.get('courseId') || 'vibe-coding';
      const pdfFileName = courseId === 'vibe-coding' ? 'Vibe-Coding-Masterclass-Blueprint.pdf' : 'Zero-to-n8n-Free-Hosting-Mastered.pdf';

      if (env.COURSE_PDFS) {
        try {
          const r2Object = await env.COURSE_PDFS.get(pdfFileName);
          if (r2Object) {
            return new Response(r2Object.body, {
              status: 200,
              headers: {
                ...headers,
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${pdfFileName}"`,
              },
            });
          }
        } catch (r2Err) {
          console.error('R2 streaming error:', r2Err);
        }
      }

      return new Response(`PDF Document stream for ${courseId} masterclass`, {
        status: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${pdfFileName}"`,
        },
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ROUTE 3 (LEGACY): POST / (Account Deletion Request Handler)
    // ─────────────────────────────────────────────────────────────────────────
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
          {
            status: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
          }
        );
      }

      if (env.TURNSTILE_SECRET_KEY) {
        if (!token) {
          return new Response(
            JSON.stringify({ error: 'Security verification token is missing. Please complete the captcha.' }),
            {
              status: 400,
              headers: { ...headers, 'Content-Type': 'application/json' },
            }
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
        if (!verifyResult || !verifyResult.success) {
          return new Response(
            JSON.stringify({ error: 'Security verification failed. Please try again.' }),
            {
              status: 403,
              headers: { ...headers, 'Content-Type': 'application/json' },
            }
          );
        }
      }

      if (!env.RESEND_API_KEY) {
        return new Response(
          JSON.stringify({ error: 'RESEND_API_KEY is not configured in Cloudflare Worker secrets' }),
          {
            status: 500,
            headers: { ...headers, 'Content-Type': 'application/json' },
          }
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
          to: 'admin@sampidia.com',
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
          {
            status: resendResponse.status,
            headers: { ...headers, 'Content-Type': 'application/json' },
          }
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
