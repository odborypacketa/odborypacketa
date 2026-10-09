CREATE TABLE IF NOT EXISTS queries (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  iv TEXT NOT NULL,
  ciphertext TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS queries_expiry ON queries(expires_at);
CREATE TABLE IF NOT EXISTS mail_outbox (
  id TEXT PRIMARY KEY REFERENCES queries(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TEXT NOT NULL,
  retry_until TEXT NOT NULL,
  locked_until TEXT,
  sent_at TEXT,
  provider_id TEXT
);
CREATE INDEX IF NOT EXISTS mail_retry ON mail_outbox(status, next_attempt_at);
