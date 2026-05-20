import { NextRequest, NextResponse } from 'next/server'
import { getUser, updateUser, signToken, safeUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, token } = await req.json()
    const user = getUser(email)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (user.verified) return NextResponse.json({ error: 'Email already verified' }, { status: 400 })
    if (user.verifyToken !== token) return NextResponse.json({ error: 'Invalid or expired link' }, { status: 400 })
    const updated = updateUser(email, { verified: true, verifyToken: undefined })
    const authToken = signToken(updated)
    const res = NextResponse.json({ success: true, token: authToken, user: safeUser(updated) })
    res.cookies.set('talentai_token', authToken, { httpOnly: true, maxAge: 60*60*24*7, path: '/', sameSite: 'lax' })
    return res
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
