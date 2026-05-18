'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AIBox from '@/components/ui/AIBox'
import Avatar from '@/components/ui/Avatar'
import { Brain, Users, FileText } from 'lucide-react'
import type { Candidate, JobPosting } from '@/lib/types'

export default function EmployerPage() {
  const [job, setJob] = useState<JobPosting>({
    title: 'Senior React Developer', company: 'Infosys',
    location: 'Hyderabad · Hybrid', salary: '₹28–38 LPA',
    skills: 'React, Node.js, AWS, 4+ years experience', description: '',
    jobType: 'Full Time',
  })
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCand, setSelectedCand] = useState<Candidate | null>(null)
  const [evaluation, setEvaluation] = useState('')
  const [evalLoading, setEvalLoading] = useState(false)
  const [jd, setJd] = useState('')
  const [jdLoading, setJdLoading] = useState(false)
  const [tab, setTab] = useState<'post'|'candidates'>('post')

  async function findCandidates() {
    setLoading(true); setCandidates([]); setSelectedCand(null); setEvaluation('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'candidates', payload: job }),
      })
      const { data } = await res.json()
      setCandidates(Array.isArray(data) ? data : [])
      setTab('candidates')
    } catch { setCandidates([]) }
    setLoading(false)
  }

  async function evaluateCandidate(c: Candidate) {
    setSelectedCand(c); setEvaluation(''); setEvalLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'candidate-eval', payload: { candidate: c, job } }),
      })
      const { data } = await res.json()
      setEvaluation(data)
    } catch { setEvaluation('Could not load evaluation.') }
    setEvalLoading(false)
  }

  async function optimizeJD() {
    setJdLoading(true); setJd('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'optimize-jd', payload: job }),
      })
      const { data } = await res.json()
      setJd(data)
    } catch { setJd('Could not generate JD.') }
    setJdLoading(false)
  }

  const fields: [string, keyof JobPosting][] = [
    ['Job title','title'],['Company','company'],['Location','location'],['Salary range','salary'],['Required skills','skills'],
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-6">Employer Dashboard</h1>

        <div className="flex gap-2 mb-6">
          {(['post','candidates'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab===t ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {t === 'post' ? '📋 Post a Job' : `👥 AI Candidates ${candidates.length > 0 ? `(${candidates.length})` : ''}`}
            </button>
          ))}
        </div>

        {tab === 'post' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card space-y-3">
              <h2 className="font-semibold">Job details</h2>
              {fields.map(([label, key]) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                  <input className="input" value={job[key] || ''}
                    onChange={e => setJob(j => ({ ...j, [key]: e.target.value }))} />
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button onClick={findCandidates} disabled={loading} className="btn-primary flex-1 justify-center">
                  <Users size={15} /> {loading ? 'Scanning...' : 'Find AI candidates'}
                </button>
                <button onClick={optimizeJD} disabled={jdLoading} className="btn-secondary">
                  <FileText size={15} /> {jdLoading ? 'Writing...' : 'Optimize JD'}
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {(jd || jdLoading) && (
                <div className="card border-brand-600">
                  <div className="flex items-center gap-2 text-xs font-medium text-brand-600 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600 pulse-dot" />
                    AI-optimized job description
                  </div>
                  <AIBox
                    content={evaluation}
                    loading={evalLoading}
                    label={`AI evaluation — ${selectedCand?.name || 'Candidate'}`}
                  />
                </div>
              )}
              {!jd && !jdLoading && (
                <div className="card text-center py-12 text-gray-400 text-sm">
                  Fill in job details and click "Optimize JD" to generate a polished description, or "Find AI candidates" to see matched profiles.
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'candidates' && (
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 space-y-3">
              {loading && (
                <div className="card text-center py-10">
                  <Brain size={32} className="mx-auto mb-3 text-brand-600 animate-pulse" />
                  <p className="text-gray-400 text-sm">AI is shortlisting candidates...</p>
                </div>
              )}
              {candidates.map((c, i) => (
                <div key={i} onClick={() => evaluateCandidate(c)}
                  className={`card cursor-pointer transition-all hover:border-brand-600 ${selectedCand?.name === c.name ? 'border-brand-600' : ''}`}>
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} index={i} size={40} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.currentRole} · {c.experience} · {c.location}</div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {(c.skills||[]).map(s => <span key={s} className="badge badge-purple">{s}</span>)}
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{c.summary}</p>
                    </div>
                    <div className="text-center flex-shrink-0">
                      <div className="text-xl font-bold text-brand-600">{c.matchScore}%</div>
                      <div className="text-xs text-gray-400">AI match</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="md:col-span-2">
              {selectedCand && (
                <div className="card border-brand-600 sticky top-20">
                  <div className="flex items-center gap-2 text-xs font-medium text-brand-600 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600 pulse-dot" />
                    AI evaluation — {selectedCand.name}
                  </div>
                  <AIBox text={evaluation} loading={evalLoading} />
                  <div className="mt-3 flex gap-2">
                    <button className="btn-primary text-xs px-3 py-1.5">Schedule interview</button>
                    <button className="btn-secondary text-xs px-3 py-1.5">View full profile</button>
                  </div>
                </div>
              )}
              {!selectedCand && (
                <div className="card text-center py-10 text-gray-400 text-sm">
                  Click a candidate to get AI evaluation
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
