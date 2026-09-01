# COURSE PAYMENT CLOUDFLARE WORKER DEPLOYMENT GUIDE

To deploy your Course Payment Backend to Cloudflare Workers, copy and paste the pure JavaScript code below directly into your **Cloudflare Dashboard → Workers → Edit Code** editor.

Alternatively, you can open the standalone file [course-payment-worker-deploy.js](file:///home/afigo/Documents/My-App/Afigo%20Sam%20Page/sale-page/course-payment-worker-deploy.js) and copy its entire contents.

---

## 🛠️ Required Worker Secrets & Environment Variables

In your Cloudflare Worker Dashboard (**Settings → Variables → Environment Variables**), add:

| Variable Name | Description | Value Example |
| :--- | :--- | :--- |
| `FLW_SECRET_KEY` | Flutterwave Secret Key (v3 API) | `FLWSECK_TEST-...` or `FLWSECK-prod...` |
| `FLW_WEBHOOK_HASH` | Flutterwave Webhook Secret Hash | `afigo_flw_secret_hash_123` |
| `RESEND_API_KEY` | Resend Email API Key | `re_123456789...` |
| `ALLOWED_ORIGIN` | CORS Allowed Domain | `https://afigo.sampidia.com` or `*` |

---

## 🗄️ R2 Bucket & D1 Database Bindings

### 1. R2 Bucket Binding
Under **Settings → Variables → R2 Bucket Bindings**:
- **Variable name**: `COURSE_PDFS`
- **R2 bucket**: `sampidia-course-pdfs`

### 2. Cloudflare D1 Database Binding (For Student Portal & Purchase Records)
Create a D1 database via CLI or Dashboard:
```bash
npx wrangler d1 create course-portal-db
```
Under **Settings → Variables → D1 Database Bindings**:
- **Variable name**: `DB`
- **D1 Database**: `course-portal-db`

Execute the schema migration:
```bash
npx wrangler d1 execute course-portal-db --file=./schema.sql
```

---

## 📜 Full Production Code (Copy & Paste Entire Snippet)

See [course-payment-worker-deploy.js](file:///home/afigo/Documents/My-App/Afigo%20Sam%20Page/sale-page/course-payment-worker-deploy.js) for the complete, deployable Worker script.
