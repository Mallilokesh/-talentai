$code = @"
import { NextRequest, NextResponse } from 'next/server'

async function callAI(prompt: string, system?: string): Promise<string> {
  const groqKey = process.env.GROQ_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY

  if (groqKey) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer `${groqKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            ...(system ? [{ role: 'system', content: system }] : []),
            { role: 'user', content: prompt }
          ],
          max_tokens: 1024,
        }),
      })
      if (res.ok) {
        const d = await res.json()
        const text = d.choices?.[0]?.message?.content
        if (text) return text
      }
    } catch(e) { console.log('Groq error:', e) }
  }

  if (geminiKey) {
    const full = system ? system + '\n\n' + prompt : prompt
    for (const model of ['gemini-2.0-flash','gemini-1.5-flash','gemini-1.0-pro']) {
      try {
        const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + geminiKey,
          { method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ contents:[{ parts:[{ text: full }] }] }) })
        if (res.ok) {
          const d = await res.json()
          const text = d.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) return text
        }
      } catch(e) {}
    }
  }

  throw new Error('ALL_MODELS_FAILED')
}
"@