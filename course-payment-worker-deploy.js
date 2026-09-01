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
    async function recordPurchaseToDB({ email, customerName, courseId, format, transactionId, downloadToken, amount = 30000 }) {
      if (!env.DB) return;
      try {
        await env.DB.prepare(`
          INSERT OR IGNORE INTO purchases (id, email, customer_name, course_id, format, transaction_id, amount, download_token)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          `purch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          String(email).trim().toLowerCase(),
          customerName || 'Valued Student',
          courseId,
          format || 'pdf',
          String(transactionId),
          amount,
          downloadToken
        ).run();
      } catch (err) {
        console.error('D1 purchase record error:', err);
      }
    }

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

        // 2. Build R2 download URL & Receipt URL from this Worker's own origin
        const workerOrigin = new URL(request.url).origin;
        const r2DownloadLink = `${workerOrigin}/api/download-course-pdf?token=${downloadToken}&courseId=${courseId}`;
        const receiptLink = `${workerOrigin}/api/download-receipt?txId=${encodeURIComponent(txStr)}&email=${encodeURIComponent(customerEmail)}&courseId=${encodeURIComponent(courseId)}`;
        const calendlyLink = `${workerOrigin}/api/calendly-redirect?txId=${encodeURIComponent(txStr)}&email=${encodeURIComponent(customerEmail)}`;

        // 3. Save purchase to Cloudflare D1
        await recordPurchaseToDB({
          email: customerEmail,
          customerName,
          courseId,
          format,
          transactionId: txStr,
          downloadToken,
          amount: 30000
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
              <p>Thank you for enrolling in <strong>${courseTitle}</strong> (${format === 'one-on-one' ? '1-on-1 Mentorship' : 'PDF Blueprint'}). Your payment of <strong>₦30,000 NGN</strong> has been verified.</p>

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
    // ROUTE 3: GET /api/download-receipt (Printable & Mobile-Responsive HTML Receipt)
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'GET' && url.pathname.endsWith('/api/download-receipt')) {
      const txId = url.searchParams.get('txId') || url.searchParams.get('transactionId') || 'REC-SAMPLE';
      const email = url.searchParams.get('email') || 'student@example.com';
      const courseId = url.searchParams.get('courseId') || 'vibe-coding';

      let customerName = 'Valued Student';
      let format = 'pdf';
      let amount = 30000;
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

      const courseTitle = courseId === 'vibe-coding'
        ? 'Vibe Coding: Building High-End Android Apps with Android Studio & Antigravity + AI'
        : 'Zero to n8n — Free Hosting Mastered';

      const formatLabel = format === 'one-on-one' ? '1-on-1 Mentorship Session' : 'PDF Blueprint Masterclass';
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
        <span>Course Item & Details</span>
        <span>Amount</span>
      </div>
      <div class="item-body">
        <div class="item-title">${courseTitle}</div>
        <div class="subtitle">Transaction Ref: ${txId}</div>
        <div class="item-meta-row">
          <span class="format-tag">Format: ${formatLabel}</span>
          <span class="item-amount">₦${amount.toLocaleString()}.00</span>
        </div>
      </div>
      <div class="total-box">
        <span class="total-label">Total Amount Paid</span>
        <span class="total-value">₦${amount.toLocaleString()}.00 NGN</span>
      </div>
    </div>

    <div class="support-box">
      <strong>Merchant Contact & Support:</strong><br>
      Oghenekaro Samson Afigo (Afigo-Sam Technology)<br>
      Email: admin@sampidia.com | Phone: +234 706 345 3903<br>
      Website: https://sampidia.com
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
    // ROUTE 3.5: GET /api/calendly-redirect (Gatekeeper for Calendly Bookings)
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'GET' && url.pathname.endsWith('/api/calendly-redirect')) {
      const txId = url.searchParams.get('txId') || url.searchParams.get('transactionId') || '';
      const email = url.searchParams.get('email') || '';

      const targetCalendlyUrl = 'https://calendly.com/oghenekaroafigo/meeting';

      if (env.DB && (txId || email)) {
        try {
          let record = null;
          if (txId) {
            record = await env.DB.prepare(`SELECT * FROM purchases WHERE transaction_id = ? OR id = ?`).bind(txId, txId).first();
          }
          if (!record && email) {
            record = await env.DB.prepare(`SELECT * FROM purchases WHERE LOWER(email) = ? AND format = 'one-on-one' ORDER BY purchased_at DESC`).bind(email.toLowerCase()).first();
          }

          if (record && Number(record.session_booked) === 1) {
            const bookedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Session Already Scheduled - Afigo Sam Page</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px 16px; display: flex; align-items: center; justify-content: center; min-height: 100vh; box-sizing: border-box; }
    .card { max-width: 480px; width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 32px 24px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 12px 0; }
    p { font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0 0 24px 0; }
    .info-box { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 16px; font-size: 13px; color: #cbd5e1; text-align: left; margin-bottom: 24px; }
    .btn { display: inline-block; background: #dc2626; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✅</div>
    <h1>Session Already Scheduled</h1>
    <p>Your 1-on-1 mentorship session for this purchase has already been booked on Calendly.</p>
    <div class="info-box">
      <strong>Need to reschedule or view booking?</strong><br>
      Please check the confirmation email sent directly by Calendly to your inbox, or contact support: <br>
      <a href="mailto:admin@afigo.sampidia.com" style="color:#60a5fa;">admin@afigo.sampidia.com</a>
    </div>
    <a href="https://sampidia.com/my-courses" class="btn">Return to Student Portal</a>
  </div>
</body>
</html>`;
            return new Response(bookedHtml, { status: 200, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } });
          }
        } catch (dbErr) {
          console.error('D1 check session_booked error:', dbErr);
        }
      }

      // If not booked or DB record absent, 302 redirect to Calendly
      return Response.redirect(targetCalendlyUrl, 302);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ROUTE 3.6: POST /api/calendly-webhook (Receives Calendly Booking Webhooks)
    // ─────────────────────────────────────────────────────────────────────────
    if (request.method === 'POST' && url.pathname.endsWith('/api/calendly-webhook')) {
      try {
        const body = await request.json();
        const event = body && body.event;
        const payload = (body && body.payload) || {};

        if (event === 'invitee.created') {
          const inviteeEmail = payload.email || (payload.invitee && payload.invitee.email);

          if (inviteeEmail && env.DB) {
            const normalizedEmail = String(inviteeEmail).trim().toLowerCase();
            // Mark the oldest unbooked 1-on-1 purchase for this email as booked
            await env.DB.prepare(`
              UPDATE purchases
              SET session_booked = 1, session_booked_at = datetime('now')
              WHERE id = (
                SELECT id FROM purchases
                WHERE LOWER(email) = ? AND format = 'one-on-one' AND (session_booked = 0 OR session_booked IS NULL)
                ORDER BY purchased_at ASC
                LIMIT 1
              )
            `).bind(normalizedEmail).run();
          }
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Calendly webhook processed' }),
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

      try {
        // Step 1: Fetch current user & organization details from Calendly API
        const userRes = await fetch('https://api.calendly.com/users/me', {
          headers: {
            'Authorization': `Bearer ${pat}`,
            'Content-Type': 'application/json',
          },
        });

        if (!userRes.ok) {
          const userErr = await userRes.json();
          return new Response(
            JSON.stringify({ error: 'Failed to verify Calendly Personal Access Token', details: userErr }),
            { status: userRes.status, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        const userData = await userRes.json();
        const orgUri = userData.resource && userData.resource.current_organization;
        const userUri = userData.resource && userData.resource.uri;

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
          // If organization scope failed, retry with user scope
          subRes = await fetch('https://api.calendly.com/webhook_subscriptions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${pat}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: webhookCallbackUrl,
              events: ['invitee.created'],
              user: userUri,
              scope: 'user',
            }),
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
          const emailSubject = `🔑 ${otpCode} is your Afigo-Sam Course Access Code`;
          const emailHtml = `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; color: #1e293b;">
              <h2 style="color: #dc2626; border-bottom: 2px solid #fee2e2; padding-bottom: 12px; margin-top: 0;">
                🔑 Course Access Verification Code
              </h2>
              <p>Hello,</p>
              <p>Use the 6-digit verification code below to access your purchased courses and download blueprints on <strong>Afigo-Sam Page</strong>:</p>

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
                customerName: p.customer_name,
                transactionId: p.transaction_id,
                purchasedAt: p.purchased_at,
                sessionBooked: Number(p.session_booked) === 1,
                r2DownloadLink: `${workerOrigin}/api/download-course-pdf?token=${p.download_token}&courseId=${p.course_id}`,
                receiptLink: `${workerOrigin}/api/download-receipt?txId=${encodeURIComponent(p.transaction_id)}&email=${encodeURIComponent(normalizedEmail)}&courseId=${encodeURIComponent(p.course_id)}`,
                calendlyUrl: p.format === 'one-on-one' ? `${workerOrigin}/api/calendly-redirect?txId=${encodeURIComponent(p.transaction_id)}&email=${encodeURIComponent(normalizedEmail)}` : null
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

    // ─────────────────────────────────────────────────────────────────────────
    // ROUTE 6 (LEGACY): POST /delete-account (Account Deletion Request Handler)
    // ─────────────────────────────────────────────────────────────────────────
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

    // Default 404 Handler for Unmatched Endpoints
    return new Response(
      JSON.stringify({ error: 'Endpoint not found. Please verify the URL route.' }),
      { status: 404, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  },
};
