import { NextRequest, NextResponse } from 'next/server'
import { askClaude } from '@/lib/claude'

export async function POST(req: NextRequest) {
  try {
    const { industry, question } = await req.json()

    const prompt = `You are an AI labor market expert with deep knowledge of the Indian job market in 2025.

Answer this question for the "${industry}" sector: "${question}"

Give a data-informed, practical answer in 5-6 sentences. Include specific examples, numbers, company names, or skill names where possible. Focus on actionable insights for someone in India. Use plain text, no markdown.`

    const content = await askClaude(prompt, 700)
    return NextResponse.json({ content })
  } catch (error) {
    console.error('Insight error:', error)
    return NextResponse.json({ error: 'Failed to generate insight' }, { status: 500 })
  }
}
