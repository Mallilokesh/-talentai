'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AIBox from '@/components/ui/AIBox'
import Avatar from '@/components/ui/Avatar'
import ErrorBanner from '@/components/ui/ErrorBanner'
import { Brain, Users, FileText } from 'lucide-react'
import type { Candidate, JobPosting } from '@/lib/types'

const ACTIVE_JOBS = [
  { title: 'Senior React Developer', apps: 58, shortlisted: 7, posted: 'May 1' },
  { title: 'Backend Engineer (Node.js)', apps: 49, shortlisted: 6, posted: 'May 5' },
  { title: 'Product Designer', apps: 35, shortlisted: 5, posted: 'May 10' },
]

export default function EmployerPage() {
  const [tab, setTab] = useState<'post'|'candidates'|'dashboard'>('post')
  const [job, setJob] = useState<JobPosting>({
    title: 'Senior React Developer', company: 'Infosys',
    location: 'Hyderabad · Hybrid', salary: '₹28–38 LPA',
    skills: 'React, Node.js, AWS, 4+ years experience',
  })
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedCand, setSelectedCand] = useState<Candidate | null>(null)
  const [evaluation, setEvaluation] = useState('')
  const [evalLoading, setEvalLoading] = useState(false)
  const [jd, setJd] = useState('')
  const [jdLoading, setJdLoading] = useState(false)

  async function findCandidates() {
    setLoading(true); setCandidates([]); setSelectedCand(null); setError('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'candidates', payload: job }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.fix ? `${json.error}\n\n👉 ${json.fix}` : json.error); return }
      setCandidates(Array.isArray(json.data) ? json.data : [])
      setTab('candidates')
    } catch { setError('Network error — check your deployment.') }
    finally { setLoading(false) }
  }

  async function evaluateCandidate(c: Candidate) {
    setSelectedCand(c); setEvaluation(''); setEvalLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'candidate-eval', payload: { candidate: c, job } }),
      })
      const json = await res.json()
      setEvaluation(res.ok ? json.data : json.error || 'Could not evaluate.')
    } catch { setEvaluation('Network error.') }
    finally { setEvalLoading(false) }
  }

  async function optimizeJD() {
    setJdLoading(true); setJd(''); setError('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'optimize-jd', payload: job }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error); return }
      setJd(json.data)
    } catch { setError('Could not generate JD.') }
    finally { setJdLoading(false) }
  }

  const fields: [string, keyof JobPosting][] = [
    ['Job title','title'],['Company','company'],['Location','location'],
    ['Salary range','salary'],['Required skills','skills'],
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-xl font-medium mb-5">Employer Dashboard</h1>
        <ErrorBanner message={error} />
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['post','candidates','dashboard'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab===t?'bg-brand-600 text-white':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {t==='post'?'📋 Post a Job':t==='candidates'?`👥 AI Candidates${candidates.length?` (${candidates.length})`:''}`: '📊 Dashboard'}
            </button>
          ))}
        </div>

        {tab==='post' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="font-medium mb-4 flex items-center gap-2"><FileText size={16}/> Job details</h2>
              {fields.map(([label,key]) => (
                <div key={key} className="mb-3">
                  <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                  <input className="input" value={job[key]||''}
                    onChange={e => setJob(j => ({...j,[key]:e.target.value}))} />
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <button onClick={findCandidates} disabled={loading} className="btn-primary flex-1 justify-center">
                  <Users size={15}/> {loading?'Scanning...':'Find AI candidates'}
                </button>
                <button onClick={optimizeJD} disabled={jdLoading} className="btn-secondary">
                  <FileText size={15}/> {jdLoading?'Writing...':'Optimize JD'}
                </button>
              </div>
            </div>
            <div>
              {(jd||jdLoading) ? (
                <div className="card border-brand-600">
                  <div className="flex items-center gap-2 text-xs font-medium text-brand-600 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600 pulse-dot"/>
                    AI-optimized job description
                  </div>
                  <AIBox text={jd} loading={jdLoading}/>
                </div>
              ) : (
                <div className="card text-center py-12 text-gray-400 text-sm">
                  <FileText size={28} className="mx-auto mb-3 opacity-30"/>
                  Click &ldquo;Optimize JD&rdquo; to generate a polished job description
                </div>
              )}
            </div>
          </div>
        )}

        {tab==='candidates' && (
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 space-y-3">
              {loading && (
                <div className="card text-center py-12">
                  <Brain size={32} className="mx-auto mb-3 text-brand-600 animate-pulse"/>
                  <p className="text-gray-400 text-sm">AI is shortlisting candidates...</p>
                </div>
              )}
              {!loading && candidates.length===0 && (
                <div className="card text-center py-12 text-gray-400 text-sm">
                  <Users size={28} className="mx-auto mb-3 opacity-30"/>
                  Go to &ldquo;Post a Job&rdquo; and click &ldquo;Find AI candidates&rdquo;
                </div>
              )}
              {candidates.map((c,i) => (
                <div key={i} onClick={() => evaluateCandidate(c)}
                  className={`card cursor-pointer transition-all hover:border-brand-600 ${selectedCand?.name===c.name?'border-brand-600':''}`}>
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} index={i} size={40}/>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.currentRole} · {c.experience} · {c.location}</div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {(c.skills||[]).map(s=><span key={s} className="badge badge-purple">{s}</span>)}
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
              {selectedCand ? (
                <div className="card border-brand-600 sticky top-20">
                  <div className="flex items-center gap-2 text-xs font-medium text-brand-600 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600 pulse-dot"/>
                    AI evaluation — {selectedCand.name}
                  </div>
                  <AIBox text={evaluation} loading={evalLoading}/>
                  <div className="flex gap-2 mt-3">
                    <button className="btn-primary text-xs px-3 py-1.5">Schedule interview</button>
                    <button className="btn-secondary text-xs px-3 py-1.5">View profile</button>
                  </div>
                </div>
              ) : (
                <div className="card text-center py-10 text-gray-400 text-sm">
                  Click a candidate to get AI evaluation
                </div>
              )}
            </div>
          </div>
        )}

        {tab==='dashboard' && (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[['3','Active posts'],['142','Total applicants'],['18','AI shortlisted']].map(([n,l]) => (
                <div key={l} className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-brand-600">{n}</div>
                  <div className="text-xs text-gray-500 mt-1">{l}</div>
                </div>
              ))}
            </div>
            <h2 className="font-medium mb-3">Active listings</h2>
            {ACTIVE_JOBS.map(j => (
              <div key={j.title} className="card mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">{j.title}</span>
                  <span className="badge badge-green">Active</span>
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>👥 {j.apps} applicants</span>
                  <span>⭐ {j.shortlisted} AI-shortlisted</span>
                  <span>📅 Posted {j.posted}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-brand-600 rounded-full" style={{width:`${Math.round(j.apps/60*100)}%`}}/>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
