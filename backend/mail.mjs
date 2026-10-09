// Destination is fixed server-side; visitors cannot choose recipients.
const recipient = 'info@odborypacketa.eu';
export async function enqueueMail(row, env) {
  await env.DB.prepare("INSERT INTO mail_outbox (id, status, next_attempt_at, retry_until) VALUES (?, 'pending', ?, ?) ON CONFLICT(id) DO NOTHING").bind(row.id, row.created_at, new Date(Date.parse(row.created_at) + 23 * 3600000).toISOString()).run();
}
export async function forwardMail(row, payload, env) {
  if (!env.RESEND_API_KEY || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(env.CONTACT_FROM_EMAIL || '')) return 'pending';
  const now = new Date().toISOString();
  const lease = new Date(Date.now() + 120000).toISOString();
  const claim = await env.DB.prepare("UPDATE mail_outbox SET status = 'sending', locked_until = ?, attempts = attempts + 1 WHERE id = ? AND status IN ('pending', 'sending') AND next_attempt_at <= ? AND (locked_until IS NULL OR locked_until <= ?) AND retry_until > ? RETURNING *").bind(lease, row.id, now, now, now).first();
  if (!claim) return (await env.DB.prepare('SELECT status FROM mail_outbox WHERE id = ?').bind(row.id).first())?.status || 'pending';
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(12000),
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `odboracik/${row.id}` },
      body: JSON.stringify({ from: env.CONTACT_FROM_EMAIL, to: [recipient], reply_to: payload.email,
        subject: `[Odboráčik] Nový dotaz${payload.urgent ? ' — časovo citlivé' : ''}`,
        text: `ID podania: ${row.id}\nPrijaté: ${row.created_at}\nMeno/prezývka: ${payload.name || 'Neuvedené'}\nE-mail pre odpoveď: ${payload.email}\nTéma: ${payload.topic}\nČasovo citlivé: ${payload.urgent ? 'áno' : 'nie'}\n\n${payload.message}\n\nOdpoveďou na tento e-mail kontaktujete odosielateľa. Podklady a ďalšie citlivé dokumenty riešte dohodnutým bezpečným spôsobom.` })
    });
    const result = await response.json();
    if (!response.ok || typeof result.id !== 'string' || !result.id) throw new Error('Unconfirmed');
    await env.DB.prepare("UPDATE mail_outbox SET status = 'sent', sent_at = ?, provider_id = ?, locked_until = NULL WHERE id = ?").bind(new Date().toISOString(), result.id, row.id).run();
    return 'sent'; // Provider accepted the email; inbox delivery is not confirmed.
  } catch {
    const next = new Date(Date.now() + Math.min(3600000, 60000 * 2 ** Math.min(claim.attempts, 6))).toISOString();
    await env.DB.prepare("UPDATE mail_outbox SET status = 'pending', next_attempt_at = ?, locked_until = NULL WHERE id = ? AND status = 'sending'").bind(next, row.id).run();
    return 'pending';
  }
}
export async function retryMail(env, decrypt) {
  const now = new Date().toISOString();
  // Stop before the provider's 24h idempotency window expires. Manual review
  // is required after this point; blindly resending could duplicate a message.
  await env.DB.prepare("UPDATE mail_outbox SET status = 'failed', locked_until = NULL WHERE status IN ('pending', 'sending') AND retry_until <= ?").bind(now).run();
  const { results } = await env.DB.prepare("SELECT q.* FROM queries q JOIN mail_outbox m ON q.id = m.id WHERE m.status IN ('pending', 'sending') AND m.next_attempt_at <= ? AND (m.locked_until IS NULL OR m.locked_until <= ?) AND q.expires_at > ? AND m.retry_until > ? ORDER BY m.next_attempt_at LIMIT 10").bind(now, now, now, now).all();
  for (const row of results) await forwardMail(row, await decrypt(row, env), env);
}
