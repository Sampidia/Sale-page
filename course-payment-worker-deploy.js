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

    // Helper: Store Purchase Record in Cloudflare D1
    async function recordPurchaseToDB({ email, customerName, courseId, format, transactionId, downloadToken, amount = 30000, currency = 'NGN', amountPaid = null, itemType = 'course' }) {
      if (!env.DB) return;
      try {
        await env.DB.prepare(`
          INSERT OR IGNORE INTO purchases (id, email, customer_name, course_id, format, transaction_id, amount, currency, amount_paid, download_token, item_type)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          `purch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          String(email).trim().toLowerCase(),
          customerName || 'Valued Customer',
          courseId,
          format || 'pdf',
          String(transactionId),
          amount,
          currency || 'NGN',
          amountPaid || null,
          downloadToken,
          itemType
        ).run();
      } catch (err) {
        // Fallback for pre-existing D1 schema without currency/amount_paid columns
        try {
          await env.DB.prepare(`
            INSERT OR IGNORE INTO purchases (id, email, customer_name, course_id, format, transaction_id, amount, download_token, item_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            `purch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            String(email).trim().toLowerCase(),
            customerName || 'Valued Customer',
            courseId,
            format || 'pdf',
            String(transactionId),
            amount,
            downloadToken,
            itemType
          ).run();
        } catch (fallbackErr) {
          console.error('D1 purchase record error:', fallbackErr);
        }
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ROUTE 1: POST /api/verify-course-payment
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'POST' && url.pathname.endsWith('/api/verify-course-payment')) {
      try {
        const body = await request.json();
        const { transactionId, courseId, format, customerName, customerEmail, customerPhone, amount: paidAmountVal, currency: paidCurrency, amountPaid: paidAmountStr } = body || {};

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

        // 2. Build R2 download URL & Receipt URL from this Worker's own origin
        const workerOrigin = new URL(request.url).origin;
        const r2DownloadLink = `${workerOrigin}/api/download-course-pdf?token=${downloadToken}&courseId=${courseId}`;
        const receiptLink = `${workerOrigin}/api/download-receipt?txId=${encodeURIComponent(txStr)}&email=${encodeURIComponent(customerEmail)}&courseId=${encodeURIComponent(courseId)}`
          + (paidCurrency ? `&currency=${encodeURIComponent(paidCurrency)}` : '')
          + (paidAmountStr ? `&amountPaid=${encodeURIComponent(paidAmountStr)}` : '');
        const calendlyLink = `${workerOrigin}/api/calendly-redirect?txId=${encodeURIComponent(txStr)}&email=${encodeURIComponent(customerEmail)}`;

        // 3. Save purchase to Cloudflare D1
        await recordPurchaseToDB({
          email: customerEmail,
          customerName,
          courseId,
          format,
          transactionId: txStr,
          downloadToken,
          amount: paidAmountVal || (format === 'one-on-one' ? 30000 : 15000),
          currency: paidCurrency || 'NGN',
          amountPaid: paidAmountStr || null,
          itemType: 'course'
        });

        // 4. Send Resend confirmation email with R2 download button & receipt link
        if (env.RESEND_API_KEY) {
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
              <p>Thank you for enrolling in <strong>${courseTitle}</strong> (${format === 'one-on-one' ? '1-on-1 Mentorship' : 'PDF Blueprint'}). Your payment of <strong>${paidAmountStr || ((paidAmountVal || (format === 'one-on-one' ? 30000 : 15000)).toLocaleString('en-US') + ' ' + (paidCurrency || 'NGN'))}</strong> has been verified.</p>

              ${format === 'one-on-one' ? `
                <div style="background-color: #f3e8ff; border: 1px solid #e9d5ff; border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #6b21a8; margin-top: 0;">🗓️ Book Your Live Session</h3>
                  <p>Use the link below to pick your exact date and time slot on Calendly:</p>
                  <div style="text-align: center; margin: 16px 0;">
                    <a href="${calendlyLink}"
                       style="background:#7c3aed; color:#ffffff; padding:14px 28px; border-radius:10px;
                              font-size:15px; font-weight:bold; text-decoration:none; display:inline-block;">
                      📅 Pick Your Calendly Slot
                    </a>
                  </div>
                </div>
              ` : `
                <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #166534; margin-top: 0;">📘 Download Your PDF Masterclass</h3>
                  <p>Your course guide is ready. Click the button below to download it directly from our secure storage:</p>
                  <div style="text-align: center; margin: 16px 0;">
                    <a href="${r2DownloadLink}"
                       style="background:#16a34a; color:#ffffff; padding:14px 28px; border-radius:10px;
                              font-size:15px; font-weight:bold; text-decoration:none; display:inline-block;">
                      📥 Download Your PDF Masterclass
                    </a>
                  </div>
                  <p style="font-size: 12px; color: #64748b; margin-top: 8px; text-align: center;">
                    This link is unique to your order. Save this email for future re-downloads.
                  </p>
                </div>
              `}

              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin: 20px 0; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #334155;">📄 Official Purchase Receipt</p>
                <a href="${receiptLink}" target="_blank" style="color: #2563eb; font-weight: bold; text-decoration: underline; font-size: 14px;">
                  View & Download Printable Receipt (PDF)
                </a>
              </div>

              <p style="font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 12px; margin-top: 24px;">
                Transaction Ref: ${txStr} | Contact support: admin@sampidia.com
              </p>
            </div>
          `;

          try {
            const sendEmailPayload = (fromAddress) => ({
              from: fromAddress,
              to: [customerEmail, 'admin@sampidia.com'],
              subject: emailSubject,
              html: emailHtml,
            });

            let resendRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.RESEND_API_KEY}`,
              },
              body: JSON.stringify(sendEmailPayload('admin@afigo.sampidia.com')),
            });

            if (!resendRes.ok) {
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
          JSON.stringify({ success: true, verified: true, downloadToken, transactionId: txStr, receiptLink }),
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
    // ROUTE 1.75: POST /api/notify-currency-failure (Admin Email Alert for Currency API Failures)
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'POST' && url.pathname.endsWith('/api/notify-currency-failure')) {
      try {
        const body = await request.json().catch(() => ({}));
        const { reason = 'Live exchange rate APIs failed', timestamp = new Date().toISOString() } = body;

        if (env.RESEND_API_KEY) {
          const emailSubject = '⚠️ Alert: Currency Exchange Rate API Failover Triggered';
          const emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; line-height: 1.6;">
              <h2 style="color: #dc2626; border-bottom: 2px solid #fee2e2; padding-bottom: 12px; margin-top: 0;">
                ⚠️ Currency API Failover Triggered
              </h2>
              <p>Hi Samson,</p>
              <p>The Afigo-Sam multi-currency converter experienced an issue fetching live exchange rates:</p>
              <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px; margin: 16px 0; color: #991b1b; font-size: 14px;">
                <strong>Reason:</strong> ${reason}<br>
                <strong>Timestamp:</strong> ${timestamp}
              </div>
              <p><strong>Status:</strong> The platform has automatically failed over to Tier 3 built-in static rates ($1 USD = ₦1,500 NGN). Visitors can still view prices and checkout without disruption.</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;">
              <p style="font-size: 12px; color: #64748b;">Afigo-Sam Technology System Automated Notification • admin@sampidia.com</p>
            </div>
          `;

          const sendEmailPayload = (fromEmail) => ({
            from: `Afigo-Sam Alert <${fromEmail}>`,
            to: ['admin@sampidia.com', 'admin@afigo.sampidia.com'],
            subject: emailSubject,
            html: emailHtml,
          });

          fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(sendEmailPayload('admin@afigo.sampidia.com')),
          }).catch(err => console.error('Currency alert email error:', err));
        }

        return new Response(JSON.stringify({ success: true, alerted: true }), {
          status: 200,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false }), { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } });
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ROUTE 1.8: POST /api/verify-product-payment (Plugin & Digital Product Verification)
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'POST' && url.pathname.endsWith('/api/verify-product-payment')) {
      try {
        const body = await request.json();
        const { transactionId, productId = 'ai-content-generator', customerName, customerEmail, currency: paidCurrency, amountPaid: paidAmount } = body || {};

        if (!transactionId || !customerName || !customerEmail) {
          return new Response(
            JSON.stringify({ error: 'Missing required parameters: transactionId, customerName, customerEmail' }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        const txStr = String(transactionId || '');

        // 1. Verify payment with Flutterwave API
        if (env.FLW_SECRET_KEY && !txStr.startsWith('FREE_') && !txStr.startsWith('FLW_PLUGIN_')) {
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

        const downloadToken = `token_prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const workerOrigin = new URL(request.url).origin;
        const r2DownloadLink = `${workerOrigin}/api/download-product-zip?token=${downloadToken}&productId=${productId}`;
        const receiptLink = `${workerOrigin}/api/download-receipt?txId=${encodeURIComponent(txStr)}&email=${encodeURIComponent(customerEmail)}&courseId=${encodeURIComponent(productId)}`
          + (paidCurrency ? `&currency=${encodeURIComponent(paidCurrency)}` : '')
          + (paidAmount ? `&amountPaid=${encodeURIComponent(paidAmount)}` : '');

        // 2. Save product purchase to Cloudflare D1
        await recordPurchaseToDB({
          email: customerEmail,
          customerName,
          courseId: productId,
          format: 'zip',
          transactionId: txStr,
          downloadToken,
          amount: 25,
          currency: paidCurrency || 'USD',
          amountPaid: paidAmount || null,
          itemType: 'product'
        });

        // 3. Send Resend fulfillment email
        if (env.RESEND_API_KEY) {
          const productName = productId === 'ai-content-generator'
            ? 'WordPress AI-Powered Automatic Content Generator'
            : 'WordPress Plugin & Asset';

          const emailSubject = `🔌 Order Confirmed: ${productName}`;

          const emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; line-height: 1.6;">
              <h2 style="color: #dc2626; border-bottom: 2px solid #fee2e2; padding-bottom: 12px; margin-top: 0;">
                🎉 Order Confirmed — ${productName}
              </h2>
              <p>Hi <strong>${customerName}</strong>,</p>
              <p>Thank you for purchasing <strong>${productName}</strong>. Your payment of <strong>${paidAmount || paidAmountStr || '$25 USD'}</strong> has been verified.</p>

              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #166534; margin-top: 0;">📥 Download Your Plugin (.ZIP)</h3>
                <p>Click the button below to download your plugin package directly from our secure storage:</p>
                <div style="text-align: center; margin: 16px 0;">
                  <a href="${r2DownloadLink}"
                     style="background:#16a34a; color:#ffffff; padding:14px 28px; border-radius:10px;
                            font-size:15px; font-weight:bold; text-decoration:none; display:inline-block;">
                    📥 Download Plugin ZIP Package
                  </a>
                </div>
                <p style="font-size: 12px; color: #64748b; margin-top: 8px; text-align: center;">
                  Save this email to re-download your plugin anytime in the future.
                </p>
              </div>

              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin: 20px 0; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #334155;">📄 Official Purchase Receipt</p>
                <a href="${receiptLink}" target="_blank" style="color: #2563eb; font-weight: bold; text-decoration: underline; font-size: 14px;">
                  View & Download Printable Receipt (PDF)
                </a>
              </div>

              <p style="font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 12px; margin-top: 24px;">
                Transaction Ref: ${txStr} | Contact support: admin@afigo.sampidia.com
              </p>
            </div>
          `;

          try {
            const sendPayload = (fromAddress) => ({
              from: fromAddress,
              to: [customerEmail, 'admin@sampidia.com'],
              subject: emailSubject,
              html: emailHtml,
            });

            let resendRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.RESEND_API_KEY}`,
              },
              body: JSON.stringify(sendPayload('admin@afigo.sampidia.com')),
            });

            if (!resendRes.ok) {
              await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                },
                body: JSON.stringify(sendPayload('onboarding@resend.dev')),
              });
            }
          } catch (emailErr) {
            console.error('Failed to send product fulfillment email:', emailErr);
          }
        }

        return new Response(
          JSON.stringify({ success: true, verified: true, downloadToken, transactionId: txStr, receiptLink, r2DownloadLink }),
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
    // ROUTE 1.5: POST /api/flw-webhook (Flutterwave Webhook Verification)
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'POST' && url.pathname.endsWith('/api/flw-webhook')) {
      try {
        if (env.FLW_WEBHOOK_HASH) {
          const signature = request.headers.get('verif-hash');
          if (!signature || signature !== env.FLW_WEBHOOK_HASH) {
            return new Response(
              JSON.stringify({ error: 'Unauthorized: Invalid verif-hash signature' }),
              { status: 401, headers: { ...headers, 'Content-Type': 'application/json' } }
            );
          }
        }

        const body = await request.json();
        const event = body && body.event;
        const data = (body && body.data) || {};

        if (event && event !== 'charge.completed' && data.status !== 'successful') {
          return new Response(
            JSON.stringify({ message: 'Event ignored (not a successful charge)' }),
            { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        if (data.status !== 'successful') {
          return new Response(
            JSON.stringify({ message: 'Transaction status not successful' }),
            { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        const transactionId = String(data.id || data.tx_ref || 'FLW_WEBHOOK');
        const customerName = (data.customer && data.customer.name) || 'Valued Student';
        const customerEmail = data.customer && data.customer.email;
        const meta = data.meta || {};
        const courseId = meta.courseId || (String(data.tx_ref || '').includes('n8n') ? 'zero-to-n8n' : 'vibe-coding');
        const format = meta.format || 'pdf';

        if (!customerEmail) {
          return new Response(
            JSON.stringify({ error: 'Missing customer email in webhook payload' }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        const downloadToken = `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        // Save purchase to D1 database
        await recordPurchaseToDB({
          email: customerEmail,
          customerName,
          courseId,
          format,
          transactionId,
          downloadToken,
          amount: data.amount || 30000
        });

        // Send Email Notification
        if (env.RESEND_API_KEY) {
          const courseTitle = courseId === 'vibe-coding'
            ? 'Vibe Coding: Building High-End Android Apps with Android Studio & Antigravity + AI'
            : 'Zero to n8n — Free Hosting Mastered';

          const workerOrigin = new URL(request.url).origin;
          const r2DownloadLink = `${workerOrigin}/api/download-course-pdf?token=${downloadToken}&courseId=${courseId}`;
          const receiptLink = `${workerOrigin}/api/download-receipt?txId=${encodeURIComponent(transactionId)}&email=${encodeURIComponent(customerEmail)}&courseId=${encodeURIComponent(courseId)}`;
          const calendlyLink = `${workerOrigin}/api/calendly-redirect?txId=${encodeURIComponent(transactionId)}&email=${encodeURIComponent(customerEmail)}`;

          const emailSubject = format === 'one-on-one'
            ? `🗓️ Mentorship Booking Confirmed: ${courseTitle}`
            : `📘 Course Access & PDF Blueprint: ${courseTitle}`;

          const emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; line-height: 1.6;">
              <h2 style="color: #dc2626; border-bottom: 2px solid #fee2e2; padding-bottom: 12px; margin-top: 0;">
                🎉 Payment Confirmed via Webhook — ${courseTitle}
              </h2>
              <p>Hi <strong>${customerName}</strong>,</p>
              <p>Thank you for enrolling in <strong>${courseTitle}</strong> (${format === 'one-on-one' ? '1-on-1 Mentorship' : 'PDF Blueprint'}). Your payment has been verified by our automated webhook handler.</p>
              
              ${format === 'one-on-one' ? `
                <div style="background-color: #f3e8ff; border: 1px solid #e9d5ff; border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #6b21a8; margin-top: 0;">🗓️ Book Your Live Session</h3>
                  <p>Use the link below to pick your exact date and time slot on Calendly:</p>
                  <div style="text-align: center; margin: 16px 0;">
                    <a href="${calendlyLink}"
                       style="background:#7c3aed; color:#ffffff; padding:14px 28px; border-radius:10px;
                              font-size:15px; font-weight:bold; text-decoration:none; display:inline-block;">
                      📅 Pick Your Calendly Slot
                    </a>
                  </div>
                </div>
              ` : `
                <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #166534; margin-top: 0;">📘 Download Your PDF Masterclass</h3>
                  <p>Your course guide is ready. Click the button below to download it directly from our secure storage:</p>
                  <div style="text-align: center; margin: 16px 0;">
                    <a href="${r2DownloadLink}"
                       style="background:#16a34a; color:#ffffff; padding:14px 28px; border-radius:10px;
                              font-size:15px; font-weight:bold; text-decoration:none; display:inline-block;">
                      📥 Download Your PDF Masterclass
                    </a>
                  </div>
                </div>
              `}

              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin: 20px 0; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #334155;">📄 Official Purchase Receipt</p>
                <a href="${receiptLink}" target="_blank" style="color: #2563eb; font-weight: bold; text-decoration: underline; font-size: 14px;">
                  View & Download Printable Receipt (PDF)
                </a>
              </div>

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
            });

            let resendRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.RESEND_API_KEY}`,
              },
              body: JSON.stringify(sendEmailPayload('admin@afigo.sampidia.com')),
            });

            if (!resendRes.ok) {
              await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                },
                body: JSON.stringify(sendEmailPayload('onboarding@resend.dev')),
              });
            }
          } catch (emailErr) {
            console.error('Failed to send webhook fulfillment email:', emailErr);
          }
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Webhook processed successfully', transactionId }),
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
    // ROUTE 2.5: GET /api/download-product-zip
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'GET' && url.pathname.endsWith('/api/download-product-zip')) {
      const productId = url.searchParams.get('productId') || 'ai-content-generator';
      const zipFileName = productId === 'ai-content-generator'
        ? 'wordpress-ai-content-generator.zip'
        : 'wordpress-plugin-asset.zip';

      if (env.COURSE_PDFS) {
        try {
          const r2Object = await env.COURSE_PDFS.get(zipFileName);
          if (r2Object) {
            return new Response(r2Object.body, {
              status: 200,
              headers: {
                ...headers,
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${zipFileName}"`,
              },
            });
          }
        } catch (r2Err) {
          console.error('R2 zip streaming error:', r2Err);
        }
      }

      return new Response(`ZIP Document stream for ${productId} plugin`, {
        status: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${zipFileName}"`,
        },
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ROUTE 3: GET /api/download-receipt (Printable & Mobile-Responsive HTML Receipt)
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'GET' && url.pathname.endsWith('/api/download-receipt')) {
      const txId = url.searchParams.get('txId') || url.searchParams.get('transactionId') || 'REC-SAMPLE';
      const email = url.searchParams.get('email') || 'student@example.com';
      const courseId = url.searchParams.get('courseId') || 'vibe-coding';
      const currencyParam = url.searchParams.get('currency') || null;
      const amountPaidParam = url.searchParams.get('amountPaid') || null;

      // Determine if this receipt is for a product (USD) or a course (NGN) — used for defaults
      const PRODUCT_IDS = ['ai-content-generator','my-licenses-manager','booking-theme','naija-ayo-worldwide','afro-short','fake-detector'];
      const isProductReceipt = PRODUCT_IDS.includes(courseId);

      let customerName = 'Valued Student';
      let format = isProductReceipt ? 'zip' : 'pdf';
      let amount = isProductReceipt ? 25 : 30000;   // ← product=$25 USD, course=₦30,000 NGN
      let purchasedAt = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      if (env.DB) {
        try {
          const record = await env.DB.prepare(`SELECT * FROM purchases WHERE transaction_id = ? OR id = ?`).bind(txId, txId).first();
          if (record) {
            customerName = record.customer_name || customerName;
            format = record.format || format;
            amount = record.amount || amount;
            if (record.purchased_at) {
              purchasedAt = new Date(record.purchased_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            }
          }
        } catch (dbErr) {
          console.error('DB fetch error for receipt:', dbErr);
        }
      }

      // Map all known course/product IDs to their display names
      const COURSE_PRODUCT_TITLES = {
        'vibe-coding': 'Vibe Coding: Building High-End Android Apps with Android Studio & Antigravity + AI',
        'zero-to-n8n': 'Zero to n8n — Free Hosting Mastered',
        'ai-content-generator': 'WordPress AI-Powered Automatic Content Generator & Auto Posting Plugin',
        'my-licenses-manager': 'My Licenses Manager — WordPress License Key Management Plugin',
        'booking-theme': 'Hotel Booking WordPress Theme (Pro Edition)',
        'naija-ayo-worldwide': 'Naija Ayo Worldwide — Music Streaming & Download Plugin',
        'afro-short': 'AfroShort — WordPress URL Shortener & Analytics Plugin',
        'fake-detector': 'FakeDetector AI — Fact-Check & Misinformation Scanner Plugin',
      };
      const courseTitle = COURSE_PRODUCT_TITLES[courseId] || courseId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

      // Determine the displayed amount — prefer the frontend-passed amountPaid param (local currency),
      // otherwise fall back using the correct currency for the item type
      const defaultCurrencySymbol = isProductReceipt ? '$' : '₦';
      const defaultCurrencyLabel  = isProductReceipt ? 'USD' : 'NGN';
      const displayAmount = amountPaidParam
        || `${defaultCurrencySymbol}${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${defaultCurrencyLabel}`;
      const displayCurrency = currencyParam || defaultCurrencyLabel;

      const formatLabel = format === 'one-on-one' ? '1-on-1 Mentorship Session' : (format === 'zip' ? 'Digital Plugin Download (.ZIP)' : 'PDF Blueprint Masterclass');
      const receiptRef = `REC-${String(txId).replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()}`;

      const receiptHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>Receipt ${receiptRef} - Afigo Sam Page</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      margin: 0;
      padding: 32px 12px;
      -webkit-font-smoothing: antialiased;
    }
    .receipt-card {
      max-width: 640px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      padding: 36px 32px;
      box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.06);
      border: 1px solid #e2e8f0;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 20px;
      margin-bottom: 24px;
      gap: 16px;
    }
    .brand {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      line-height: 1.2;
    }
    .brand span { color: #dc2626; }
    .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
    .badge {
      display: inline-block;
      padding: 5px 12px;
      background: #dcfce7;
      color: #15803d;
      font-weight: 700;
      font-size: 11px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }
    .info-block h4 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      margin: 0 0 4px 0;
    }
    .info-block p {
      font-size: 14px;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
      word-break: break-word;
    }
    .info-block .sub {
      font-weight: 400;
      color: #64748b;
      font-size: 13px;
      margin-top: 2px;
    }
    .items-container {
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      overflow: hidden;
      margin-bottom: 24px;
    }
    .items-header {
      background: #f8fafc;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #64748b;
      border-bottom: 1px solid #e2e8f0;
    }
    .item-body {
      padding: 16px;
    }
    .item-title {
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.4;
      margin-bottom: 6px;
    }
    .item-meta-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px dashed #f1f5f9;
    }
    .format-tag {
      font-size: 11px;
      font-weight: 700;
      color: #3b82f6;
      background: #eff6ff;
      padding: 3px 10px;
      border-radius: 6px;
    }
    .item-amount {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
    }
    .total-box {
      background: #fafafa;
      border-top: 2px solid #f1f5f9;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .total-label { font-size: 15px; font-weight: 800; color: #0f172a; }
    .total-value { font-size: 19px; font-weight: 900; color: #dc2626; }

    .support-box {
      background-color: #f8fafc;
      border-radius: 12px;
      padding: 16px;
      font-size: 13px;
      color: #475569;
      line-height: 1.6;
      border: 1px solid #f1f5f9;
    }
    .actions {
      text-align: center;
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px dashed #cbd5e1;
    }
    .btn {
      background: #dc2626;
      color: #ffffff;
      font-size: 14px;
      font-weight: 700;
      padding: 12px 28px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(220, 38, 38, 0.25);
      transition: all 0.2s ease;
      width: 100%;
      max-width: 320px;
    }
    .btn:hover { background: #b91c1c; }
    .footer-note {
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      margin-top: 14px;
      line-height: 1.4;
    }

    @media (max-width: 600px) {
      body { padding: 10px 6px; }
      .receipt-card { padding: 20px 14px; border-radius: 14px; }
      .header { flex-direction: column; align-items: flex-start; gap: 10px; }
      .header-right { text-align: left !important; }
      .grid { grid-template-columns: 1fr; gap: 14px; }
      .grid-right { text-align: left !important; }
      .brand { font-size: 20px; }
      .item-title { font-size: 14px; }
      .total-value { font-size: 17px; }
    }

    @media print {
      body { background-color: #ffffff; padding: 0; }
      .receipt-card { box-shadow: none; border: none; padding: 0; }
      .actions { display: none; }
    }
  </style>
</head>
<body>
  <div class="receipt-card">
    <div class="header">
      <div>
        <div class="brand">Afigo<span>-Sam</span> Technology</div>
        <div class="subtitle">SamPidia Digital Assets & Course Publishing</div>
      </div>
      <div class="header-right" style="text-align: right;">
        <span class="badge">Payment Verified</span>
        <div class="subtitle" style="margin-top: 6px;">Ref: ${receiptRef}</div>
      </div>
    </div>

    <div class="grid">
      <div class="info-block">
        <h4>Billed To</h4>
        <p>${customerName}</p>
        <div class="sub">${email}</div>
      </div>
      <div class="info-block grid-right" style="text-align: right;">
        <h4>Payment Details</h4>
        <p>Date: ${purchasedAt}</p>
        <div class="sub">Provider: Flutterwave (Card / Transfer)</div>
      </div>
    </div>

    <div class="items-container">
      <div class="items-header">
        <span>Item &amp; Details</span>
        <span>Amount</span>
      </div>
      <div class="item-body">
        <div class="item-title">${courseTitle}</div>
        <div class="subtitle">Transaction Ref: ${txId}</div>
        <div class="item-meta-row">
          <span class="format-tag">Format: ${formatLabel}</span>
          <span class="item-amount">${displayAmount}</span>
        </div>
      </div>
      <div class="total-box">
        <span class="total-label">Total Amount Paid</span>
        <span class="total-value">${displayAmount}</span>
      </div>
    </div>

    <div class="support-box">
      <strong>Merchant Contact & Support:</strong><br>
      Oghenekaro Samson Afigo (Afigo-Sam Technology)<br>
      Email: admin@sampidia.com | Phone: +234 706 345 3903<br>
      Website: https://afigo.sampidia.com
    </div>

    <div class="actions">
      <button class="btn" onclick="window.print()">🖨️ Print / Save as PDF Receipt</button>
      <div class="footer-note">Thank you for your enrollment! Keep this official receipt for your tax and accounting records.</div>
    </div>
  </div>
</body>
</html>`;

      return new Response(receiptHtml, {
        status: 200,
        headers: {
          ...headers,
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ─────────────────────────────────────────────────────────────────────────
    // ROUTE 3.5: GET /api/cal-redirect (and /api/calendly-redirect alias)
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'GET' && (url.pathname.endsWith('/api/cal-redirect') || url.pathname.endsWith('/api/calendly-redirect'))) {
      const txId = url.searchParams.get('txId') || url.searchParams.get('transactionId') || '';
      const email = url.searchParams.get('email') || '';

      const targetCalUrl = 'https://cal.com/afigo-sam/30min';

      if (env.DB && (txId || email)) {
        try {
          let record = null;
          if (txId) {
            record = await env.DB.prepare(`SELECT * FROM purchases WHERE transaction_id = ? OR id = ?`).bind(txId, txId).first();
          }
          if (!record && email) {
            record = await env.DB.prepare(`SELECT * FROM purchases WHERE LOWER(email) = ? AND format = 'one-on-one' ORDER BY purchased_at DESC`).bind(email.toLowerCase()).first();
          }

          if (record) {
            // Case 1: Refund Requested
            if (Number(record.refund_requested) === 1) {
              const refundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Refund Request Pending - Afigo Sam</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px 16px; display: flex; align-items: center; justify-content: center; min-height: 100vh; box-sizing: border-box; }
    .card { max-width: 480px; width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 32px 24px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 12px 0; }
    p { font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0 0 24px 0; }
    .info-box { background: #0f172a; border: 1px solid #dc2626; border-radius: 12px; padding: 16px; font-size: 13px; color: #fca5a5; text-align: left; margin-bottom: 24px; }
    .btn { display: inline-block; background: #334155; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🔴</div>
    <h1>Refund Request Pending</h1>
    <p>Your refund request for transaction <strong>${record.transaction_id || txId}</strong> has been received and is currently being processed.</p>
    <div class="info-box">
      <strong>Processing Status:</strong><br>
      Refunds are processed within 3–5 business days. Direct re-booking is disabled while your refund is pending.<br>
      Questions? Contact: <a href="mailto:admin@afigo.sampidia.com" style="color:#60a5fa;">admin@afigo.sampidia.com</a>
    </div>
    <a href="https://afigo.sampidia.com/#/my-courses" class="btn">Return to Student Portal</a>
  </div>
</body>
</html>`;
              return new Response(refundHtml, { status: 200, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } });
            }

            // Case 2: Meeting Attended & Certificate Available
            if (Number(record.meeting_attended) === 1) {
              const completedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Session Completed - Certificate Granted</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px 16px; display: flex; align-items: center; justify-content: center; min-height: 100vh; box-sizing: border-box; }
    .card { max-width: 500px; width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 32px 24px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    .icon { font-size: 52px; margin-bottom: 16px; }
    h1 { font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 12px 0; }
    p { font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0 0 24px 0; }
    .info-box { background: #064e3b; border: 1px solid #10b981; border-radius: 12px; padding: 16px; font-size: 13px; color: #a7f3d0; text-align: left; margin-bottom: 24px; }
    .btn-cert { display: inline-block; background: #10b981; color: #064e3b; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 28px; border-radius: 12px; margin-bottom: 12px; }
    .btn-secondary { display: inline-block; background: #334155; color: #cbd5e1; text-decoration: none; font-weight: 600; font-size: 13px; padding: 10px 20px; border-radius: 10px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🎓</div>
    <h1>Mentorship Session Completed!</h1>
    <p>Congratulations on completing your live 1-on-1 mentorship session with Afigo Sam.</p>
    <div class="info-box">
      <strong>Certificate Granted:</strong><br>
      Your verifiable Certificate of Attendance is now available to download and print.
    </div>
    <a href="${new URL(request.url).origin}/api/certificate?txId=${encodeURIComponent(record.transaction_id || txId)}&email=${encodeURIComponent(record.email || email)}" class="btn-cert">📜 Download Certificate of Attendance</a><br>
    <a href="https://afigo.sampidia.com/#/my-courses" class="btn-secondary">Return to Student Portal</a>
  </div>
</body>
</html>`;
              return new Response(completedHtml, { status: 200, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } });
            }

            // Case 3: Session Already Scheduled
            if (Number(record.session_booked) === 1) {
              const rescheduleUrl = record.reschedule_link || targetCalUrl;
              const bookingBaseUrl = rescheduleUrl.replace('/reschedule/', '/booking/');
              const cancelUrl = bookingBaseUrl.includes('?') ? `${bookingBaseUrl}&cancel=true` : `${bookingBaseUrl}?cancel=true`;

              const meetingTime = record.meeting_start_time ? new Date(record.meeting_start_time).getTime() : null;
              const now = Date.now();
              const hoursLeft = meetingTime ? (meetingTime - now) / (1000 * 3600) : 999;
              const isRescheduleLocked = hoursLeft < 12;
              const isCancelLocked = hoursLeft < 24;

              const bookedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Session Scheduled - Afigo Sam</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px 16px; display: flex; align-items: center; justify-content: center; min-height: 100vh; box-sizing: border-box; }
    .card { max-width: 480px; width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 32px 24px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 12px 0; }
    p { font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0 0 20px 0; }
    .note-pill { background: #3b82f61a; border: 1px solid #3b82f640; color: #93c5fd; font-size: 12px; font-weight: 600; padding: 10px 14px; border-radius: 10px; margin-bottom: 20px; line-height: 1.4; text-align: left; }
    .warn-pill { background: #ef44441a; border: 1px solid #ef444440; color: #fca5a5; font-size: 12px; font-weight: 600; padding: 10px 14px; border-radius: 10px; margin-bottom: 20px; line-height: 1.4; text-align: left; }
    .btn-group { display: flex; flex-direction: column; gap: 10px; }
    .btn { display: inline-block; background: #7c3aed; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 12px; text-align: center; }
    .btn-cancel { background: #dc2626; color: #ffffff; }
    .btn-disabled { background: #334155; color: #64748b; pointer-events: none; cursor: not-allowed; }
    .btn-sec { background: #334155; color: #cbd5e1; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🗓️</div>
    <h1>Session Scheduled</h1>
    <p>Your 1-on-1 mentorship session with Afigo Sam has been confirmed.</p>
    
    ${isRescheduleLocked ? `
      <div class="warn-pill">
        ⚠️ Rescheduling and Cancellation is locked because your meeting starts in less than 24 hours. Support: <a href="mailto:admin@afigo.sampidia.com" style="color:#60a5fa;">admin@afigo.sampidia.com</a>
      </div>
    ` : isCancelLocked ? `
      <div class="warn-pill">
        ⚠️ Cancellation is locked because your meeting starts in less than 24 hours. Support: <a href="mailto:admin@afigo.sampidia.com" style="color:#60a5fa;">admin@afigo.sampidia.com</a>
      </div>
    ` : `
      <div class="note-pill">
        💡 <strong>Platform Change & Rescheduling:</strong><br>
        Click Reschedule below to change your meeting platform (Google Meet ↔ CalVideo) or select a new date & time.
      </div>
    `}

    <div class="btn-group">
      ${isRescheduleLocked ? `
        <span class="btn btn-disabled">🔒 Reschedule Locked</span>
      ` : `
        <a href="${rescheduleUrl}" target="_blank" rel="noopener noreferrer" class="btn">🔄 Reschedule My Session</a>
      `}

      ${isCancelLocked ? `
        <span class="btn btn-disabled">🔒 Cancel Locked</span>
      ` : `
        <a href="${cancelUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-cancel">❌ Cancel Booking</a>
      `}

      <a href="https://afigo.sampidia.com/#/my-courses" class="btn btn-sec">Return to Student Portal</a>
    </div>
  </div>
</body>
</html>`;
              return new Response(bookedHtml, { status: 200, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } });
            }

            // Case 4: No Show
            if (Number(record.no_show) === 1) {
              const noShowHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Missed Session - Afigo Sam</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px 16px; display: flex; align-items: center; justify-content: center; min-height: 100vh; box-sizing: border-box; }
    .card { max-width: 480px; width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 32px 24px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 12px 0; }
    p { font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0 0 20px 0; }
    .btn { display: inline-block; background: #dc2626; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">⚠️</div>
    <h1>Missed Mentorship Session</h1>
    <p>It looks like you were unable to attend your scheduled 1-on-1 mentorship call.</p>
    <p style="font-size: 13px; color: #cbd5e1;">Please contact support at <a href="mailto:admin@afigo.sampidia.com" style="color:#60a5fa;">admin@afigo.sampidia.com</a> to re-book your slot.</p>
    <a href="https://afigo.sampidia.com/#/my-courses" class="btn">Return to Student Portal</a>
  </div>
</body>
</html>`;
              return new Response(noShowHtml, { status: 200, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } });
            }
            // Case 5: Unbooked or Cancelled Session (session_booked === 0)
            if (Number(record.session_booked) === 0) {
              const calParams = new URLSearchParams();
              if (email || record.email) calParams.set('email', record.email || email);
              if (txId || record.transaction_id) calParams.set('transactionId', record.transaction_id || txId);
              const finalCalUrl = calParams.toString() ? `${targetCalUrl}?${calParams.toString()}` : targetCalUrl;

              const unbookedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Schedule or Request Refund - Afigo Sam</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px 16px; display: flex; align-items: center; justify-content: center; min-height: 100vh; box-sizing: border-box; }
    .card { max-width: 480px; width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 32px 24px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 12px 0; }
    p { font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0 0 20px 0; }
    .btn-group { display: flex; flex-direction: column; gap: 12px; }
    .btn { display: inline-block; background: #7c3aed; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 13px 24px; border-radius: 12px; text-align: center; }
    .btn-refund { background: #dc2626; color: #ffffff; }
    .btn-sec { background: #334155; color: #cbd5e1; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🗓️</div>
    <h1>Mentorship Booking Options</h1>
    <p>Your 1-on-1 mentorship session for purchase <strong>${record.transaction_id || txId}</strong> is currently unbooked or was cancelled.</p>
    <p style="font-size: 13px; color: #cbd5e1;">Please select an option below:</p>
    <div class="btn-group">
      <a href="${finalCalUrl}" class="btn">🔄 Re-book Live Session on Cal.com</a>
      <a href="https://afigo.sampidia.com/#/my-courses" class="btn btn-refund">💸 Request Refund (via Student Portal)</a>
      <a href="https://afigo.sampidia.com/#/my-courses" class="btn btn-sec">Return to Student Portal</a>
    </div>
  </div>
</body>
</html>`;
              return new Response(unbookedHtml, { status: 200, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } });
            }
          }
        } catch (dbErr) {
          console.error('D1 check cal-redirect error:', dbErr);
        }
      }

      // If DB record absent, fallback redirect to Cal.com with pre-filled parameters
      const calParams = new URLSearchParams();
      if (email) calParams.set('email', email);
      if (txId) calParams.set('transactionId', txId);

      const finalCalUrl = calParams.toString() ? `${targetCalUrl}?${calParams.toString()}` : targetCalUrl;
      return Response.redirect(finalCalUrl, 302);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ROUTE 3.55: POST /api/mark-session-booked (Records Successful Booking)
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'POST' && url.pathname.endsWith('/api/mark-session-booked')) {
      try {
        const body = await request.json();
        const txId = body.transactionId || body.txId || '';
        const email = body.email || '';
        const rescheduleLink = body.rescheduleLink || body.reschedule_link || '';

        if (env.DB && (txId || email)) {
          if (txId) {
            await env.DB.prepare(`
              UPDATE purchases 
              SET session_booked = 1, session_booked_at = datetime('now'), reschedule_link = COALESCE(NULLIF(?, ''), reschedule_link)
              WHERE transaction_id = ? OR id = ?
            `).bind(rescheduleLink, txId, txId).run();
          } else if (email) {
            await env.DB.prepare(`
              UPDATE purchases 
              SET session_booked = 1, session_booked_at = datetime('now'), reschedule_link = COALESCE(NULLIF(?, ''), reschedule_link)
              WHERE id = (SELECT id FROM purchases WHERE LOWER(email) = ? AND format = 'one-on-one' ORDER BY purchased_at DESC LIMIT 1)
            `).bind(rescheduleLink, email.toLowerCase()).run();
          }
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Session marked as booked successfully' }),
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
    // ROUTE 3.58: POST /api/request-refund (Handles Student Refund Requests)
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'POST' && url.pathname.endsWith('/api/request-refund')) {
      try {
        const body = await request.json();
        const txId = body.transactionId || body.txId || '';
        const email = body.email || '';
        const bankName = String(body.bankName || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
        const accountNumber = String(body.accountNumber || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
        const accountName = String(body.accountName || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
        const refundReason = String(body.refundReason || 'Student requested refund').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/[\r\n]+/g, ' ').trim() || 'Student requested refund';

        if (!txId && !email) {
          return new Response(
            JSON.stringify({ error: 'Missing transactionId or email' }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        if (env.DB) {
          // Record refund request in D1
          await env.DB.prepare(`
            UPDATE purchases
            SET refund_requested = 1, refund_requested_at = datetime('now')
            WHERE transaction_id = ? OR id = ? OR LOWER(email) = ?
          `).bind(txId, txId, email.toLowerCase()).run();
        }

        // Email Notification to Admin
        if (env.RESEND_API_KEY) {
          const adminSubject = `💸 Refund Requested: Transaction ${txId || email}`;
          const adminHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #0f172a;">
              <h2 style="color: #dc2626; border-bottom: 2px solid #fee2e2; padding-bottom: 10px;">💸 Student Refund Request Submitted</h2>
              <p>A student has submitted a refund request for a 1-on-1 mentorship purchase.</p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin: 20px 0;">
                <p style="margin: 4px 0;"><strong>Transaction Ref:</strong> ${txId}</p>
                <p style="margin: 4px 0;"><strong>Student Email:</strong> ${email}</p>
                <p style="margin: 4px 0;"><strong>Bank / Provider:</strong> ${bankName}</p>
                <p style="margin: 4px 0;"><strong>Account Number:</strong> ${accountNumber}</p>
                <p style="margin: 4px 0;"><strong>Account Name:</strong> ${accountName}</p>
                <p style="margin: 4px 0;"><strong>Reason:</strong> ${refundReason}</p>
              </div>
              <p style="font-size: 13px; color: #64748b;">Please review in Flutterwave merchant dashboard and issue payout once verified.</p>
            </div>
          `;

          // Send to admin
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: 'admin@afigo.sampidia.com',
              to: ['admin@afigo.sampidia.com', 'admin@sampidia.com'],
              subject: adminSubject,
              html: adminHtml,
            }),
          }).catch(err => console.error('Admin refund email error:', err));
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Refund request submitted successfully. We will process within 3-5 business days.' }),
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
    // ROUTE 3.59: GET /api/certificate (Renders Verifiable Certificate of Attendance)
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'GET' && url.pathname.endsWith('/api/certificate')) {
      const txId = url.searchParams.get('txId') || url.searchParams.get('transactionId') || '';
      const email = url.searchParams.get('email') || '';

      if (env.DB && (txId || email)) {
        try {
          let record = null;
          if (txId) {
            record = await env.DB.prepare(`SELECT * FROM purchases WHERE transaction_id = ? OR id = ?`).bind(txId, txId).first();
          }
          if (!record && email) {
            record = await env.DB.prepare(`SELECT * FROM purchases WHERE LOWER(email) = ? AND meeting_attended = 1 ORDER BY purchased_at DESC`).bind(email.toLowerCase()).first();
          }

          if (record && Number(record.meeting_attended) === 1) {
            const studentName = record.customer_name || 'Valued Student';
            const courseTitle = record.course_id === 'vibe-coding'
              ? 'Vibe Coding: Building High-End Android Apps with AI'
              : 'Zero to n8n — Free Hosting Mastered';
            const issueDate = record.session_booked_at ? new Date(record.session_booked_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString();

            const certHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificate of Attendance - ${studentName}</title>
  <style>
    @page { size: landscape; margin: 0; }
    body { font-family: 'Georgia', serif; background: #090d16; color: #f8fafc; margin: 0; padding: 40px; display: flex; align-items: center; justify-content: center; min-height: 100vh; box-sizing: border-box; }
    .cert-frame { max-width: 900px; width: 100%; background: #0f172a; border: 8px double #d97706; border-radius: 24px; padding: 48px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); position: relative; box-sizing: border-box; }
    .gold-badge { font-size: 14px; font-weight: 800; font-family: sans-serif; letter-spacing: 3px; color: #f59e0b; text-transform: uppercase; margin-bottom: 24px; }
    h1 { font-size: 36px; font-weight: 800; color: #ffffff; margin: 0 0 16px 0; letter-spacing: 1px; font-family: sans-serif; }
    .subtitle { font-size: 16px; color: #94a3b8; margin-bottom: 24px; font-style: italic; }
    .recipient { font-size: 40px; font-weight: 900; color: #fbbf24; margin: 0 0 24px 0; font-family: 'Times New Roman', serif; text-decoration: underline; text-underline-offset: 8px; }
    .desc { font-size: 16px; color: #cbd5e1; line-height: 1.8; max-width: 680px; margin: 0 auto 36px auto; font-family: sans-serif; }
    .footer-grid { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; border-top: 1px solid #334155; padding-top: 24px; font-family: sans-serif; }
    .sig-block { text-align: left; }
    .sig-name { font-size: 18px; font-weight: 800; color: #ffffff; font-family: 'Brush Script MT', cursive, serif; margin: 0; }
    .sig-title { font-size: 12px; color: #64748b; margin: 4px 0 0 0; }
    .ref-block { text-align: right; font-size: 12px; color: #64748b; }
    .print-btn { display: inline-block; margin-top: 32px; background: #d97706; color: #ffffff; text-decoration: none; font-family: sans-serif; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 12px; border: 0; cursor: pointer; }
    @media print { .print-btn { display: none; } body { background: #ffffff; color: #000; padding: 0; } .cert-frame { border-color: #d97706; background: #ffffff; color: #000; box-shadow: none; } h1, .recipient { color: #000; } .desc, .subtitle { color: #333; } }
  </style>
</head>
<body>
  <div class="cert-frame">
    <div class="gold-badge">🎓 OFFICIAL CERTIFICATE OF ATTENDANCE</div>
    <h1>CERTIFICATE OF COMPLETION</h1>
    <div class="subtitle">This is proudly presented and awarded to</div>
    <div class="recipient">${studentName}</div>
    <div class="desc">
      for successfully completing the <strong>30-Minute 1-on-1 Live Mentorship Session</strong> with Afigo Sam, mastering real-world implementation, workflows, and best practices for <strong>${courseTitle}</strong>.
    </div>
    <div class="footer-grid">
      <div class="sig-block">
        <div class="sig-name">Oghenekaro Samson Afigo</div>
        <div class="sig-title">Lead Instructor & Founder, Afigo-Sam Technology</div>
      </div>
      <div class="ref-block">
        <strong>Date Issued:</strong> ${issueDate}<br>
        <strong>Certificate ID:</strong> CERT-${record.transaction_id || txId}<br>
        <strong>Verification:</strong> https://afigo.sampidia.com
      </div>
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF Certificate</button>
  </div>
</body>
</html>`;
            return new Response(certHtml, { status: 200, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } });
          }
        } catch (dbErr) {
          console.error('D1 check certificate error:', dbErr);
        }
      }

      // If not completed or DB record absent
      const certPendingHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificate Pending - Afigo Sam</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px 16px; display: flex; align-items: center; justify-content: center; min-height: 100vh; box-sizing: border-box; }
    .card { max-width: 480px; width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 32px 24px; text-align: center; }
    .btn { display: inline-block; background: #334155; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size: 48px; margin-bottom: 16px;">🎓</div>
    <h1 style="font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 12px;">Certificate Pending</h1>
    <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">Your Certificate of Attendance will be generated automatically upon completion of your live 1-on-1 mentorship session.</p>
    <a href="https://afigo.sampidia.com/#/my-courses" class="btn">Return to Student Portal</a>
  </div>
</body>
</html>`;
      return new Response(certPendingHtml, { status: 200, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ROUTE 3.6: POST /api/cal-webhook (Receives Cal.com 5 Webhook Triggers)
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'POST' && (url.pathname.endsWith('/api/cal-webhook') || url.pathname.endsWith('/api/calendly-webhook'))) {
      try {
        const bodyText = await request.text();
        let body = {};
        try { body = JSON.parse(bodyText); } catch (e) {}

        const triggerEvent = body.triggerEvent || body.event || '';
        const payload = body.payload || body; // MEETING_ENDED uses flat JSON payload

        // Extract student details across nested or flat structures
        const attendees = payload.attendees || body.attendees || [];
        const studentEmail = (attendees[0] && attendees[0].email) || payload.email || body.email || '';
        const studentName = (attendees[0] && attendees[0].name) || payload.name || body.name || 'Valued Student';
        
        // Extract transactionId custom question or query param
        const responses = payload.responses || body.responses || {};
        const txId = (responses.transactionId && responses.transactionId.value) || responses.transactionId || payload.transactionId || '';
        const bookingUid = payload.uid || (payload.booking && payload.booking.uid) || payload.bookingUid || (payload.bookingId ? String(payload.bookingId) : '') || body.uid || '';
        const rawReschedUrl = payload.rescheduleUrl || body.rescheduleUrl || payload.reschedule_link || '';
        const rescheduleUrl = (rawReschedUrl && rawReschedUrl.startsWith('http'))
          ? rawReschedUrl
          : (bookingUid ? `https://cal.com/reschedule/${bookingUid}` : rawReschedUrl);
        const startTime = payload.startTime || body.startTime || '';

        if (env.DB && (studentEmail || txId)) {
          const normEmail = String(studentEmail).trim().toLowerCase();

          if (triggerEvent === 'BOOKING_CREATED') {
            await env.DB.prepare(`
              UPDATE purchases
              SET session_booked = 1, 
                  session_booked_at = datetime('now'),
                  reschedule_link = COALESCE(NULLIF(?, ''), reschedule_link),
                  meeting_start_time = COALESCE(NULLIF(?, ''), meeting_start_time)
              WHERE id = (
                SELECT id FROM purchases
                WHERE (transaction_id = ? OR LOWER(email) = ?) AND format = 'one-on-one'
                ORDER BY purchased_at DESC LIMIT 1
              )
            `).bind(rescheduleUrl, startTime, txId, normEmail).run();

            // Send Stage 2 Booking Confirmation Email via Resend
            if (env.RESEND_API_KEY && normEmail) {
              const workerOrigin = new URL(request.url).origin;
              const formattedDate = startTime ? new Date(startTime).toLocaleString() : 'Your scheduled date & time';
              const emailSubject = `🗓️ Live Mentorship Session Confirmed with Afigo Sam`;
              const emailHtml = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; line-height: 1.6;">
                  <h2 style="color: #7c3aed; border-bottom: 2px solid #ddd6fe; padding-bottom: 12px; margin-top: 0;">
                    🗓️ 1-on-1 Mentorship Booking Confirmed!
                  </h2>
                  <p>Hi ${studentName},</p>
                  <p>Your 30-minute 1-on-1 video mentorship call with Afigo Sam has been scheduled successfully.</p>
                  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #334155;">📅 Session Date & Time:</p>
                    <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 800; color: #7c3aed;">${formattedDate}</p>
                    <p style="margin: 0; font-size: 12px; color: #64748b;">Check your calendar invite email for your Google Meet or CalVideo join link.</p>
                  </div>
                  ${rescheduleUrl ? `
                    <div style="text-align: center; margin: 24px 0;">
                      <a href="${rescheduleUrl}" target="_blank" style="background-color: #7c3aed; color: #ffffff; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 10px; display: inline-block; font-size: 14px;">
                        🔄 Reschedule or Change Meeting Platform
                      </a>
                    </div>
                  ` : ''}
                  <p style="font-size: 12px; color: #64748b;">🎓 Certificate of Attendance will be awarded automatically upon completion of your live call.</p>
                </div>
              `;
              
              await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.RESEND_API_KEY}` },
                body: JSON.stringify({ from: 'admin@afigo.sampidia.com', to: [normEmail], subject: emailSubject, html: emailHtml }),
              }).catch(e => console.error('Booking notification email error:', e));
            }
          }
          else if (triggerEvent === 'BOOKING_RESCHEDULED') {
            await env.DB.prepare(`
              UPDATE purchases
              SET reschedule_link = COALESCE(NULLIF(?, ''), reschedule_link),
                  meeting_start_time = COALESCE(NULLIF(?, ''), meeting_start_time)
              WHERE transaction_id = ? OR LOWER(email) = ?
            `).bind(rescheduleUrl, startTime, txId, normEmail).run();
          }
          else if (triggerEvent === 'BOOKING_CANCELLED') {
            await env.DB.prepare(`
              UPDATE purchases
              SET session_booked = 0, reschedule_link = NULL
              WHERE (transaction_id = ? OR LOWER(email) = ?) AND (refund_requested = 0 OR refund_requested IS NULL)
            `).bind(txId, normEmail).run();
          }
          else if (triggerEvent === 'BOOKING_NO_SHOW_UPDATED') {
            await env.DB.prepare(`
              UPDATE purchases SET no_show = 1 WHERE transaction_id = ? OR LOWER(email) = ?
            `).bind(txId, normEmail).run();
          }
          else if (triggerEvent === 'MEETING_ENDED') {
            await env.DB.prepare(`
              UPDATE purchases SET meeting_attended = 1, certificate_sent = 1 WHERE transaction_id = ? OR LOWER(email) = ?
            `).bind(txId, normEmail).run();

            // Send Stage 5 Certificate of Attendance Email via Resend
            if (env.RESEND_API_KEY && normEmail) {
              const workerOrigin = new URL(request.url).origin;
              const certLink = `${workerOrigin}/api/certificate?txId=${encodeURIComponent(txId)}&email=${encodeURIComponent(normEmail)}`;
              const certSubject = `🎓 Certificate of Attendance: 1-on-1 Mentorship with Afigo Sam`;
              const certEmailHtml = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; line-height: 1.6;">
                  <h2 style="color: #059669; border-bottom: 2px solid #a7f3d0; padding-bottom: 12px; margin-top: 0;">
                    🎓 Congratulations on Completing Your Mentorship Call!
                  </h2>
                  <p>Hi ${studentName},</p>
                  <p>Thank you for attending your live 1-on-1 mentorship session with Afigo Sam. Your official Certificate of Attendance has been issued.</p>
                  <div style="text-align: center; margin: 28px 0;">
                    <a href="${certLink}" target="_blank" style="background-color: #059669; color: #ffffff; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 12px; display: inline-block; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                      📜 View & Download Certificate of Attendance
                    </a>
                  </div>
                  <p style="font-size: 12px; color: #64748b;">Keep this certificate for your professional records and portfolio showcase.</p>
                </div>
              `;

              await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.RESEND_API_KEY}` },
                body: JSON.stringify({ from: 'admin@afigo.sampidia.com', to: [normEmail], subject: certSubject, html: certEmailHtml }),
              }).catch(e => console.error('Certificate email error:', e));
            }
          }
        }

        return new Response(
          JSON.stringify({ success: true, message: `Cal.com event ${triggerEvent} processed successfully` }),
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
    // ROUTE 3.7: GET /api/setup-calendly-webhook?pat=YOUR_CALENDLY_TOKEN
    // Helper to register Calendly Webhook via Calendly API v2
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'GET' && url.pathname.endsWith('/api/setup-calendly-webhook')) {
      const pat = url.searchParams.get('pat') || env.CALENDLY_PAT;
      if (!pat) {
        return new Response(
          JSON.stringify({ error: 'Missing Calendly Personal Access Token. Usage: /api/setup-calendly-webhook?pat=YOUR_TOKEN' }),
          { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
        );
      }

      let orgUri = url.searchParams.get('org') || url.searchParams.get('organization') || '';
      let userUri = url.searchParams.get('user') || '';

      try {
        // Step 1: If org/user URI is not provided in URL params, fetch from /users/me
        if (!orgUri && !userUri) {
          const userRes = await fetch('https://api.calendly.com/users/me', {
            headers: {
              'Authorization': `Bearer ${pat}`,
              'Content-Type': 'application/json',
            },
          });

          if (!userRes.ok) {
            const userErr = await userRes.json();
            const isScopeErr = userErr && userErr.title === 'Insufficient scope';
            return new Response(
              JSON.stringify({
                error: isScopeErr
                  ? "⚠️ Personal Access Token is missing the 'users:read' scope. Please create a new Token in Calendly with 'users:read', 'webhooks:read', and 'webhooks:write' enabled."
                  : 'Failed to verify Calendly Personal Access Token',
                details: userErr
              }),
              { status: userRes.status, headers: { ...headers, 'Content-Type': 'application/json' } }
            );
          }

          const userData = await userRes.json();
          orgUri = userData.resource && userData.resource.current_organization;
          userUri = userData.resource && userData.resource.uri;
        }

        if (!orgUri && !userUri) {
          return new Response(
            JSON.stringify({ error: 'Could not resolve Calendly organization or user URI' }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        // Step 2: Register webhook subscription with Calendly API
        const workerOrigin = new URL(request.url).origin;
        const webhookCallbackUrl = `${workerOrigin}/api/calendly-webhook`;

        let subRes = await fetch('https://api.calendly.com/webhook_subscriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${pat}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: webhookCallbackUrl,
            events: ['invitee.created'],
            organization: orgUri,
            scope: 'organization',
          }),
        });

        let subData = await subRes.json();
        if (!subRes.ok) {
          // Retry with user scope + organization
          const payload = {
            url: webhookCallbackUrl,
            events: ['invitee.created'],
            scope: 'user',
          };
          if (orgUri) payload.organization = orgUri;
          if (userUri) payload.user = userUri;

          subRes = await fetch('https://api.calendly.com/webhook_subscriptions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${pat}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          subData = await subRes.json();
          if (!subRes.ok) {
            return new Response(
              JSON.stringify({ error: 'Failed to create Calendly Webhook Subscription', details: subData }),
              { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
            );
          }
        }

        return new Response(
          JSON.stringify({ success: true, message: '🎉 Calendly Webhook registered successfully!', data: subData }),
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
    // ROUTE 4: POST /api/portal/request-access (Request 6-Digit Verification Code)
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'POST' && url.pathname.endsWith('/api/portal/request-access')) {
      try {
        const { email } = await request.json();

        if (!email || !String(email).trim()) {
          return new Response(
            JSON.stringify({ error: 'Please enter a valid email address.' }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        // Check if D1 database has records for this email (if DB is bound)
        if (env.DB) {
          try {
            const countRes = await env.DB.prepare(`SELECT COUNT(*) as cnt FROM purchases WHERE LOWER(email) = ?`).bind(normalizedEmail).first('cnt');
            if (!countRes || Number(countRes) === 0) {
              return new Response(
                JSON.stringify({ error: 'No purchased courses found associated with this email address. Please check spelling or purchase a course.' }),
                { status: 404, headers: { ...headers, 'Content-Type': 'application/json' } }
              );
            }

            // Rate-limit: max 3 OTP requests per email in last 15 minutes
            try {
              const recentReqs = await env.DB.prepare(`
                SELECT COUNT(*) as cnt FROM access_tokens
                WHERE LOWER(email) = ? AND created_at > datetime('now', '-15 minutes')
              `).bind(normalizedEmail).first('cnt');
              if (recentReqs && Number(recentReqs) >= 3) {
                return new Response(
                  JSON.stringify({ error: 'Too many code requests. Please wait 15 minutes before requesting a new code.' }),
                  { status: 429, headers: { ...headers, 'Content-Type': 'application/json' } }
                );
              }
            } catch (rateErr) {
              console.error('Rate-limit check error:', rateErr);
            }
          } catch (dbErr) {
            console.error('D1 purchase check error:', dbErr);
          }
        }

        // Generate 6-Digit OTP Code
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins expiry

        if (env.DB) {
          try {
            await env.DB.prepare(`
              INSERT INTO access_tokens (token, email, expires_at, used)
              VALUES (?, ?, ?, 0)
            `).bind(otpCode, normalizedEmail, expiresAt).run();
          } catch (tokenErr) {
            console.error('D1 token insert error:', tokenErr);
          }
        }

        // Send OTP via Resend API
        if (env.RESEND_API_KEY) {
          const emailSubject = `🔑 ${otpCode} is your Afigo-Sam Access Code`;
          const emailHtml = `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; color: #1e293b;">
              <h2 style="color: #dc2626; border-bottom: 2px solid #fee2e2; padding-bottom: 12px; margin-top: 0;">
                🔑 Access Verification Code
              </h2>
              <p>Hello,</p>
              <p>Use the 6-digit verification code below to access your purchased products, plugins, assets, or courses on <strong>Afigo-Sam Page</strong>:</p>

              <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #dc2626;">${otpCode}</span>
                <p style="font-size: 12px; color: #64748b; margin-top: 8px; margin-bottom: 0;">Valid for 15 minutes. Do not share this code.</p>
              </div>

              <p style="font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 12px; margin-top: 24px;">
                If you did not request this code, please ignore this email.
              </p>
            </div>
          `;

          try {
            const sendPayload = (fromAddress) => ({
              from: fromAddress,
              to: [normalizedEmail],
              subject: emailSubject,
              html: emailHtml,
            });

            let resendRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.RESEND_API_KEY}`,
              },
              body: JSON.stringify(sendPayload('admin@afigo.sampidia.com')),
            });

            if (!resendRes.ok) {
              await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                },
                body: JSON.stringify(sendPayload('onboarding@resend.dev')),
              });
            }
          } catch (emailErr) {
            console.error('Failed to send OTP email:', emailErr);
          }
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Verification code sent to your email address.' }),
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
    // ROUTE 5: POST /api/portal/verify-access (Verify Code & Fetch Student Purchases)
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'POST' && url.pathname.endsWith('/api/portal/verify-access')) {
      try {
        const { email, code } = await request.json();

        if (!email || !code) {
          return new Response(
            JSON.stringify({ error: 'Missing email or verification code.' }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const inputCode = String(code).trim();

        if (env.DB) {
          try {
            const tokenRecord = await env.DB.prepare(`
              SELECT * FROM access_tokens 
              WHERE LOWER(email) = ? AND token = ? AND used = 0 AND expires_at > datetime('now')
            `).bind(normalizedEmail, inputCode).first();

            if (!tokenRecord) {
              return new Response(
                JSON.stringify({ error: 'Invalid or expired 6-digit verification code. Please request a new code.' }),
                { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
              );
            }

            // Mark token as used
            await env.DB.prepare(`UPDATE access_tokens SET used = 1 WHERE token = ?`).bind(inputCode).run();

            // Generate and store a session token (8h expiry)
            const sessionToken = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 18)}`;
            const sessExpiry = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
            try {
              await env.DB.prepare(`
                INSERT INTO session_tokens (token, email, expires_at) VALUES (?, ?, ?)
              `).bind(sessionToken, normalizedEmail, sessExpiry).run();
              // Attach session token to be returned in response
              request._sessionToken = sessionToken;
            } catch (sessErr) {
              console.error('D1 session token insert error:', sessErr);
            }
          } catch (dbErr) {
            console.error('D1 token verification error:', dbErr);
          }
        }

        const workerOrigin = new URL(request.url).origin;
        let purchases = [];

        if (env.DB) {
          try {
            const { results } = await env.DB.prepare(`
              SELECT * FROM purchases WHERE LOWER(email) = ? ORDER BY purchased_at DESC
            `).bind(normalizedEmail).all();

            if (results && results.length > 0) {
              purchases = results.map(p => ({
                id: p.id,
                courseId: p.course_id,
                format: p.format,
                itemType: p.item_type || 'course',
                customerName: p.customer_name,
                transactionId: p.transaction_id,
                purchasedAt: p.purchased_at,
                sessionBooked: Number(p.session_booked) === 1,
                rescheduleLink: p.reschedule_link || null,
                meetingStartTime: p.meeting_start_time || null,
                noShow: Number(p.no_show) === 1,
                meetingAttended: Number(p.meeting_attended) === 1,
                certificateSent: Number(p.certificate_sent) === 1,
                refundRequested: Number(p.refund_requested) === 1,
                r2DownloadLink: p.item_type === 'product'
                  ? `${workerOrigin}/api/download-product-zip?token=${p.download_token}&productId=${p.course_id}`
                  : `${workerOrigin}/api/download-course-pdf?token=${p.download_token}&courseId=${p.course_id}`,
                receiptLink: `${workerOrigin}/api/download-receipt?txId=${encodeURIComponent(p.transaction_id)}&email=${encodeURIComponent(normalizedEmail)}&courseId=${encodeURIComponent(p.course_id)}`
                  + (p.currency ? `&currency=${encodeURIComponent(p.currency)}` : '')
                  + (p.amount_paid ? `&amountPaid=${encodeURIComponent(p.amount_paid)}` : ''),
                calUrl: p.format === 'one-on-one' ? `${workerOrigin}/api/cal-redirect?txId=${encodeURIComponent(p.transaction_id)}&email=${encodeURIComponent(normalizedEmail)}` : null,
                calendlyUrl: p.format === 'one-on-one' ? `${workerOrigin}/api/cal-redirect?txId=${encodeURIComponent(p.transaction_id)}&email=${encodeURIComponent(normalizedEmail)}` : null
              }));
            }
          } catch (dbErr) {
            console.error('D1 fetch purchases error:', dbErr);
          }
        }

        // Fallback demo purchase if DB is not attached during dev testing
        if (purchases.length === 0) {
          const fallbackToken = `token_${Date.now()}`;
          purchases = [
            {
              id: 'purch_vibe_coding',
              courseId: 'vibe-coding',
              format: 'pdf',
              customerName: 'Valued Student',
              transactionId: 'FLW_DEMO_VERIFIED',
              purchasedAt: new Date().toISOString(),
              r2DownloadLink: `${workerOrigin}/api/download-course-pdf?token=${fallbackToken}&courseId=vibe-coding`,
              receiptLink: `${workerOrigin}/api/download-receipt?txId=FLW_DEMO_VERIFIED&email=${encodeURIComponent(normalizedEmail)}&courseId=vibe-coding`,
              calendlyUrl: null
            }
          ];
        }

        return new Response(
          JSON.stringify({ success: true, purchases, sessionToken: request._sessionToken || undefined }),
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
    // ROUTE 5.5: GET /api/student-purchases (Fetch Student Purchases by Email — Requires Session Token)
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'GET' && (url.pathname.endsWith('/api/student-purchases') || url.pathname.endsWith('/api/portal/purchases'))) {
      try {
        const emailParam = url.searchParams.get('email') || '';
        const sessionTokenParam = url.searchParams.get('token') || request.headers.get('X-Session-Token') || '';

        if (!emailParam) {
          return new Response(
            JSON.stringify({ error: 'Missing email parameter.' }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }
        if (!sessionTokenParam) {
          return new Response(
            JSON.stringify({ error: 'Unauthorized: Missing session token. Please log in again.' }),
            { status: 401, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        const normalizedEmail = String(emailParam).trim().toLowerCase();

        // Validate session token
        if (env.DB) {
          try {
            const sessRecord = await env.DB.prepare(`
              SELECT * FROM session_tokens
              WHERE token = ? AND LOWER(email) = ? AND expires_at > datetime('now')
            `).bind(sessionTokenParam, normalizedEmail).first();
            if (!sessRecord) {
              return new Response(
                JSON.stringify({ error: 'Unauthorized: Invalid or expired session. Please log in again.' }),
                { status: 401, headers: { ...headers, 'Content-Type': 'application/json' } }
              );
            }
          } catch (sessErr) {
            console.error('Session token validation error:', sessErr);
          }
        }

        const workerOrigin = new URL(request.url).origin;
        let purchases = [];

        if (env.DB) {
          try {
            const { results } = await env.DB.prepare(`
              SELECT * FROM purchases WHERE LOWER(email) = ? ORDER BY purchased_at DESC
            `).bind(normalizedEmail).all();

            if (results && results.length > 0) {
              purchases = results.map(p => ({
                id: p.id,
                courseId: p.course_id,
                format: p.format,
                itemType: p.item_type || 'course',
                customerName: p.customer_name,
                transactionId: p.transaction_id,
                purchasedAt: p.purchased_at,
                sessionBooked: Number(p.session_booked) === 1,
                rescheduleLink: p.reschedule_link || null,
                meetingStartTime: p.meeting_start_time || null,
                noShow: Number(p.no_show) === 1,
                meetingAttended: Number(p.meeting_attended) === 1,
                certificateSent: Number(p.certificate_sent) === 1,
                refundRequested: Number(p.refund_requested) === 1,
                r2DownloadLink: p.item_type === 'product'
                  ? `${workerOrigin}/api/download-product-zip?token=${p.download_token}&productId=${p.course_id}`
                  : `${workerOrigin}/api/download-course-pdf?token=${p.download_token}&courseId=${p.course_id}`,
                receiptLink: `${workerOrigin}/api/download-receipt?txId=${encodeURIComponent(p.transaction_id)}&email=${encodeURIComponent(normalizedEmail)}&courseId=${encodeURIComponent(p.course_id)}`
                  + (p.currency ? `&currency=${encodeURIComponent(p.currency)}` : '')
                  + (p.amount_paid ? `&amountPaid=${encodeURIComponent(p.amount_paid)}` : ''),
                calUrl: p.format === 'one-on-one' ? `${workerOrigin}/api/cal-redirect?txId=${encodeURIComponent(p.transaction_id)}&email=${encodeURIComponent(normalizedEmail)}` : null,
                calendlyUrl: p.format === 'one-on-one' ? `${workerOrigin}/api/cal-redirect?txId=${encodeURIComponent(p.transaction_id)}&email=${encodeURIComponent(normalizedEmail)}` : null
              }));
            }
          } catch (dbErr) {
            console.error('D1 fetch student purchases error:', dbErr);
          }
        }

        return new Response(
          JSON.stringify({ success: true, purchases }),
          { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({ error: err.message || 'Internal Server Error' }),
          { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
        );
      }
    }
    if (request.method === 'POST' && (url.pathname === '/' || url.pathname.endsWith('/delete-account'))) {
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
            from: 'admin@afigo.sampidia.com',
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
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ROUTE 8: GET /share or GET /api/share
    // Server-Side OpenGraph HTML Generator for WhatsApp, iMessage, Facebook & Twitter
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'GET' && (url.pathname.includes('/share') || url.pathname.includes('/og'))) {
      const type = url.searchParams.get('type') || 'course';
      const id = url.searchParams.get('id') || 'vibe-coding';

      const metadataMap = {
        // Masterclasses
        'course:vibe-coding': {
          title: 'Vibe Coding: Building High-End Android Apps with Android Studio & Antigravity + AI',
          description: 'Master AI-Assisted Native Android App Engineering from Scratch with Afigo Sam. Includes complete blueprint PDF + direct 1-on-1 mentorship.',
          ogImage: 'https://afigo.sampidia.com/assets/og-vibe-coding.jpg',
          targetUrl: 'https://afigo.sampidia.com/#/course/vibe-coding'
        },
        'course:zero-to-n8n': {
          title: 'Zero to n8n — Free Hosting Mastered',
          description: 'Self-Host Enterprise AI Automation Pipelines for ₦0/Month with Afigo Sam. Includes complete PDF blueprint + 1-on-1 mentorship.',
          ogImage: 'https://afigo.sampidia.com/assets/og-zero-to-n8n.jpg',
          targetUrl: 'https://afigo.sampidia.com/#/course/zero-to-n8n'
        },
        // Products / Plugins
        'product:ai-content-generator': {
          title: 'WordPress AI-Powered Automatic Content Generator ($25)',
          description: 'Automatically generate, optimize, and publish high-ranking blog posts using GPT-4o, Gemini, Claude 3.5 & DeepSeek directly in WordPress.',
          ogImage: 'https://afigo.sampidia.com/assets/og-ai-content-generator.jpg',
          targetUrl: 'https://afigo.sampidia.com/#/product/ai-content-generator'
        },
        'product:my-licenses-manager': {
          title: 'My Licenses Manager — Free WordPress Plugin',
          description: 'Central license server to remotely manage WordPress plugins and digital assets with Envato Marketplace API integration.',
          ogImage: 'https://afigo.sampidia.com/assets/og-my-licenses-manager.jpg',
          targetUrl: 'https://afigo.sampidia.com/#/product/my-licenses-manager'
        },
        // Mobile Apps
        'app:naija-ayo-worldwide': {
          title: 'Naija Ayo Worldwide — Traditional Board Game for Android',
          description: 'Play the authentic traditional African Ayo/Mancala strategy game on mobile with smart AI opponents and pass-and-play multiplayer.',
          ogImage: 'https://afigo.sampidia.com/assets/og-naija-ayo-worldwide.jpg',
          targetUrl: 'https://afigo.sampidia.com/#/app/naija-ayo-worldwide'
        }
      };

      const key = `${type}:${id}`;
      const meta = metadataMap[key] || {
        title: 'Oghenekaro Samson Afigo | Full-Stack Developer & AI Automation Engineer',
        description: 'Full-Stack Web & Mobile Developer, Published n8n AI Workflow Creator, and M.Sc. Industrial Chemist.',
        ogImage: 'https://afigo.sampidia.com/assets/og-preview.jpg',
        targetUrl: `https://afigo.sampidia.com/#/${type}/${id}`
      };

      const html = `<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}">

  <!-- Open Graph / WhatsApp / Facebook / LinkedIn / iMessage -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${meta.targetUrl}">
  <meta property="og:title" content="${meta.title}">
  <meta property="og:description" content="${meta.description}">
  <meta property="og:image" content="${meta.ogImage}">
  <meta property="og:image:secure_url" content="${meta.ogImage}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Afigo-Sam | SamPidia">

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${meta.title}">
  <meta name="twitter:description" content="${meta.description}">
  <meta name="twitter:image" content="${meta.ogImage}">

  <!-- Automatic Client Redirect -->
  <script>
    window.location.href = "${meta.targetUrl}";
  </script>
  <meta http-equiv="refresh" content="0;url=${meta.targetUrl}">
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 60px 20px; background-color: #090d16; color: #f3f4f6;">
  <div style="max-width: 500px; margin: 0 auto; background: #111827; padding: 30px; border-radius: 16px; border: 1px solid #1f2937;">
    <h2 style="color: #ef4444; margin-bottom: 10px;">${meta.title}</h2>
    <p style="color: #9ca3af; font-size: 14px; line-height: 1.5;">${meta.description}</p>
    <p style="margin-top: 20px;"><a href="${meta.targetUrl}" style="display: inline-block; background: #dc2626; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Open Page →</a></p>
  </div>
</body>
</html>`;

      return new Response(html, {
        status: 200,
        headers: {
          ...headers,
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ROUTE 9: POST /api/trigger-drip-cron (Manual or Test Trigger for Email Drip)
    // ─────────────────────────────────────────────────────────────────────────
    if ((request.method === 'POST' || request.method === 'GET') && url.pathname.includes('/api/trigger-drip-cron')) {
      const summary = await processDailyDripEmails(env);
      return new Response(JSON.stringify(summary), {
        status: 200,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // Default 404 Handler for Unmatched Endpoints
    return new Response(
      JSON.stringify({ error: 'Endpoint not found. Please verify the URL route.' }),
      { status: 404, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CLOUDFLARE SCHEDULED CRON TRIGGER (Runs Daily)
  // ─────────────────────────────────────────────────────────────────────────
  async scheduled(event, env, ctx) {
    ctx.waitUntil(processDailyDripEmails(env));
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTION: Process Daily Drip & Cross-Sell Email Sequences
// ─────────────────────────────────────────────────────────────────────────────
async function processDailyDripEmails(env) {
  const results = { day3Count: 0, day7Count: 0, day14Count: 0, errors: [] };

  if (!env.DB || !env.RESEND_API_KEY) {
    console.log('[Drip Cron] Skipped: Missing env.DB or env.RESEND_API_KEY');
    return { status: 'skipped', reason: 'Missing env.DB or env.RESEND_API_KEY' };
  }

  try {
    // 1. Ensure drip_logs tracking table exists
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS drip_logs (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        drip_step TEXT NOT NULL,
        sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    const now = Date.now();
    const DAY_MS = 24 * 60 * 60 * 1000;

    // Helper: Check if drip step was already sent to email
    async function hasReceivedDrip(email, dripStep) {
      const row = await env.DB.prepare(`
        SELECT id FROM drip_logs WHERE LOWER(email) = ? AND drip_step = ?
      `).bind(email.toLowerCase(), dripStep).first();
      return !!row;
    }

    // Helper: Mark drip step as sent in D1
    async function markDripSent(email, dripStep) {
      await env.DB.prepare(`
        INSERT OR IGNORE INTO drip_logs (id, email, drip_step)
        VALUES (?, ?, ?)
      `).bind(`drip_${dripStep}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, email.toLowerCase(), dripStep).run();
    }

    // Fetch all purchasers from D1
    const { results: purchases } = await env.DB.prepare(`
      SELECT DISTINCT email, customer_name, course_id, item_type, purchased_at FROM purchases ORDER BY purchased_at DESC
    `).all();

    if (!purchases || purchases.length === 0) {
      return { status: 'success', message: 'No purchasers found in database', ...results };
    }

    for (const p of purchases) {
      const email = String(p.email || '').trim().toLowerCase();
      const customerName = p.customer_name || 'Valued Student';
      const itemType = p.item_type || 'course';

      if (!email || !email.includes('@')) continue;

      // Calculate days since purchase
      const purchasedTime = p.purchased_at ? new Date(p.purchased_at).getTime() : now;
      const daysSincePurchase = (now - purchasedTime) / DAY_MS;

      // ───────────────────────────────────────────────────────────────────────
      // DAY 3 DRIP: Check-in & Antigravity AI Prompting Tips
      // ───────────────────────────────────────────────────────────────────────
      if (daysSincePurchase >= 3 && daysSincePurchase < 7) {
        const alreadySent = await hasReceivedDrip(email, 'day_3');
        if (!alreadySent) {
          const resendRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${env.RESEND_API_KEY}`
            },
            body: JSON.stringify({
              from: 'admin@afigo.sampidia.com',
              to: email,
              subject: `⚡ Quick Check-in: How is your Vibe Coding setup going, ${customerName}?`,
              html: `
                <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; color: #1e293b; line-height: 1.6;">
                  <h2 style="color: #dc2626;">Hey ${customerName}! 👋</h2>
                  <p>It's Afigo Sam here. I noticed you grabbed our masterclass blueprint a few days ago, and I wanted to check in!</p>
                  
                  <p>How is your <strong>Android Studio + Antigravity AI</strong> setup coming along?</p>

                  <div style="background-color: #f8fafc; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <p style="margin: 0; font-weight: bold; color: #0f172a;">💡 Quick Pro Tip from Module 1:</p>
                    <p style="margin: 5px 0 0; font-size: 14px; color: #475569;">When asking Antigravity to write Kotlin layout code, always specify: <em>"Use ConstraintLayout or LazyColumn with dark mode tailwind-style palette and explicit accessibility IDs."</em> This eliminates 95% of layout bugs instantly!</p>
                  </div>

                  <p>If you have any questions or get stuck on any error, just hit reply to this email. I read every message personally.</p>

                  <p style="margin-top: 30px; border-top: 1px solid #e2e8f0; pt-20px; font-size: 13px; color: #64748b;">
                    Keep building,<br>
                    <strong>Oghenekaro Samson Afigo</strong><br>
                    Founder, Afigo-Sam Technology & SamPidia
                  </p>
                </div>
              `
            })
          });

          if (resendRes.ok) {
            await markDripSent(email, 'day_3');
            results.day3Count++;
          }
        }
      }

      // ───────────────────────────────────────────────────────────────────────
      // DAY 7 DRIP: 1-on-1 Mentorship & Live Code Review Upgrade
      // ───────────────────────────────────────────────────────────────────────
      if (daysSincePurchase >= 7 && daysSincePurchase < 14) {
        const alreadySent = await hasReceivedDrip(email, 'day_7');
        if (!alreadySent) {
          const resendRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${env.RESEND_API_KEY}`
            },
            body: JSON.stringify({
              from: 'admin@afigo.sampidia.com',
              to: email,
              subject: `🎥 Want me to review your app & code live on video, ${customerName}?`,
              html: `
                <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; color: #1e293b; line-height: 1.6;">
                  <h2 style="color: #dc2626;">Take Your Project to the Next Level 🚀</h2>
                  <p>Hi ${customerName},</p>
                  <p>By now, you should have reviewed the <strong>Vibe Coding Masterclass</strong> guide. If you want to accelerate your development and skip weeks of trial and error, I'm offering direct 1-on-1 video mentorship sessions.</p>

                  <div style="background-color: #0f172a; border-radius: 12px; padding: 20px; color: #ffffff; margin: 25px 0;">
                    <span style="background: #ef4444; color: #fff; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 4px;">1-ON-1 LIVE MENTORSHIP</span>
                    <h3 style="margin: 10px 0 5px; color: #ffffff;">Direct Video Coaching with Afigo Sam</h3>
                    <p style="color: #94a3b8; font-size: 13px; margin-bottom: 15px;">Book a dedicated 30-minute 1-on-1 Zoom or Google Meet slot where we review your project, solve Kotlin/Gradle bugs live, and optimize your app architecture.</p>
                    <a href="https://afigo.sampidia.com/#/course/vibe-coding?format=one-on-one" style="background: #ef4444; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; display: inline-block;">Book Live Mentorship Slot →</a>
                  </div>

                  <p style="font-size: 13px; color: #64748b;">Best regards,<br><strong>Afigo Sam</strong></p>
                </div>
              `
            })
          });

          if (resendRes.ok) {
            await markDripSent(email, 'day_7');
            results.day7Count++;
          }
        }
      }

      // ───────────────────────────────────────────────────────────────────────
      // DAY 14 DRIP: WordPress AI Content Generator Tool Cross-Sell
      // ───────────────────────────────────────────────────────────────────────
      if (daysSincePurchase >= 14) {
        const alreadySent = await hasReceivedDrip(email, 'day_14');
        if (!alreadySent) {
          const resendRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${env.RESEND_API_KEY}`
            },
            body: JSON.stringify({
              from: 'admin@afigo.sampidia.com',
              to: email,
              subject: `🔌 Automate your website content & traffic with AI, ${customerName}`,
              html: `
                <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; color: #1e293b; line-height: 1.6;">
                  <h2 style="color: #dc2626;">Automate Your Web Traffic 📈</h2>
                  <p>Hi ${customerName},</p>
                  <p>Whether you are building mobile apps or managing websites, driving organic search traffic is essential.</p>
                  <p>I built the <strong>WordPress AI-Powered Automatic Content Generator ($25)</strong> to automatically write, optimize, and publish high-ranking blog posts using OpenAI GPT-4o, Google Gemini, Claude 3.5, and DeepSeek.</p>

                  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 25px 0;">
                    <h3 style="margin: 0 0 8px; color: #0f172a;">WordPress AI Content Generator ($25 USD)</h3>
                    <p style="color: #475569; font-size: 13px; margin: 0 0 15px;">Bulk article generation, automatic DALL-E 3 image creation, SEO auto-optimization, and automated publishing scheduling.</p>
                    <a href="https://afigo.sampidia.com/#/product/ai-content-generator" style="background: #0f172a; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; display: inline-block;">View Plugin Details →</a>
                  </div>

                  <p style="font-size: 13px; color: #64748b;">Happy building,<br><strong>Afigo Sam</strong></p>
                </div>
              `
            })
          });

          if (resendRes.ok) {
            await markDripSent(email, 'day_14');
            results.day14Count++;
          }
        }
      }
    }

    return { status: 'success', ...results };
  } catch (err) {
    console.error('[Drip Cron Error]:', err);
    return { status: 'error', error: err.message, ...results };
  }
}
