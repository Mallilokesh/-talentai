'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LiveBadge from '@/components/ui/LiveBadge'

const links = [
  {href:'/',label:'Home'},{href:'/jobs',label:'Find Jobs'},
  {href:'/employer',label:'Employer'},{href:'/insights',label:'AI Insights'},
]

export default function Navbar() {
  const path = usePathname()
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="text-xl font-semibold text-brand-600">Talent<span className="text-gray-400 font-normal">AI</span></Link>
        <nav className="flex items-center gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${path===l.href?'bg-gray-100 text-gray-900 font-medium':'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LiveBadge />
          <Link href="/employer" className="btn-primary text-sm px-3 py-1.5">Post a Job</Link>
        </div>
      </div>
    </header>
  )
}
