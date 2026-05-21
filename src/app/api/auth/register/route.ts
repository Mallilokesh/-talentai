import { NextRequest, NextResponse } from 'next/server'
import { createUser, makeToken, safeUser } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, company } = await req.json()
    if (!name || !email || !password || !role)
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    if (!['seeker','employer'].includes(role))
      return NextResponse.json({ error: 'Role must be seeker or employer' }, { status: 400 })
    if (password.length < 6)
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

    const verifyToken = makeToken()
    const user = createUser({ name, email, password, role, company, verified: false, verifyToken })

    // Try to send email — if it fails, still create account
    const emailSent = await sendVerificationEmail(email, name, verifyToken).catch(() => false)

    const hasResend = !!process.env.RESEND_API_KEY
    const message = hasResend && emailSent
      ? `Account created! Check ${email} for a verification link.`
      : `Account created! Since email is in dev mode, use the demo verify link below.`

    return NextResponse.json({
      success: true,
      message,
      emailSent: hasResend && emailSent,
      devMode: !hasResend,
      // In dev mode, return the verify URL so user can click it directly
      devVerifyUrl: !hasResend ? `/verify-email?token=${verifyToken}&email=${encodeURIComponent(email)}` : null,
      user: safeUser(user),
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
