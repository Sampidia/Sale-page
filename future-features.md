# Future Features & Improvements

## 1. Token-Gated PDF Downloads via Cloudflare KV

A future improvement would be to store tokens in Cloudflare KV and validate them on download, enforcing one-time or expiring access. Not in scope for this fix.

### How It Would Work

1. **On payment verification** (`POST /api/verify-course-payment`): Store the generated `downloadToken` in **Cloudflare KV** with the `courseId` and a TTL (e.g., 72 hours or 10 uses).

   ```js
   await env.DOWNLOAD_TOKENS.put(downloadToken, JSON.stringify({ courseId, used: 0, maxUses: 5 }), {
     expirationTtl: 60 * 60 * 72, // 72 hours
   });
   ```

2. **On PDF download** (`GET /api/download-course-pdf`): Validate the token from KV before streaming the R2 object.

   ```js
   const tokenData = await env.DOWNLOAD_TOKENS.get(token, { type: 'json' });
   if (!tokenData || tokenData.used >= tokenData.maxUses) {
     return new Response(JSON.stringify({ error: 'Invalid or expired download link' }), { status: 403 });
   }
   // Increment usage count
   await env.DOWNLOAD_TOKENS.put(token, JSON.stringify({ ...tokenData, used: tokenData.used + 1 }), {
     expirationTtl: 60 * 60 * 72,
   });
   // Stream PDF from R2...
   ```

3. **Cloudflare Dashboard setup**: Add a **KV Namespace Binding** named `DOWNLOAD_TOKENS` in Worker Settings → Variables.

### Benefits
- Prevents unauthorized sharing of download links
- Supports expiring and one-time-use access controls
- Zero cost (Cloudflare KV free tier includes 100,000 reads/day)

---

## 2. Flutterwave Webhook Verification (Secondary Confirmation) — ✅ IMPLEMENTED

In addition to synchronous payment verification via `/v3/transactions/{id}/verify`, the Worker now supports secondary server-to-server webhook confirmation at `POST /api/flw-webhook`.

### How It Works & Setup

1. **Endpoint**: `POST /api/flw-webhook`
2. **Security**: Verifies the `verif-hash` header attached to incoming requests against `env.FLW_WEBHOOK_HASH`.
3. **Flutterwave Setup**:
   - Navigate to **Flutterwave Dashboard → Settings → Webhooks**.
   - Set Secret Hash to a secure secret value.
   - Set Secret Hash in Cloudflare Worker secret variables: `FLW_WEBHOOK_HASH`.
   - Set Webhook URL to `https://<your-worker-domain>/api/flw-webhook`.

### Benefits
1. 🛡️ Security & Anti-Spoofing (`verif-hash` Validation)
2. ⚡ Protection Against Client Drop-offs & Tab Closures
3. ⏳ Support for Asynchronous & Delayed Payment Methods
4. 🔄 Idempotency & Prevention of Double Fulfillments
---

## 3. Purchase Receipt PDF (Generated Receipts)

Auto-generate a branded HTML/PDF purchase receipt (order number, transaction ref, date, customer name & email, course item breakdown, amount paid in NGN/USD, merchant details) and deliver it as a downloadable PDF document or email attachment via Cloudflare Worker & Resend API.

### How It Would Work

1. **Receipt Data Model & HTML Template**:
   - **Receipt Ref**: `REC-${Date.now()}-${transactionId.slice(-6)}`
   - **Fields**: Order Date, Customer Name, Email Address, Course Title, Format (PDF Masterclass vs 1-on-1 Mentorship), Payment Provider (Flutterwave), Total Paid (`₦30,000 NGN`).
   - **HTML Invoice**: Clean HTML/CSS layout generated inside the Worker with print styling (`@media print`) and inline SVG branding.

2. **PDF Generation Architecture Options**:

   - **Option A (Recommended Cloudflare Native): Cloudflare Browser Rendering API**
     - Enable **Browser Rendering** on Cloudflare Workers (`@cloudflare/puppeteer`).
     - Render the receipt HTML template in headless Chrome within the Worker isolate and output a binary PDF buffer:
       ```javascript
       const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
       return new Response(pdfBuffer, {
         headers: { 'Content-Type': 'application/pdf' }
       });
       ```

   - **Option B (Resend Email PDF Attachment)**
     - Generate HTML invoice and pass it as an attachment buffer or PDF stream via Resend API:
       ```javascript
       attachments: [
         {
           filename: `Sampidia-Receipt-${receiptRef}.pdf`,
           content: pdfBuffer.toString('base64'),
         }
       ]
       ```

3. **API Endpoint Architecture (`GET /api/download-receipt`)**:
   - **Endpoint**: `GET /api/download-receipt?txId=FLW_123456&email=buyer@example.com`
   - **Security**: Verifies transaction ID against Flutterwave verification endpoint or KV/D1 stored records.
   - **Response**: Streams `application/pdf` directly to the buyer's browser with `Content-Disposition: attachment; filename="Sampidia-Receipt-{txId}.pdf"`.

4. **Front-End Integration (`App.tsx`)**:
   - Add a **"📄 Download Official Receipt (PDF)"** button to the purchase success modal and confirmation state.

### Benefits
- 🧾 **Tax & Accounting Compliance**: Provides buyers with official proof of payment for business expense reimbursement.
- 💼 **Professional Branding**: Builds trust and delivers an enterprise-grade post-purchase experience.
- ⚡ **Automated Delivery**: Completely hands-free invoice generation and email dispatch.

---

## 4. Course Access Dashboard (Post-Purchase Portal)

A lightweight post-purchase portal view (`/my-courses`) that allows students to enter their purchase email address, receive a passwordless magic verification link/OTP, and access all their purchased course downloads, Calendly mentorship booking links, and transaction receipts in one central place — backed by **Cloudflare D1 (SQLite)**.

### How It Would Work

1. **Database Schema (Cloudflare D1 - SQLite)**:
   Create a D1 SQLite database `course_portal_db` with tables for purchases and passwordless verification tokens:

   ```sql
   -- Purchases table to track student order records
   CREATE TABLE IF NOT EXISTS purchases (
     id TEXT PRIMARY KEY,
     email TEXT NOT NULL,
     customer_name TEXT NOT NULL,
     course_id TEXT NOT NULL,
     format TEXT NOT NULL, -- 'pdf' | 'one-on-one'
     transaction_id TEXT UNIQUE NOT NULL,
     amount INTEGER NOT NULL,
     download_token TEXT NOT NULL,
     purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );
   CREATE INDEX IF NOT EXISTS idx_purchases_email ON purchases(email);

   -- Passwordless OTP access tokens table
   CREATE TABLE IF NOT EXISTS access_tokens (
     token TEXT PRIMARY KEY,
     email TEXT NOT NULL,
     expires_at DATETIME NOT NULL,
     used INTEGER DEFAULT 0
   );
   ```

2. **Cloudflare Worker Integration Routes**:

   - **Auto-Record Purchase (`POST /api/verify-course-payment` & `POST /api/flw-webhook`)**:
     Upon successful payment verification or webhook confirmation, insert or update the transaction in D1:
     ```javascript
     await env.DB.prepare(`
       INSERT OR IGNORE INTO purchases (id, email, customer_name, course_id, format, transaction_id, amount, download_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     `).bind(
       `purch_${Date.now()}`,
       customerEmail.toLowerCase(),
       customerName,
       courseId,
       format,
       transactionId,
       30000,
       downloadToken
     ).run();
     ```

   - **Passwordless Access Request (`POST /api/portal/request-access`)**:
     - Student enters email address on the portal page.
     - Worker verifies if D1 contains any purchases matching that email.
     - Generates a 6-digit OTP code or signed link token with a 15-minute expiration.
     - Sends access code/link via Resend email.

   - **Fetch Purchased Courses (`POST /api/portal/verify-access`)**:
     - Validates code/token.
     - Queries `SELECT * FROM purchases WHERE email = ? ORDER BY purchased_at DESC`.
     - Returns JSON array of purchased products, active R2 download links, live Calendly booking buttons, and receipt links.

3. **Front-End Dashboard (`components/CourseDashboard.tsx`)**:
   - **Email Verification Step**: Sleek input card prompting for email address with immediate loading state.
   - **OTP Code Verification Step**: 6-digit input box with resend timer.
   - **Student Portal View**: Cards displaying:
     - 📘 Course Name & Description
     - 📥 PDF Download Button (fresh R2 link generated on demand)
     - 🗓️ 1-on-1 Mentorship Booking Button (if mentorship format purchased)
     - 📄 Receipt PDF Link
     - 🕒 Purchase Date & Reference ID

4. **Cloudflare Deployment Setup**:
   - Create D1 database via Wrangler: `npx wrangler d1 create course-portal-db`
   - Bind database in `wrangler.toml`:
     ```toml
     [[d1_databases]]
     binding = "DB"
     database_name = "course-portal-db"
     database_id = "<your-d1-database-id>"
     ```
   - Execute migration schema: `npx wrangler d1 execute course-portal-db --file=./schema.sql`

### Benefits
- 🔑 **No Lost Purchases**: Buyers can retrieve their course materials anytime, even if they accidentally deleted their confirmation email.
- 🔒 **Passwordless & Secure**: Zero friction (no password registration required) with short-lived OTP/magic links.
- 📈 **Lifetime Access & Updates**: Allows students to download updated versions of PDF blueprints whenever new editions are published.
- ⚡ **Zero Infrastructure Cost**: Cloudflare D1 free tier provides 5 million reads/day and 100,000 writes/day.

---

## 5. Generate High-Res Social Preview image for products pages and implement it

