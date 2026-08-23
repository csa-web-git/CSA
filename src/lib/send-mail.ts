import 'server-only'
import nodemailer from 'nodemailer'

/**
 * Transporter Nodemailer mutualisé. Lit la config SMTP depuis l'env.
 */
let _transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (_transporter) return _transporter
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  console.log('SMTP config:', {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS: SMTP_PASS?.slice(0, 4) + '...',
  })
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      'SMTP non configuré : ajoute SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS dans .env',
    )
  }
  _transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: Number(SMTP_PORT ?? 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
  return _transporter
}

export async function sendMail(opts: { subject: string; text: string; replyTo?: string }) {
  const { MAIL_FROM, MAIL_TO } = process.env
  if (!MAIL_FROM || !MAIL_TO) {
    throw new Error('Ajoute MAIL_FROM et MAIL_TO dans .env')
  }
  await getTransporter().sendMail({
    from: MAIL_FROM,
    to: MAIL_TO,
    subject: opts.subject,
    text: opts.text,
    replyTo: opts.replyTo,
  })
}
