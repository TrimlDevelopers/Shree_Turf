import { Resend } from 'resend'

/**
 * Modular email service (Resend HTTPS API — Render-friendly, no SMTP).
 * Public API used by booking routes must stay stable:
 *   sendAdminNewBookingEmail(booking)
 *   sendCustomerConfirmedEmail(booking)
 */

function resendConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim())
}

let resendClient = null

function getResend() {
  if (!resendConfigured()) return null
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY.trim())
  }
  return resendClient
}

function fromAddress() {
  return (
    process.env.RESEND_FROM ||
    process.env.EMAIL_FROM ||
    'Shree Turf 360 <info@triboundtech.com>'
  )
}

function adminNotifyEmail() {
  return process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_EMAIL
}

function formatSlots(slots = []) {
  return slots.join(', ')
}

function bookingSummaryHtml(booking) {
  return `
    <ul style="padding-left:18px;line-height:1.7">
      <li><strong>Name:</strong> ${escapeHtml(booking.customerName)}</li>
      <li><strong>Phone:</strong> ${escapeHtml(booking.phone)}</li>
      <li><strong>Email:</strong> ${escapeHtml(booking.customerEmail || '—')}</li>
      <li><strong>Date:</strong> ${escapeHtml(booking.date)}</li>
      <li><strong>Slots:</strong> ${escapeHtml(formatSlots(booking.slots))}</li>
      <li><strong>Game:</strong> ${escapeHtml(booking.game)}</li>
      <li><strong>Status:</strong> ${escapeHtml(booking.status)}</li>
    </ul>
  `
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function normalizeRecipients(value) {
  if (!value) return undefined
  if (Array.isArray(value)) {
    const list = value.map((v) => String(v).trim()).filter(Boolean)
    return list.length ? list : undefined
  }
  const single = String(value).trim()
  return single || undefined
}

/**
 * Low-level send via Resend HTTPS API.
 * Supports: to (string|string[]), cc, bcc, replyTo, attachments, html, text.
 */
export async function sendMail({
  to,
  subject,
  html,
  text,
  cc,
  bcc,
  replyTo,
  attachments,
}) {
  const client = getResend()
  if (!client) {
    console.warn(
      `[email] Skipped (RESEND_API_KEY not configured): ${subject} → ${to}`,
    )
    return { skipped: true }
  }

  const payload = {
    from: fromAddress(),
    to: normalizeRecipients(to),
    subject,
    html,
    text,
  }

  const ccNorm = normalizeRecipients(cc)
  const bccNorm = normalizeRecipients(bcc)
  const replyNorm = normalizeRecipients(replyTo)
  if (ccNorm) payload.cc = ccNorm
  if (bccNorm) payload.bcc = bccNorm
  if (replyNorm) payload.replyTo = replyNorm
  if (Array.isArray(attachments) && attachments.length) {
    payload.attachments = attachments
  }

  if (!payload.to) {
    console.warn(`[email] Skipped (no recipients): ${subject}`)
    return { skipped: true }
  }

  try {
    const { data, error } = await client.emails.send(payload)

    if (error) {
      console.error('[email] Resend error:', error.message || error)
      throw new Error(error.message || 'Resend email failed')
    }

    console.log(
      `[email] Sent via Resend: ${subject} → ${Array.isArray(payload.to) ? payload.to.join(', ') : payload.to} (${data?.id || 'ok'})`,
    )
    return { id: data?.id, data }
  } catch (err) {
    console.error('[email] Send failed:', err.message || err)
    throw err
  }
}

/** Notify admin when a customer submits a pending booking. */
export async function sendAdminNewBookingEmail(booking) {
  const to = adminNotifyEmail()
  if (!to) {
    console.warn('[email] No ADMIN_EMAIL / ADMIN_NOTIFY_EMAIL set')
    return { skipped: true }
  }

  const subject = `New booking request — ${booking.customerName} · ${booking.date}`
  const text = [
    'New slot booking request (pending confirmation).',
    '',
    `Name: ${booking.customerName}`,
    `Phone: ${booking.phone}`,
    `Email: ${booking.customerEmail || '—'}`,
    `Date: ${booking.date}`,
    `Slots: ${formatSlots(booking.slots)}`,
    `Game: ${booking.game}`,
    '',
    'Open the admin panel to confirm or cancel.',
  ].join('\n')

  const html = `
    <div style="font-family:Arial,sans-serif;color:#111;line-height:1.5">
      <h2 style="margin:0 0 12px">New booking request</h2>
      <p>A customer requested a slot. Status is <strong>pending</strong>.</p>
      ${bookingSummaryHtml(booking)}
      <p style="margin-top:16px">Open the admin panel to confirm or cancel.</p>
    </div>
  `

  return sendMail({
    to,
    subject,
    html,
    text,
    replyTo: booking.customerEmail || undefined,
  })
}

/** Notify customer after admin confirms their booking. */
export async function sendCustomerConfirmedEmail(booking) {
  const to = booking.customerEmail
  if (!to) {
    console.warn(
      `[email] No customer email on booking ${booking._id} — skip confirm mail`,
    )
    return { skipped: true }
  }

  const subject = `Booking confirmed — Shree Turf 360° · ${booking.date}`
  const text = [
    `Hi ${booking.customerName},`,
    '',
    'Your turf booking is confirmed.',
    '',
    `Date: ${booking.date}`,
    `Slots: ${formatSlots(booking.slots)}`,
    `Game: ${booking.game}`,
    `Phone: ${booking.phone}`,
    '',
    'See you on the pitch!',
    '— Shree Turf 360°',
  ].join('\n')

  const html = `
    <div style="font-family:Arial,sans-serif;color:#111;line-height:1.5">
      <h2 style="margin:0 0 12px;color:#2b6d15">Booking confirmed</h2>
      <p>Hi ${escapeHtml(booking.customerName)},</p>
      <p>Your turf booking at <strong>Shree Turf 360°</strong> is confirmed.</p>
      ${bookingSummaryHtml({ ...booking.toObject?.() ?? booking, status: 'confirmed' })}
      <p style="margin-top:16px">See you on the pitch!</p>
      <p style="color:#555">— Shree Turf 360°</p>
    </div>
  `

  return sendMail({
    to,
    subject,
    html,
    text,
    replyTo: adminNotifyEmail() || undefined,
  })
}
