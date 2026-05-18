'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AIBox from '@/components/ui/AIBox'
import { TrendingUp } from 'lucide-react'

const INDUSTRIES = ['Software Engineering','Data Science & AI','Product Management','UX/UI Design','Finance & Banking','Healthcare','Digital Marketing','DevOps & Cloud']
const QUESTIONS = ['Top in-demand skills right now','Salary benchmarks in India','Hiring trends this quarter','How to stand out as a candidate','Best companies to work for','Career growth paths','Remote work opportunities','Skills to learn in next 6 months']

export default function InsightsPage() {
  const [industry, setIndustry] = useState('Software Engineering')
  const [question, setQuestion] = useState('Top in-demand skills right now')
  const [insight, setInsight] = useState('')
  const [loading, setLoading] = useState(false)

  async function getInsight() {
    setLoading(true); setInsight('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'market-insight', payload: { industry, question } }),
      })
      const { data } = await res.json()
      setInsight(data)
    } catch { setInsight('Could not load insight. Please try again.') }
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="text-brand-600" size={24} />
          <h1 className="text-xl font-semibold">AI Market Intelligence</h1>
        </div>
        <p className="text-gray-500 text-sm mb-8">Real-time insights on the Indian job market, powered by Claude AI.</p>

        <div className="card mb-6 space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Your industry or role</label>
            <select className="input" value={industry} onChange={e => setIndustry(e.target.value)}>
              {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">What do you want to know?</label>
            <select className="input" value={question} onChange={e => setQuestion(e.target.value)}>
              {QUESTIONS.map(q => <option key={q}>{q}</option>)}
            </select>
          </div>
          <button onClick={getInsight} disabled={loading} className="btn-primary justify-center">
            <TrendingUp size={15} /> {loading ? 'Analyzing market...' : 'Get AI market insight'}
          </button>
        </div>

        {(insight || loading) && (
          <div className="card border-brand-600">
            <div className="flex items-center gap-2 text-xs font-medium text-brand-600 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600 pulse-dot" />
              AI insight — {industry}: {question}
            </div>
            <AIBox text={insight} loading={loading} />
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
          {[['48K+','Active jobs'],['₹8–80L','Salary range'],['94%','Match accuracy'],['2.4M+','Candidates']].map(([num,label]) => (
            <div key={label} className="card text-center p-4">
              <div className="text-lg font-bold text-brand-600">{num}</div>
              <div className="text-xs text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
