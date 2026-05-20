import { NextRequest, NextResponse } from 'next/server'
import { getUser, signToken, safeUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password)
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })

    const user = getUser(email)
    if (!user || user.password !== password)
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    if (!user.verified)
      return NextResponse.json({ error: 'Please verify your email before logging in. Check your inbox.' }, { status: 403 })

    const token = signToken(user)
    const res = NextResponse.json({ success: true, token, user: safeUser(user) })
    res.cookies.set('talentai_token', token, { httpOnly: true, maxAge: 60*60*24*7, path: '/', sameSite: 'lax' })
    return res
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
