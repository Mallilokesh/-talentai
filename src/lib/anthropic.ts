import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function callClaude(prompt: string, systemPrompt?: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: prompt }
  ]
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    ...(systemPrompt && { system: systemPrompt }),
    messages,
  })
  return response.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as Anthropic.TextBlock).text)
    .join('')
}
