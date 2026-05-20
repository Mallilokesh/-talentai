'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'

export default function SeekerDashboard() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [jobs, setJobs] = useState<any[]>([])
  const [aiLoading, setAiLoading] = useState(false)
  const [advice, setAdvice] = useState('')

  useEffect(() => {
    if (!loading && (!user || user.role !== 'seeker')) router.push('/login')
  }, [user, loading])

  async function findMatches() {
    setAiLoading(true); setJobs([])
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'job-matches', payload: { name: user?.name, role: 'Software Developer', experience: '3 years', location: 'Hyderabad', skills: 'React, Node.js, Python', workType: 'Hybrid' } }),
      })
      const data = await res.json()
      if (data.data) setJobs(data.data)
    } catch {}
    setAiLoading(false)
  }

  if (loading || !user) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading...</div>

  const applications = [
    {title:'Senior React Developer',company:'Infosys',status:'Interview',color:'#166534',bg:'#F0FDF4'},
    {title:'Frontend Engineer',company:'PhonePe',status:'Under Review',color:'#92400E',bg:'#FFFBEB'},
    {title:'UI Engineer',company:'Meesho',status:'Applied',color:'#1D4ED8',bg:'#EFF6FF'},
  ]

  return (
    <div style={{minHeight:'100vh',background:'#F3F4F6'}}>
      <div style={{background:'#fff',borderBottom:'1px solid #E5E7EB',padding:'12px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontSize:20,fontWeight:600,color:'#185FA5'}}>Talent<span style={{color:'#9CA3AF',fontWeight:400}}>AI</span></div>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <Link href="/jobs" style={{fontSize:13,color:'#185FA5',textDecoration:'none',fontWeight:500}}>Find Jobs</Link>
          <span style={{fontSize:14,color:'#374151'}}>👋 {user.name}</span>
          <button onClick={logout} style={{padding:'6px 14px',background:'#FEF2F2',color:'#DC2626',border:'1px solid #FECACA',borderRadius:8,fontSize:13,cursor:'pointer',fontWeight:500}}>Logout</button>
        </div>
      </div>
      <div style={{maxWidth:860,margin:'0 auto',padding:24}}>
        <div style={{background:'linear-gradient(135deg,#185FA5,#0C447C)',borderRadius:16,padding:24,color:'#fff',marginBottom:24}}>
          <h1 style={{fontSize:20,fontWeight:600,marginBottom:4}}>Welcome back, {user.name}! 👋</h1>
          <p style={{opacity:.85,fontSize:14,marginBottom:16}}>Your AI job matches are ready. Click below to find roles tailored to your profile.</p>
          <button onClick={findMatches} disabled={aiLoading} style={{background:'#fff',color:'#185FA5',border:'none',padding:'9px 20px',borderRadius:8,fontSize:14,fontWeight:600,cursor:'pointer',opacity:aiLoading?0.7:1}}>
            {aiLoading?'Finding matches...':'🤖 Get AI job matches'}
          </button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          <div>
            <h2 style={{fontSize:16,fontWeight:600,marginBottom:12}}>AI Job Matches</h2>
            {jobs.length === 0 && !aiLoading && <div style={{background:'#fff',borderRadius:12,padding:24,textAlign:'center',color:'#9CA3AF',border:'1px solid #E5E7EB',fontSize:13}}>Click "Get AI job matches" above to see personalized roles</div>}
            {aiLoading && <div style={{background:'#fff',borderRadius:12,padding:24,textAlign:'center',color:'#6B7280',border:'1px solid #E5E7EB',fontSize:13}}>🤖 AI is finding your best matches...</div>}
            {jobs.map((j,i)=>(
              <div key={i} style={{background:'#fff',borderRadius:12,padding:16,marginBottom:10,border:'1px solid #E5E7EB'}}>
                <div style={{fontWeight:600,fontSize:14,marginBottom:2}}>{j.title}</div>
                <div style={{fontSize:13,color:'#6B7280',marginBottom:8}}>{j.company} · {j.location}</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap' as const,marginBottom:8}}>
                  {(j.tags||[]).map((t:string)=><span key={t} style={{background:'#EEEDFE',color:'#3C3489',padding:'2px 8px',borderRadius:12,fontSize:11,fontWeight:500}}>{t}</span>)}
                  <span style={{background:'#F3F4F6',color:'#6B7280',padding:'2px 8px',borderRadius:12,fontSize:11}}>{j.salary}</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:12,color:'#6B7280'}}>{j.reason?.slice(0,60)}...</span>
                  <span style={{fontSize:14,fontWeight:700,color:'#185FA5'}}>{j.matchScore}%</span>
                </div>
              </div>
            ))}
          </div>
          <div>
            <h2 style={{fontSize:16,fontWeight:600,marginBottom:12}}>My Applications</h2>
            {applications.map((a,i)=>(
              <div key={i} style={{background:'#fff',borderRadius:12,padding:16,marginBottom:10,border:'1px solid #E5E7EB'}}>
                <div style={{fontWeight:600,fontSize:14,marginBottom:2}}>{a.title}</div>
                <div style={{fontSize:13,color:'#6B7280',marginBottom:8}}>{a.company}</div>
                <span style={{background:a.bg,color:a.color,padding:'3px 10px',borderRadius:12,fontSize:12,fontWeight:500}}>{a.status}</span>
              </div>
            ))}
            <div style={{background:'#fff',borderRadius:12,padding:16,border:'1px solid #E5E7EB',marginTop:4}}>
              <div style={{fontWeight:600,fontSize:14,marginBottom:8}}>📊 Profile strength</div>
              <div style={{height:8,background:'#F3F4F6',borderRadius:4,overflow:'hidden'}}>
                <div style={{height:'100%',width:'72%',background:'#185FA5',borderRadius:4}}></div>
              </div>
              <div style={{fontSize:12,color:'#6B7280',marginTop:6}}>72% complete · <span style={{color:'#185FA5',cursor:'pointer'}}>Improve →</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
