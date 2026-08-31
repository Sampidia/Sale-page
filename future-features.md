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

## 2. Flutterwave Webhook Verification (Secondary Confirmation)

Currently, payment is verified by calling Flutterwave's `/v3/transactions/{id}/verify` API directly from the Worker. A more robust pattern is to also verify the **`verif-hash`** header on incoming Flutterwave webhooks.

- Set up a Cloudflare Worker route as the Flutterwave webhook endpoint
- Store a webhook secret hash in Worker secrets as `FLW_WEBHOOK_HASH`
- On webhook receipt, compare `request.headers.get('verif-hash')` with the stored secret

---

## 3. Purchase Receipt PDF (Generated Receipts)

Auto-generate a HTML receipt (order number, amount, date, course name) and send it as a PDF attachment using a library like `html-to-pdf` via a Cloudflare Worker or an external API.

---

## 4. Course Access Dashboard (Post-Purchase Portal)

A lightweight `/my-courses` page that lets buyers enter their email to retrieve their purchased course download links — backed by Cloudflare D1 (SQLite) storing `{ email, courseId, downloadToken, purchasedAt }`.

## 5. Generate High-Res Social Preview image for products pages and implemenet it 

