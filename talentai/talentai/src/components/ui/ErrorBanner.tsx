'use client'
import { AlertCircle } from 'lucide-react'
interface Props { message: string }
export default function ErrorBanner({ message }: Props) {
  if (!message) return null
  return (
    <div className="flex gap-3 items-start bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 mb-5 text-sm leading-relaxed">
      <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
      <pre className="whitespace-pre-wrap font-sans">{message}</pre>
    </div>
  )
}
