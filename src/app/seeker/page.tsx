'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AIBox from '@/components/ui/AIBox'
import MatchRing from '@/components/ui/MatchRing'
import { JobMatch, SeekerProfile } from '@/lib/types'
import { Sparkles, Loader2, ChevronRight } from 'lucide-react'

const COLORS = [
  { bg: '#E6F1FB', tc: '#0C447C' },
  { bg: '#EEEDFE', tc: '#3C3489' },
  { bg: '#EAF3DE', tc: '#3B6D11' },
  { bg: '#FAEEDA', tc: '#633806' },
  { bg: '#FAECE7', tc: '#712B13' },
  { bg: '#E1F5EE', tc: '#085041' },
]

export default function SeekerPage() {
  const [profile, setProfile] = useState<SeekerProfile>({
    name: 'Arjun Sharma',
    role: 'React Developer',
    experience: '4 years',
    location: 'Hyderabad, India',
    skills: 'React, Node.js, TypeScript, AWS, MongoDB',
    workType: 'Hybrid',
    salaryExpectation: '₹25–35 LPA',
  })
  const [jobs, setJobs] = useState<JobMatch[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null)
  const [advice, setAdvice] = useState('')
  const [adviceLoading, setAdviceLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'matches' | 'applied'>('profile')

  const findMatches = async () => {
    setLoading(true)
    setJobs([])
    setSelectedJob(null)
    try {
      const res = await fetch('/api/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) })
      const data = await res.json()
      setJobs(data.jobs || [])
      setActiveTab('matches')
    } catch { /* ignore */ }
    setLoading(false)
  }

  const selectJob = async (job: JobMatch) => {
    setSelectedJob(job)
    setAdvice('')
    setAdviceLoading(true)
    try {
      const prompt = `You are a career advisor AI. Candidate "${profile.name}" with ${profile.experience} and skills "${profile.skills}" is considering applying to "${job.title}" at "${job.company}" (${job.location}, ${job.salary}). Give personalized advice in 3-4 sentences: why it's a good fit, their strongest relevant skill, one tip to stand out in the application. Be direct and specific.`
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) })
      const data = await res.json()
      setAdvice(data.content || '')
    } catch { setAdvice('Could not load advice. Please try again.') }
    setAdviceLoading(false)
  }

  const appliedJobs = [
    { title: 'Senior React Developer', company: 'Infosys', status: 'Interview scheduled', color: 'badge-green', progress: 75, date: 'May 12' },
    { title: 'Frontend Engineer', company: 'PhonePe', status: 'Under review', color: 'badge-amber', progress: 50, date: 'May 8' },
    { title: 'UI Engineer', company: 'Meesho', status: 'Application sent', color: 'badge-blue', progress: 25, date: 'May 3' },
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Job seeker dashboard</h1>
          <p className="text-gray-500 text-sm">Fill in your profile and let AI find your best-fit roles.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
          {(['profile', 'matches', 'applied'] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${activeTab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {t} {t === 'matches' && jobs.length > 0 && <span className="ml-1 badge badge-blue">{jobs.length}</span>}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <div className="card fade-in">
            <h2 className="text-base font-semibold mb-5 flex items-center gap-2">
              <Sparkles size={16} className="text-brand-600" /> Your profile
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: 'Full name', key: 'name', type: 'text' },
                { label: 'Current role', key: 'role', type: 'text' },
                { label: 'Location', key: 'location', type: 'text' },
                { label: 'Salary expectation', key: 'salaryExpectation', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  <input type={type} className="input" value={(profile as never)[key]}
                    onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Experience</label>
                <select className="input" value={profile.experience} onChange={e => setProfile(p => ({ ...p, experience: e.target.value }))}>
                  {['1 year','2 years','3 years','4 years','5 years','6 years','8+ years'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Work preference</label>
                <select className="input" value={profile.workType} onChange={e => setProfile(p => ({ ...p, workType: e.target.value }))}>
                  {['Remote','Hybrid','On-site'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Skills (comma separated)</label>
                <input className="input" value={profile.skills} onChange={e => setProfile(p => ({ ...p, skills: e.target.value }))} />
              </div>
            </div>
            <button onClick={findMatches} disabled={loading}
              className="btn-primary mt-6 flex items-center gap-2">
              {loading ? <><Loader2 size={14} className="animate-spin" /> Finding matches...</> : <><Sparkles size={14} /> Find AI job matches</>}
            </button>
          </div>
        )}

        {/* Matches tab */}
        {activeTab === 'matches' && (
          <div className="fade-in">
            {jobs.length === 0 ? (
              <div className="card text-center py-12 text-gray-400">
                <Sparkles size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">Go to Profile and click &quot;Find AI job matches&quot; to see your results.</p>
                <button onClick={() => setActiveTab('profile')} className="btn-primary mt-4 mx-auto flex items-center gap-1">
                  Set up profile <ChevronRight size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {jobs.map((job, i) => {
                    const c = COLORS[i % COLORS.length]
                    const pct = Math.round(job.matchScore)
                    const initials = job.company.slice(0, 2).toUpperCase()
                    const isSelected = selectedJob?.title === job.title && selectedJob?.company === job.company
                    return (
                      <div key={i} onClick={() => selectJob(job)}
                        className={`card cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-brand-400 ring-1 ring-brand-200' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0"
                            style={{ background: c.bg, color: c.tc }}>{initials}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm">{job.title}</span>
                              {i === 0 && <span className="badge badge-blue text-xs">Top match</span>}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">{job.company} · {job.location}</div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {job.tags.map(t => <span key={t} className="badge badge-purple text-xs">{t}</span>)}
                              <span className="badge badge-gray text-xs">{job.salary}</span>
                              {job.type && <span className="badge badge-green text-xs">{job.type}</span>}
                            </div>
                            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{job.reason}</p>
                          </div>
                          <MatchRing pct={pct} size={52} />
                        </div>
                        {isSelected && advice && <AIBox content={advice} loading={adviceLoading} label="Career advisor analysis" />}
                        {isSelected && adviceLoading && <AIBox content="" loading={true} label="Career advisor analysis" />}
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Applied tab */}
        {activeTab === 'applied' && (
          <div className="fade-in space-y-3">
            {appliedJobs.map((a) => (
              <div key={a.title} className="card">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-sm">{a.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{a.company} · Applied {a.date}</div>
                  </div>
                  <span className={`badge ${a.color}`}>{a.status}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${a.progress}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Applied</span><span>Review</span><span>Interview</span><span>Offer</span>
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
