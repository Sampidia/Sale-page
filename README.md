# 🚀 Afigo-Sam | Premium WordPress Solutions & Native Mobile Apps

Welcome to the **Afigo-Sam** digital product portal! This project is a premium, feature-rich React/TypeScript showcase application that brings together cutting-edge WordPress plugins, premium themes, and native mobile applications under a single, cohesive, high-performance web experience.

---

## 🌟 The Ecosystem & Product Catalog

### 🔌 Premium WordPress Plugins
1. **WordPress AI-Powered Automatic Content Generator** (Best Seller):
   * **Multi-AI Provider Engine**: Direct API integrations with OpenAI (GPT-4o), Google (Gemini Pro), Anthropic (Claude 3.5), and DeepSeek.
   * **Bulk Builder**: Generate, queue, and schedule hundreds of search-engine optimized blog posts in minutes.
   * **SEO Optimizer**: Real-time readability checks, keyword density analysis, and meta tag generators.
   * **Auto-Media Engine**: Automatic featured image generation leveraging DALL-E 3.
2. **My Licenses Manager** (Popular):
   * **Central License Server**: Remotely activate, track, and disable licenses for digital assets across client domains.
   * **Automated Sales Sync**: Native integrations with the Envato Marketplace API, WP Express Checkout, and WP eStore.
   * **Analytics**: Usage heatmaps and license activation logs.
3. **Booking Theme Pro**:
   * A high-performance responsive booking engine built specifically for rental operations, service providers, and agencies.

---

### 📱 Native Mobile Applications
Our directory showcases native Android/iOS solutions designed for modern users:
* **🎲 Naija Ayo Worldwide**:
  * The digital adaptation of the traditional Nigerian strategy board game (Ayo/Mancala). Features pass-and-play multiplayer, local audio scoring, and a smart, adaptive single-player AI.
* **🎙️ Afro Short**:
  * A premium multimedia streaming application hosting original podcast series, inspiring short-form documentaries, and local indie music catalogs.
* **🛡️ Fake Products Detector**:
  * A health and retail safety assistant. Instantly verifies batch numbers and product details against regulatory recall databases (including NAFDAC recall alerts).

---

## 🔒 GDPR Account Deletion Portal (Secure Serverless Architecture)
To support privacy laws and absolute user data security, the portal integrates a **production-grade serverless form** under `/delete-account`. 

### Technical Architecture
```
[React/Vite Frontend]
        │
        ▼ (POST JSON / CORS Safe)
[Cloudflare Worker Backend] 
        │ 
        ▼ (Authorized API Key / Server-Side)
[Resend Email Delivery API]
        │
        ▼ (Secured Notification)
[Administrator / Verified Recipient Inbox]
```

* **Client Safety**: The Resend API key is never exposed to the client's browser, preventing key harvesting and security breaches.
* **CORS Preflight**: Full, robust CORS preflight protection (`OPTIONS` handles dynamic Origin bindings securely).
* **Worker Codebase**: Located in the [worker/](file:///home/afigo/Documents/My%20App/Afigo%20Sam%20Page/sale-page/worker) directory.

---

## 🛠️ Getting Started & Run Locally

### Prerequisites
* **Node.js** (v18+ recommended)
* **NPM** or **Yarn**

### 1. Installation
Clone the repository and install the project dependencies:
```bash
npm install
```

### 2. Configure Environment
Create a [.env.local](file:///home/afigo/Documents/My%20App/Afigo%20Sam%20Page/sale-page/.env.local) file in the root directory:
```env
# URL of your Cloudflare Worker endpoint
VITE_WORKER_URL=http://localhost:8787
```

### 3. Start Development Server
Launch the local Vite server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## ☁️ Setting Up The Cloudflare Worker (Production Setup)

You can deploy the serverless email relay in minutes:

### 1. Local Worker Setup (Dev Mode)
To run and test the Cloudflare Worker locally:
1. Navigate to the `worker/` directory:
   ```bash
   cd worker
   ```
2. Install wrangler dependencies:
   ```bash
   npm install
   ```
3. Start wrangler server:
   ```bash
   npx wrangler dev
   ```
   *(The worker will launch on `http://localhost:8787` matching your local `.env.local` configuration)*

### 2. Deploy Directly from Cloudflare Dashboard
To deploy without any command-line login:
1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com) -> **Workers & Pages** -> **Create application** -> **Create Worker**.
2. Name your worker (e.g. `resend-email-worker`) and deploy.
3. Click **Edit Code** and copy/paste the pure JavaScript code inside [worker/src/index.ts](file:///home/afigo/Documents/My%20App/Afigo%20Sam%20Page/sale-page/worker/src/index.ts) directly into the web editor. Save and deploy.
4. Go to **Settings -> Variables** in the worker control panel, click **Add Secret**, define `RESEND_API_KEY`, and paste your Resend key. Save.
5. Copy the generated `.workers.dev` URL and paste it in your website's [.env.local](file:///home/afigo/Documents/My%20App/Afigo%20Sam%20Page/sale-page/.env.local)!

---

## 📦 Building for Production
To build a highly optimized static bundle of the website:
```bash
npm run build
```
The output bundle will be generated under the `dist/` directory, ready to be hosted on Netlify, Vercel, GitHub Pages, or Cloudflare Pages.
