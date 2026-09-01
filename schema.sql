-- ============================================================
-- CLOUDFLARE D1 (SQLITE) SCHEMA FOR COURSE PORTAL & RECEIPTS
-- Execute this using Wrangler CLI:
-- npx wrangler d1 execute course-portal-db --file=./schema.sql
-- ============================================================

-- Table 1: Purchases Table
CREATE TABLE IF NOT EXISTS purchases (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  course_id TEXT NOT NULL,
  format TEXT NOT NULL DEFAULT 'pdf', -- 'pdf' | 'one-on-one'
  transaction_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL DEFAULT 30000, -- Amount in NGN or USD
  download_token TEXT NOT NULL,
  item_type TEXT DEFAULT 'course', -- 'course' | 'product'
  session_booked INTEGER DEFAULT 0, -- 0 = not booked, 1 = booked on Calendly
  session_booked_at DATETIME,
  purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookup by student email
CREATE INDEX IF NOT EXISTS idx_purchases_email ON purchases(email);
CREATE INDEX IF NOT EXISTS idx_purchases_tx ON purchases(transaction_id);

-- Table 2: Access Tokens (Passwordless OTP Verification)
CREATE TABLE IF NOT EXISTS access_tokens (
  token TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  used INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for quick token lookup and cleanup
CREATE INDEX IF NOT EXISTS idx_tokens_email ON access_tokens(email);
