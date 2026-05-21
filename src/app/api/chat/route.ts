import { NextRequest, NextResponse } from 'next/server'

async function callAI(prompt: string, system?: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('NO_API_KEY')

  const full = system ? `${system}\n\n${prompt}` : prompt

  const models = [
    'gemini-2.5-flash-preview-05-20',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.0-pro',
  ]

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: full }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
          }),
        }
      )
      if (res.ok) {
        const d = await res.json()
        const text = d.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) return text
      } else {
        const err = await res.json().catch(() => ({}))
        console.log(`Model ${model} failed:`, err?.error?.message || res.status)
      }
    } catch (e) {
      console.log(`Model ${model} threw:`, e)
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
        `Match exactly 4 jobs for this candidate. Return ONLY a JSON array, no markdown, no explanation.
Candidate: ${name}, ${role}, ${experience}, ${location}, skills: ${skills}, prefers: ${workType}
Each object must have: title, company, location, salary (like "₹20-30 LPA"), matchScore (number 70-98), tags (array of 3 skills), reason (one sentence), jobType (Full-time or Contract)`,
        'You are an AI job matcher. Return ONLY valid JSON arrays. No markdown. No explanation.'
      )
      const data = parseJSON(raw)
      if (!data.length) return NextResponse.json({ error: 'AI returned invalid data. Please try again.' }, { status: 500 })
      return NextResponse.json({ data })
    }

    if (type === 'job-advice') {
      const { candidateName, skills, experience, job } = payload
      const data = await callAI(
        `Give ${candidateName} (${experience}, skills: ${skills}) 3-4 sentences of career advice about applying to "${job.title}" at ${job.company} (${job.salary}). Cover: why good fit, key strength, one tip to stand out.`,
        'You are a direct and encouraging career advisor.'
      )
      return NextResponse.json({ data })
    }

    if (type === 'candidates') {
      const { title, company, location, salary, skills } = payload
      const raw = await callAI(
        `Generate exactly 5 Indian candidate profiles for this job. Return ONLY a JSON array, no markdown.
Job: ${title} at ${company}, ${location}, ${salary}. Requirements: ${skills}
Each object: name (Indian full name), currentRole, experience (like "5 years"), location (Indian city), matchScore (75-97), skills (array of 3), summary (one sentence)`,
        'You are an AI talent sourcer. Return ONLY valid JSON arrays. No markdown.'
      )
      const data = parseJSON(raw)
      if (!data.length) return NextResponse.json({ error: 'AI returned invalid data. Please try again.' }, { status: 500 })
      return NextResponse.json({ data })
    }

    if (type === 'candidate-eval') {
      const { candidate, job } = payload
      const data = await callAI(
        `Evaluate "${candidate.name}" (${candidate.currentRole}, ${candidate.experience}, skills: ${(candidate.skills || []).join(', ')}) for "${job.title}" requiring "${job.skills}". Write 3-4 sentences: fit rating, strongest skill, any gap, recommendation (Strong Yes / Yes / Maybe / Pass).`,
        'You are a direct AI recruiter evaluator.'
      )
      return NextResponse.json({ data })
    }

    if (type === 'optimize-jd') {
      const { title, company, location, salary, skills } = payload
      const data = await callAI(
        `Write a compelling job description (max 160 words) for: ${title} at ${company}, ${location}, ${salary}. Requirements: ${skills}. Format: 2-sentence intro, "What you'll do:" with 3 bullet points, "What we're looking for:" with 3 bullet points.`,
        'You are a world-class HR copywriter.'
      )
      return NextResponse.json({ data })
    }

    if (type === 'market-insight') {
      const { industry, question } = payload
      const data = await callAI(
        `You are an Indian labor market expert. Answer for the "${industry}" sector in India: "${question}". Write 5-6 sentences with specific numbers, company names, and skills. Focus on actionable insights for someone in India in 2025.`,
        'You are an expert Indian labor market analyst with deep 2025 knowledge.'
      )
      return NextResponse.json({ data })
    }

    return NextResponse.json({ error: `Unknown request type: ${type}` }, { status: 400 })

  } catch (err: any) {
    console.error('API error:', err.message)
    if (err.message === 'NO_API_KEY')
      return NextResponse.json({
        error: 'No API key configured. Add GEMINI_API_KEY in Vercel Environment Variables.',
      }, { status: 503 })
    if (err.message === 'ALL_MODELS_FAILED')
      return NextResponse.json({
        error: 'Gemini API quota exceeded. Please get a new free API key at aistudio.google.com and update it in Vercel settings.',
      }, { status: 503 })
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
