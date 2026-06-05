import { NextRequest, NextResponse } from 'next/server'

async function callAI(prompt: string, system?: string): Promise<string> {
  const groqKey = process.env.GROQ_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY

  if (groqKey) {
    try {
      const messages: any[] = []
      if (system) messages.push({ role: 'system', content: system })
      messages.push({ role: 'user', content: prompt })
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + groqKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'llama3-8b-8192', messages, max_tokens: 1024 }),
      })
      if (res.ok) {
        const d = await res.json()
        const text = d.choices?.[0]?.message?.content
        if (text) return text
      } else {
        const e = await res.json().catch(() => ({}))
        console.log('Groq failed:', e?.error?.message)
      }
    } catch (e) { console.log('Groq error:', e) }
  }

  if (geminiKey) {
    const full = system ? system + '\n\n' + prompt : prompt
    for (const model of ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.0-pro']) {
      try {
        const res = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + geminiKey,
          { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: full }] }] }) }
        )
        if (res.ok) {
          const d = await res.json()
          const text = d.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) return text
        }
      } catch (e) { console.log('Gemini error:', model) }
    }
  }

  throw new Error('ALL_MODELS_FAILED')
}

function parseJSON(text: string): any[] {
  try {
    const clean = text.replace(/```json|```/g, '').trim()
    const s = clean.indexOf('['), e = clean.lastIndexOf(']')
    if (s === -1 || e === -1) throw new Error('no array')
    return JSON.parse(clean.slice(s, e + 1))
  } catch { return [] }
}

export async function POST(req: NextRequest) {
  try {
    const { type, payload } = await req.json()

    if (type === 'job-matches') {
      const { name, role, experience, location, skills, workType } = payload
      const raw = await callAI(
        'Match exactly 4 jobs for: ' + name + ', ' + role + ', ' + experience + ', ' + location + ', skills: ' + skills + ', prefers: ' + workType + '. Return ONLY a JSON array. Each object must have: title, company, location, salary (like Rs.20-30 LPA), matchScore (70-98), tags (array of 3 skills), reason (one sentence), jobType (Full-time or Contract). No markdown.',
        'You are an AI job matcher. Return ONLY valid JSON arrays. No markdown. No explanation.'
      )
      const data = parseJSON(raw)
      if (!data.length) return NextResponse.json({ error: 'AI returned invalid data. Please try again.' }, { status: 500 })
      return NextResponse.json({ data })
    }

    if (type === 'job-advice') {
      const { candidateName, skills, experience, job } = payload
      const data = await callAI(
        'Give ' + candidateName + ' (' + experience + ', skills: ' + skills + ') 3-4 sentences of career advice about applying to ' + job.title + ' at ' + job.company + ' (' + job.salary + '). Cover: why good fit, key strength, one tip to stand out.',
        'You are a direct and encouraging career advisor.'
      )
      return NextResponse.json({ data })
    }

    if (type === 'candidates') {
      const { title, company, location, salary, skills } = payload
      const raw = await callAI(
        'Generate exactly 5 Indian candidate profiles for this job. Return ONLY a JSON array. Job: ' + title + ' at ' + company + ', ' + location + ', ' + salary + '. Requirements: ' + skills + '. Each object: name (Indian full name), currentRole, experience (like 5 years), location (Indian city), matchScore (75-97), skills (array of 3), summary (one sentence). No markdown.',
        'You are an AI talent sourcer. Return ONLY valid JSON arrays. No markdown.'
      )
      const data = parseJSON(raw)
      if (!data.length) return NextResponse.json({ error: 'AI returned invalid data. Please try again.' }, { status: 500 })
      return NextResponse.json({ data })
    }

    if (type === 'candidate-eval') {
      const { candidate, job } = payload
      const data = await callAI(
        'Evaluate ' + candidate.name + ' (' + candidate.currentRole + ', ' + candidate.experience + ', skills: ' + (candidate.skills || []).join(', ') + ') for ' + job.title + ' requiring ' + job.skills + '. Write 3-4 sentences: fit rating, strongest skill, any gap, recommendation (Strong Yes or Yes or Maybe or Pass).',
        'You are a direct AI recruiter evaluator.'
      )
      return NextResponse.json({ data })
    }

    if (type === 'optimize-jd') {
      const { title, company, location, salary, skills } = payload
      const data = await callAI(
        'Write a compelling job description under 160 words for: ' + title + ' at ' + company + ', ' + location + ', ' + salary + '. Requirements: ' + skills + '. Format: 2-sentence intro, then What you will do with 3 bullet points, then What we are looking for with 3 bullet points.',
        'You are a world-class HR copywriter.'
      )
      return NextResponse.json({ data })
    }

    if (type === 'market-insight') {
      const { industry, question } = payload
      const data = await callAI(
        'You are an Indian labor market expert for 2025. Answer this for the ' + industry + ' sector: ' + question + '. Write 5-6 sentences with specific numbers, company names, and skills. Focus on actionable insights for someone in India.',
        'You are an expert Indian labor market analyst.'
      )
      return NextResponse.json({ data })
    }

    return NextResponse.json({ error: 'Unknown request type: ' + type }, { status: 400 })

  } catch (err: any) {
    console.error('API error:', err.message)
    if (err.message === 'ALL_MODELS_FAILED')
      return NextResponse.json({
        error: 'AI quota exceeded. Get a FREE Groq key at console.groq.com and add GROQ_API_KEY in Vercel Settings → Environment Variables.',
      }, { status: 503 })
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
