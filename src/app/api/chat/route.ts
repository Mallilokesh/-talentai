import { NextRequest, NextResponse } from 'next/server'

async function ai(prompt: string): Promise<string> {

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    }
  )

  const data = await response.json()

  return data.candidates[0].content.parts[0].text
}

export async function POST(req: NextRequest) {

  try {

    const { type, payload } = await req.json()

    let result: string

    if (type === 'job-matches') {

      const { name, role, experience, location, skills, workType } = payload

      result = await ai(
        `Return EXACTLY 4 job matches as a JSON array only (no markdown). Candidate: ${name}, ${role}, ${experience}, ${location}, skills: ${skills}, prefers: ${workType}. Each object: title, company, location, salary (LPA), matchScore (70-98), tags (3 skills), reason (1 sentence), jobType.`
      )

      const clean = result.replace(/```json|```/g, '').trim()

      return NextResponse.json({
        data: JSON.parse(clean)
      })
    }

    if (type === 'candidates') {

      const { title, company, location, salary, skills } = payload

      result = await ai(
        `Generate EXACTLY 5 realistic Indian candidate profiles as a JSON array only (no markdown) for: ${title} at ${company}, ${location}, ${salary}. Requirements: ${skills}. Each: name (Indian), currentRole, experience, location (Indian city), matchScore (75-97), skills (3), summary (1 sentence).`
      )

      const clean = result.replace(/```json|```/g, '').trim()

      return NextResponse.json({
        data: JSON.parse(clean)
      })
    }

    if (type === 'job-advice') {

      const { candidateName, skills, experience, job } = payload

      result = await ai(
        `Give 3-4 sentence personalized career advice to "${candidateName}" (${experience}, skills: ${skills}) about applying to "${job.title}" at "${job.company}" (${job.salary}). Cover: fit, key strength, skill to highlight, one tip to stand out.`
      )

      return NextResponse.json({
        data: result
      })
    }

    if (type === 'candidate-eval') {

      const { candidate, job } = payload

      result = await ai(
        `Evaluate "${candidate.name}" (${candidate.currentRole}, ${candidate.experience}, skills: ${candidate.skills.join(', ')}) for "${job.title}" requiring "${job.skills}". 3-4 sentences: fit rating, strongest skill, any gap, clear recommendation (Strong Yes / Yes / Maybe / Pass).`
      )

      return NextResponse.json({
        data: result
      })
    }

    if (type === 'optimize-jd') {

      const { title, company, location, salary, skills } = payload

      result = await ai(
        `Write a compelling job description (max 160 words) for: ${title} at ${company}, ${location}, ${salary}. Requirements: ${skills}. Format: 2-sentence intro, "What you'll do:" (3 bullets), "What we're looking for:" (3 bullets).`
      )

      return NextResponse.json({
        data: result
      })
    }

    if (type === 'market-insight') {

      const { industry, question } = payload

      result = await ai(
        `Answer for the "${industry}" sector in India: "${question}". 5-6 sentences with specific numbers, company names, or skills. Focus on actionable insights for someone in India in 2025.`
      )

      return NextResponse.json({
        data: result
      })
    }

    return NextResponse.json(
      { error: 'Unknown type' },
      { status: 400 }
    )

  } catch (err) {

    console.error(err)

    return NextResponse.json(
      { error: 'AI request failed. Check your GEMINI_API_KEY.' },
      { status: 500 }
    )
  }
}