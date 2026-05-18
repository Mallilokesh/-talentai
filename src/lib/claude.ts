import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function askClaude(prompt: string, maxTokens = 1000): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  })
  return message.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { type: 'text'; text: string }).text)
    .join('')
}

export async function askClaudeJSON<T>(prompt: string, maxTokens = 1200): Promise<T> {
  const raw = await askClaude(prompt + '\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no backticks, no explanation.', maxTokens)
  const cleaned = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned) as T
}
