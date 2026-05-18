'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import MatchRing from '@/components/ui/MatchRing'
import AIBox from '@/components/ui/AIBox'
import Avatar from '@/components/ui/Avatar'
import { Brain } from 'lucide-react'
import type { JobMatch, SeekerProfile } from '@/lib/types'

export default function JobsPage() {
  const [profile, setProfile] = useState<SeekerProfile>({
    name: 'Arjun Sharma', role: 'React Developer',
    experience: '4 years', location: 'Hyderabad, India',
    skills: 'React, Node.js, TypeScript, AWS, MongoDB', workType: 'Hybrid',
    salaryExpectation: '₹18–25 LPA',
  })
  const [jobs, setJobs] = useState<JobMatch[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null)
  const [advice, setAdvice] = useState('')
  const [adviceLoading, setAdviceLoading] = useState(false)

  async function findJobs() {
    setLoading(true); setJobs([]); setSelectedJob(null); setAdvice('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'job-matches', payload: profile }),
      })
      const { data } = await res.json()
      setJobs(Array.isArray(data) ? data : [])
    } catch { setJobs([]) }
    setLoading(false)
  }

  async function getAdvice(job: JobMatch) {
    setSelectedJob(job); setAdvice(''); setAdviceLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'job-advice', payload: {
          candidateName: profile.name, skills: profile.skills,
          experience: profile.experience, job,
        }}),
      })
      const { data } = await res.json()
      setAdvice(data)
    } catch { setAdvice('Could not load advice. Please try again.') }
    setAdviceLoading(false)
  }

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-5 gap-6">
        <aside className="md:col-span-2 space-y-4">
          <div className="card">
            <h2 className="font-semibold mb-4">Your profile</h2>
            {([['Full name','name'],['Current role','role'],['Location','location'],['Skills (comma separated)','skills']] as const).map(([label, key]) => (
              <div key={key} className="mb-3">
                <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                <input className="input" value={profile[key as keyof SeekerProfile]}
                  onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block">Experience</label>
              <select className="input" value={profile.experience}
                onChange={e => setProfile(p => ({ ...p, experience: e.target.value }))}>
                {['1 year','2 years','3 years','4 years','5 years','6 years','8+ years'].map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">Work preference</label>
              <select className="input" value={profile.workType}
                onChange={e => setProfile(p => ({ ...p, workType: e.target.value }))}>
                {['Remote','Hybrid','On-site'].map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
            <button onClick={findJobs} disabled={loading} className="btn-primary w-full justify-center">
              <Brain size={15} /> {loading ? 'Finding matches...' : 'Find AI job matches'}
            </button>
          </div>
        </aside>

        <section className="md:col-span-3 space-y-3">
          {loading && (
            <div className="card text-center py-10">
              <Brain size={32} className="mx-auto mb-3 text-brand-600 animate-pulse" />
              <p className="text-gray-400 text-sm">AI is finding your best matches...</p>
            </div>
          )}
          {!loading && jobs.length === 0 && (
            <div className="card text-center py-12 text-gray-400 text-sm">
              Fill in your profile and click "Find AI job matches" to get started.
            </div>
          )}
          {jobs.map((job, i) => (
            <div key={i} onClick={() => getAdvice(job)}
              className={`card cursor-pointer transition-all hover:border-brand-600 ${selectedJob?.title === job.title ? 'border-brand-600' : ''}`}>
              <div className="flex items-start gap-3">
                <Avatar name={job.company} index={i} size={40} rounded="lg" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{job.title}</div>
                  <div className="text-xs text-gray-500">{job.company} · {job.location}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(job.tags||[]).map(t => <span key={t} className="badge badge-purple">{t}</span>)}
                    <span className="badge badge-gray">{job.salary}</span>
                    {job.jobType && <span className="badge badge-blue">{job.jobType}</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">{job.reason}</p>
                </div>
                <MatchRing pct={Math.round(job.matchScore)} />
              </div>
            </div>
          ))}
          {selectedJob && (
            <div className="card border-brand-600">
              <div className="flex items-center gap-2 text-xs font-medium text-brand-600 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-600 pulse-dot" />
                AI career advisor — {selectedJob.title} at {selectedJob.company}
              </div>
              <AIBox text={advice} loading={adviceLoading} />
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
