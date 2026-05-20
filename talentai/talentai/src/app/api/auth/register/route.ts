import { NextRequest, NextResponse } from 'next/server'
import { createUser, makeToken, signToken, safeUser } from '@/lib/auth'
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
    await sendVerificationEmail(email, name, verifyToken)

    return NextResponse.json({
      success: true,
      message: 'Account created! Please check your email to verify your account.',
      user: safeUser(user),
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
