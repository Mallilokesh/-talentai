import { NextRequest, NextResponse } from 'next/server'

async function callAI(prompt: string, system?: string): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY
  if (!geminiKey) throw new Error('NO_API_KEY')

  const fullPrompt = system ? `${system}\n\n${prompt}` : prompt
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] }),
    }
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.error?.message || 'Gemini API error')
  }
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

function cleanJSON(text: string): any[] {
  try {
    const clean = text.replace(/```json|```/g, '').trim()
    const start = clean.indexOf('[')
    const end = clean.lastIndexOf(']')
    if (start === -1 || end === -1) throw new Error('No array')
    return JSON.parse(clean.slice(start, end + 1))
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  try {
    const { type, payload } = await req.json()

    switch (type) {
      case 'job-matches': {
        const { name, role, experience, location, skills, workType } = payload
        const raw = await callAI(
          `Match exactly 4 jobs for this candidate. Return ONLY a JSON array, no markdown.
Candidate: ${name}, ${role}, ${experience}, ${location}, skills: ${skills}, prefers: ${workType}
Each object: {"title":"","company":"","location":"","salary":"₹XX–XX LPA","matchScore":85,"tags":["s1","s2","s3"],"reason":"one sentence","jobType":"Full-time"}`,
          'You are an AI job matcher. Return ONLY valid JSON arrays.'
        )
        const data = cleanJSON(raw)
        if (!data.length) return NextResponse.json({ error: 'AI returned no matches. Please try again.' }, { status: 500 })
        return NextResponse.json({ data })
      }

      case 'job-advice': {
        const { candidateName, skills, experience, job } = payload
        const data = await callAI(
          `Career advisor: Give "${candidateName}" (${experience}, skills: ${skills}) 3-4 sentences of advice about applying to "${job.title}" at ${job.company} (${job.salary}). Cover: fit, key strength, one tip to stand out.`,
          'You are a direct, encouraging career advisor.'
        )
        return NextResponse.json({ data })
      }

      case 'candidates': {
        const { title, company, location, salary, skills } = payload
        const raw = await callAI(
          `Generate exactly 5 Indian candidate profiles for this job. Return ONLY a JSON array, no markdown.
Job: ${title} at ${company}, ${location}, ${salary}. Requirements: ${skills}
Each: {"name":"Indian name","currentRole":"","experience":"X years","location":"Indian city","matchScore":88,"skills":["s1","s2","s3"],"summary":"one sentence"}`,
          'You are an AI talent sourcer. Return ONLY valid JSON arrays.'
        )
        const data = cleanJSON(raw)
        if (!data.length) return NextResponse.json({ error: 'AI returned no candidates. Please try again.' }, { status: 500 })
        return NextResponse.json({ data })
      }

      case 'candidate-eval': {
        const { candidate, job } = payload
        const data = await callAI(
          `Evaluate "${candidate.name}" (${candidate.currentRole}, ${candidate.experience}, skills: ${(candidate.skills||[]).join(', ')}) for "${job.title}" requiring "${job.skills}". 3-4 sentences: fit rating, strongest skill, any gap, recommendation (Strong Yes / Yes / Maybe / Pass).`,
          'You are a direct AI recruiter evaluator.'
        )
        return NextResponse.json({ data })
      }

      case 'optimize-jd': {
        const { title, company, location, salary, skills } = payload
        const data = await callAI(
          `Write a compelling job description (max 160 words) for: ${title} at ${company}, ${location}, ${salary}. Requirements: ${skills}.
Format: 2-sentence intro, then "What you'll do:" with 3 bullets, then "What we're looking for:" with 3 bullets.`,
          'You are a world-class HR copywriter.'
        )
        return NextResponse.json({ data })
      }

      case 'market-insight': {
        const { industry, question } = payload
        const data = await callAI(
          `Indian labor market expert, 2025. Answer for "${industry}": "${question}". 5-6 sentences with specific numbers, company names, skills. Focus on actionable insights for someone in India.`,
          'You are an expert Indian labor market analyst.'
        )
        return NextResponse.json({ data })
      }

      default:
        return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 })
    }
  } catch (err: any) {
    if (err.message === 'NO_API_KEY') {
      return NextResponse.json({
        error: 'API key not configured.',
        fix: 'Go to Vercel Dashboard → Project → Settings → Environment Variables → add GEMINI_API_KEY',
      }, { status: 503 })
    }
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
