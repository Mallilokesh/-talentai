const RESEND_KEY = process.env.RESEND_API_KEY
const FROM = process.env.EMAIL_FROM || 'TalentAI <onboarding@resend.dev>'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://talentai-pied.vercel.app'

async function send(to: string, subject: string, html: string) {
  if (!RESEND_KEY) {
    console.log(`[DEV EMAIL - add RESEND_API_KEY to send real emails]\nTo: ${to}\nSubject: ${subject}`)
    return true
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  })
  if (!res.ok) { const e = await res.json(); console.error('Resend error:', e) }
  return res.ok
}

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const link = `${BASE_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}`
  return send(email, 'Verify your TalentAI email', `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px">
    <h2 style="color:#185FA5">TalentAI</h2>
    <h1 style="font-size:22px;color:#111">Welcome, ${name}! 👋</h1>
    <p style="color:#4B5563;line-height:1.6">Click below to verify your email and activate your account.</p>
    <a href="${link}" style="display:inline-block;background:#185FA5;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">Verify Email →</a>
    <p style="color:#9CA3AF;font-size:13px">Expires in 24 hours.</p></div>`)
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const link = `${BASE_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`
  return send(email, 'Reset your TalentAI password', `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px">
    <h2 style="color:#185FA5">TalentAI</h2>
    <h1 style="font-size:22px;color:#111">Reset your password</h1>
    <p style="color:#4B5563;line-height:1.6">Hi ${name}, click below to set a new password.</p>
    <a href="${link}" style="display:inline-block;background:#185FA5;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">Reset Password →</a>
    <p style="color:#9CA3AF;font-size:13px">Expires in 1 hour.</p></div>`)
}

export async function sendWelcomeEmail(email: string, name: string, role: string) {
  const dash = role === 'employer' ? '/dashboard/employer' : '/dashboard/seeker'
  return send(email, '🎉 Welcome to TalentAI!', `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px">
    <h2 style="color:#185FA5">TalentAI</h2>
    <h1 style="font-size:22px;color:#111">You're in, ${name}! 🚀</h1>
    <p style="color:#4B5563;line-height:1.6">Your account is active. Start exploring AI-matched ${role === 'employer' ? 'candidates' : 'jobs'} now.</p>
    <a href="${BASE_URL}${dash}" style="display:inline-block;background:#185FA5;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">Go to Dashboard →</a></div>`)
}
