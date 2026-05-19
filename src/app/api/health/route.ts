import { NextResponse } from 'next/server'
export async function GET() {
  const key = process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY
  return NextResponse.json({
    status: key ? 'ok' : 'degraded',
    provider: process.env.GEMINI_API_KEY ? 'gemini' : process.env.ANTHROPIC_API_KEY ? 'gemini-via-anthropic-key' : 'none',
    message: key ? 'AI ready' : 'Add GEMINI_API_KEY in Vercel environment variables',
  })
}
