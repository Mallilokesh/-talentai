import { NextRequest, NextResponse } from 'next/server'
import { getUser, updateUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, token, password } = await req.json()
    if (!email || !token || !password) return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    if (password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    const user = getUser(email)
    if (!user || user.resetToken !== token) return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 })
    if (!user.resetExpiry || Date.now() > user.resetExpiry) return NextResponse.json({ error: 'Link expired. Request a new one.' }, { status: 400 })
    updateUser(email, { password, resetToken: undefined, resetExpiry: undefined })
    return NextResponse.json({ success: true, message: 'Password updated. You can now log in.' })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
