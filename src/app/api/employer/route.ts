import { NextRequest, NextResponse } from 'next/server'
import { askClaudeJSON } from '@/lib/claude'
import { Candidate, JobPosting } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const job: JobPosting = await req.json()

    const prompt = `You are an AI talent matching engine for an Indian recruitment platform. For the job posting below, generate exactly 6 realistic candidate profiles as a JSON array.

Job posting:
- Title: ${job.title}
- Company: ${job.company}
- Location: ${job.location}
- Requirements: ${job.skills}
- Salary: ${job.salary}
- Type: ${job.jobType}

Return a JSON array of exactly 6 objects. Each object must have:
- name: realistic full Indian name (varied genders)
- currentRole: their current job title
- experience: e.g. "4 years", "6 years"
- location: Indian city they are based in
- matchScore: integer between 74 and 97
- skills: array of exactly 3 relevant skills from the job requirements
- summary: one strong sentence summarising why they are a great candidate

Sort by matchScore descending.`

    const candidates = await askClaudeJSON<Candidate[]>(prompt)
    return NextResponse.json({ candidates })
  } catch (error) {
    console.error('Candidate match error:', error)
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 })
  }
}
