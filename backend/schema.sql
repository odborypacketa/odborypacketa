CREATE TABLE IF NOT EXISTS queries (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  iv TEXT NOT NULL,
  ciphertext TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS queries_expiry ON queries(expires_at);
