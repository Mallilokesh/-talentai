// Email sender using Resend (free: 3000 emails/month)
// Get free API key at https://resend.com

const RESEND_KEY = process.env.RESEND_API_KEY
const FROM = process.env.EMAIL_FROM || 'TalentAI <noreply@talentai.com>'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://talentai-pied.vercel.app'

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_KEY) {
    // Dev mode: log the email instead of sending
    console.log(`[EMAIL - no RESEND_API_KEY]\nTo: ${to}\nSubject: ${subject}\n${html}`)
    return { ok: true, dev: true }
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  })
  return res
}

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const link = `${BASE_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}`
  const html = `
  <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px">
    <h1 style="color:#185FA5;font-size:24px">Welcome to TalentAI, ${name}! 👋</h1>
    <p style="color:#374151;font-size:15px;line-height:1.6">Thanks for signing up. Please verify your email address to activate your account.</p>
    <a href="${link}" style="display:inline-block;background:#185FA5;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:500;margin:16px 0">Verify Email Address</a>
    <p style="color:#6B7280;font-size:13px">This link expires in 24 hours. If you didn't sign up, you can ignore this email.</p>
    <hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0"/>
    <p style="color:#9CA3AF;font-size:12px">TalentAI — AI-Powered Job Portal</p>
  </div>`
  return sendEmail(email, 'Verify your TalentAI email', html)
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const link = `${BASE_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`
  const html = `
  <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px">
    <h1 style="color:#185FA5;font-size:24px">Reset your password</h1>
    <p style="color:#374151;font-size:15px;line-height:1.6">Hi ${name}, we received a request to reset your password.</p>
    <a href="${link}" style="display:inline-block;background:#185FA5;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:500;margin:16px 0">Reset Password</a>
    <p style="color:#6B7280;font-size:13px">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    <hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0"/>
    <p style="color:#9CA3AF;font-size:12px">TalentAI — AI-Powered Job Portal</p>
  </div>`
  return sendEmail(email, 'Reset your TalentAI password', html)
}
