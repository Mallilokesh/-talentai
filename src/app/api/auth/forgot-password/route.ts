import { NextRequest, NextResponse } from 'next/server'
import { getUser, updateUser, makeToken } from '@/lib/auth'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    const user = getUser(email)
    if (user) {
      const resetToken = makeToken()
      updateUser(email, { resetToken, resetExpiry: Date.now() + 3600000 })
      await sendPasswordResetEmail(email, user.name, resetToken)
    }
    return NextResponse.json({ success: true, message: 'If that email exists, a reset link has been sent.' })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
