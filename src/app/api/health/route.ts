import { NextResponse } from 'next/server'

export async function GET() {
  const geminiKey = process.env.GEMINI_API_KEY
  const fallbackKey = process.env.ANTHROPIC_API_KEY
  const key = geminiKey || fallbackKey
  const keyName = geminiKey ? 'GEMINI_API_KEY' : fallbackKey ? 'ANTHROPIC_API_KEY' : 'none'

  // Test the key with a real API call
  let apiStatus = 'untested'
  if (key) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: 'Say OK' }] }] }),
        }
      )
      apiStatus = res.ok ? 'working' : `error_${res.status}`
    } catch { apiStatus = 'network_error' }
  }

  return NextResponse.json({
    status: apiStatus === 'working' ? 'ok' : 'degraded',
    keyConfigured: !!key,
    keyName,
    apiStatus,
    message: apiStatus === 'working'
      ? '✅ AI is fully working'
      : !key ? '❌ No API key — add GEMINI_API_KEY in Vercel settings'
      : `⚠️ Key found (${keyName}) but API returned: ${apiStatus}. Key may be invalid or quota exceeded.`,
    fix: apiStatus !== 'working' ? 'Get a new free key at https://aistudio.google.com and update GEMINI_API_KEY in Vercel → Settings → Environment Variables → Redeploy' : null,
  })
}
