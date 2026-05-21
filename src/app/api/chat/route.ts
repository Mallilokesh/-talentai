import { NextRequest, NextResponse } from 'next/server'

async function callAI(prompt: string, system?: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('NO_API_KEY')

  const full = system ? `${system}\n\n${prompt}` : prompt

  // Try gemini-2.0-flash first, fallback to gemini-1.5-flash
  for (const model of ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro']) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        { method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ contents:[{ parts:[{ text: full }] }] }) }
      )
      if (res.ok) {
        const d = await res.json()
        const text = d.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) return text
      }
    } catch {}
  }
  throw new Error('All Gemini models failed')
}

function parseJSON(text: string): any[] {
  try {
    const clean = text.replace(/```json|```/g,'').trim()
    const s = clean.indexOf('['), e = clean.lastIndexOf(']')
    if (s === -1 || e === -1) throw new Error('no array')
    return JSON.parse(clean.slice(s, e+1))
  } catch { return [] }
}

export async function POST(req: NextRequest) {
  try {
    const { type, payload } = await req.json()

    if (type === 'job-matches') {
      const { name, role, experience, location, skills, workType } = payload
      const raw = await callAI(
        `Match exactly 4 jobs for: ${name}, ${role}, ${experience}, ${location}, skills: ${skills}, prefers: ${workType}. Return ONLY a JSON array. Each: {title, company, location, salary (₹XX-XX LPA), matchScore (70-98), tags:[3 skills], reason: one sentence, jobType}`,
        'You are an AI job matcher. Return ONLY valid JSON arrays, no markdown.'
      )
      const data = parseJSON(raw)
      if (!data.length) return NextResponse.json({ error: 'Try again' }, { status: 500 })
      return NextResponse.json({ data })
    }

    if (type === 'job-advice') {
      const { candidateName, skills, experience, job } = payload
      const data = await callAI(
        `Career advisor: Give ${candidateName} (${experience}, skills: ${skills}) 3-4 sentences of advice about applying to "${job.title}" at ${job.company} (${job.salary}). Cover fit, key strength, one tip to stand out.`,
        'You are a direct, encouraging career advisor.'
      )
      return NextResponse.json({ data })
    }

    if (type === 'candidates') {
      const { title, company, location, salary, skills } = payload
      const raw = await callAI(
        `Generate 5 Indian candidate profiles for: ${title} at ${company}, ${location}, ${salary}. Requirements: ${skills}. Return ONLY a JSON array. Each: {name (Indian), currentRole, experience, location (Indian city), matchScore (75-97), skills:[3], summary: one sentence}`,
        'You are an AI talent sourcer. Return ONLY valid JSON arrays, no markdown.'
      )
      const data = parseJSON(raw)
      if (!data.length) return NextResponse.json({ error: 'Try again' }, { status: 500 })
      return NextResponse.json({ data })
    }

    if (type === 'candidate-eval') {
      const { candidate, job } = payload
      const data = await callAI(
        `Evaluate "${candidate.name}" (${candidate.currentRole}, ${candidate.experience}, skills: ${(candidate.skills||[]).join(', ')}) for "${job.title}" requiring "${job.skills}". 3-4 sentences: fit rating, strongest skill, any gap, recommendation (Strong Yes/Yes/Maybe/Pass).`,
        'You are a direct AI recruiter evaluator.'
      )
      return NextResponse.json({ data })
    }

    if (type === 'optimize-jd') {
      const { title, company, location, salary, skills } = payload
      const data = await callAI(
        `Write a compelling job description (max 160 words) for: ${title} at ${company}, ${location}, ${salary}. Requirements: ${skills}. Format: 2-sentence intro, "What you'll do:" (3 bullets), "What we're looking for:" (3 bullets).`,
        'You are a world-class HR copywriter.'
      )
      return NextResponse.json({ data })
    }

    if (type === 'market-insight') {
      const { industry, question } = payload
      const data = await callAI(
        `Indian labor market expert 2025. Answer for "${industry}": "${question}". 5-6 sentences with specific numbers, company names, skills. Focus on actionable insights for India.`,
        'You are an expert Indian labor market analyst.'
      )
      return NextResponse.json({ data })
    }

    return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 })
  } catch (err: any) {
    if (err.message === 'NO_API_KEY')
      return NextResponse.json({ error: 'Add GEMINI_API_KEY to Vercel environment variables.' }, { status: 503 })
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
