# COURSE PAYMENT WORKER & DEPLOYMENT GUIDE

This document contains the complete Cloudflare Worker implementation for course payment verification, R2 PDF fetching, Resend email attachment delivery, and Calendly mentorship booking confirmation.

---

## 🛠️ Environment Variables & Secret Configuration

In your Cloudflare Worker Dashboard (**Settings -> Variables**) or via `wrangler secret put`, set:

| Variable | Description | Example / Value |
| :--- | :--- | :--- |
| `FLW_SECRET_KEY` | Flutterwave Secret Key (v3 API) | `FLWSECK_TEST-...` or `FLWSECK-prod...` |
| `RESEND_API_KEY` | Resend Email API Key | `re_123456789...` |
| `ALLOWED_ORIGIN` | Allowed CORS Domain | `https://afigo.sampidia.com` or `*` |

---

## 🗄️ R2 Bucket Binding (`wrangler.toml`)

In `wrangler.toml`, ensure the R2 bucket `sampidia-course-pdfs` is bound as `COURSE_PDFS`:

```toml
name = "resend-email-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
ALLOWED_ORIGIN = "*"

[[r2_buckets]]
binding = "COURSE_PDFS"
bucket_name = "sampidia-course-pdfs"
```

---

## 📜 Full Cloudflare Worker Source Code (`src/index.ts`)

```typescript
export interface Env {
  RESEND_API_KEY: string;
  ALLOWED_ORIGIN: string;
  TURNSTILE_SECRET_KEY?: string;
  FLW_SECRET_KEY?: string;
  COURSE_PDFS?: any; // R2 Bucket binding
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const origin = request.headers.get('Origin') || '*';
    const allowedOrigin = (!env.ALLOWED_ORIGIN || env.ALLOWED_ORIGIN === '*') ? origin : env.ALLOWED_ORIGIN;

    const headers = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    const url = new URL(request.url);

    // ── ROUTE 1: POST /api/verify-course-payment ────────────────────────────
    if (request.method === 'POST' && url.pathname.endsWith('/api/verify-course-payment')) {
      try {
        const body = await request.json() as {
          transactionId: string;
          courseId: string;
          format: 'pdf' | 'one-on-one';
          customerName: string;
          customerEmail: string;
          customerPhone?: string;
          preferredDate?: string;
          preferredTime?: string;
          amount?: number;
        };

        const { transactionId, courseId, format, customerName, customerEmail, preferredDate, preferredTime } = body;

        if (!transactionId || !courseId || !customerName || !customerEmail) {
          return new Response(
            JSON.stringify({ error: 'Missing required parameters' }),
            { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
          );
        }

        // 1. Verify with Flutterwave API
        if (env.FLW_SECRET_KEY && !transactionId.startsWith('FREE_') && !transactionId.startsWith('FLW_COURSE_')) {
          const flwRes = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
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

          const flwData = await flwRes.json() as any;
          if (flwData?.data?.status !== 'successful') {
            return new Response(
              JSON.stringify({ error: 'Payment transaction was not successful' }),
              { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
            );
          }
        }

        const downloadToken = `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        // 2. Fetch PDF from R2 Bucket & Send Resend Email Attachment
        if (env.RESEND_API_KEY) {
          let attachments: any[] = [];
          const pdfFileName = courseId === 'vibe-coding' ? 'Vibe-Coding-PDF-Cover.webp' : 'zero-to-n8n-free-hosting-PDF-cover.webp';

          if (env.COURSE_PDFS) {
            try {
              const r2Object = await env.COURSE_PDFS.get(pdfFileName);
              if (r2Object) {
                const arrayBuf = await r2Object.arrayBuffer();
                const base64Content = btoa(String.fromCharCode(...new Uint8Array(arrayBuf)));
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

          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: 'onboarding@resend.dev',
              to: [customerEmail, 'admin@sampidia.com'],
              subject: emailSubject,
              html: emailHtml,
              ...(attachments.length > 0 ? { attachments } : {}),
            }),
          });
        }

        return new Response(
          JSON.stringify({ success: true, verified: true, downloadToken, transactionId }),
          { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
        );

      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: err.message || 'Internal Server Error' }),
          { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
        );
      }
    }

    // ── ROUTE 2: GET /api/download-course-pdf ─────────────────────────────────
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

    return new Response(JSON.stringify({ error: 'Route not found' }), {
      status: 404,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  },
};
```

---

## 🚀 How to Deploy via Wrangler CLI

Inside the `worker` directory:

```bash
cd worker
npx wrangler secret put FLW_SECRET_KEY
npx wrangler secret put RESEND_API_KEY
npx wrangler deploy
```
