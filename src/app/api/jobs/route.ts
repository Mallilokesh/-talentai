import { NextRequest, NextResponse } from 'next/server'
import { askClaudeJSON } from '@/lib/claude'
import { JobMatch, SeekerProfile } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const profile: SeekerProfile = await req.json()

    const prompt = `You are an AI job matching engine for an Indian job portal. Given this candidate profile, return EXACTLY 6 job match objects as a JSON array.

Candidate profile:
- Name: ${profile.name}
- Current role: ${profile.role}
- Experience: ${profile.experience}
- Location: ${profile.location}
- Skills: ${profile.skills}
- Work preference: ${profile.workType}
- Salary expectation: ${profile.salaryExpectation}

Return a JSON array of exactly 6 objects. Each object must have:
- title: job title string
- company: well-known Indian or MNC company name
- location: city and work mode (e.g. "Bengaluru · Hybrid")
- salary: salary range in LPA (e.g. "₹22–32 LPA")
- matchScore: integer between 72 and 98
- tags: array of exactly 3 relevant skill strings
- reason: one specific sentence explaining why this matches the candidate
- type: one of "Full-time", "Contract", "Hybrid"

Sort by matchScore descending.`

    const jobs = await askClaudeJSON<JobMatch[]>(prompt)
    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Job match error:', error)
    return NextResponse.json({ error: 'Failed to fetch job matches' }, { status: 500 })
  }
}
