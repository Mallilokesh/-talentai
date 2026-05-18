'use client'
interface Props {
  content: string
  loading: boolean
  label: string
}
export default function AIBox({ text, loading }: Props) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm leading-relaxed whitespace-pre-wrap min-h-12">
      {loading ? <span className="text-gray-400 italic">AI is thinking...</span> : text}
    </div>
  )
}
