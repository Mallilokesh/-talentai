'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'

export default function EmployerDashboard() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [candidates, setCandidates] = useState<any[]>([])
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    if (!loading && (!user || user.role !== 'employer')) router.push('/login')
  }, [user, loading])

  async function findCandidates() {
    setAiLoading(true); setCandidates([])
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'candidates', payload: { title:'Senior React Developer', company: user?.company||'My Company', location:'Hyderabad · Hybrid', salary:'₹28–38 LPA', skills:'React, Node.js, AWS, 4+ years' } }),
      })
      const data = await res.json()
      if (data.data) setCandidates(data.data)
    } catch {}
    setAiLoading(false)
  }

  if (loading || !user) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading...</div>

  const jobs = [
    {title:'Senior React Developer',apps:58,shortlisted:7,status:'Active'},
    {title:'Backend Engineer',apps:43,shortlisted:5,status:'Active'},
    {title:'Product Designer',apps:31,shortlisted:4,status:'Paused'},
  ]

  return (
    <div style={{minHeight:'100vh',background:'#F3F4F6'}}>
      <div style={{background:'#fff',borderBottom:'1px solid #E5E7EB',padding:'12px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontSize:20,fontWeight:600,color:'#185FA5'}}>Talent<span style={{color:'#9CA3AF',fontWeight:400}}>AI</span> <span style={{fontSize:13,background:'#EFF6FF',color:'#1D4ED8',padding:'2px 8px',borderRadius:6,fontWeight:500,marginLeft:8}}>Employer</span></div>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <Link href="/employer" style={{fontSize:13,color:'#185FA5',textDecoration:'none',fontWeight:500}}>Post a Job</Link>
          <span style={{fontSize:14,color:'#374151'}}>🏢 {user.company || user.name}</span>
          <button onClick={logout} style={{padding:'6px 14px',background:'#FEF2F2',color:'#DC2626',border:'1px solid #FECACA',borderRadius:8,fontSize:13,cursor:'pointer',fontWeight:500}}>Logout</button>
        </div>
      </div>
      <div style={{maxWidth:900,margin:'0 auto',padding:24}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
          {[['Active Jobs','3','💼'],['Total Applicants','132','👥'],['AI Shortlisted','16','⭐']].map(([l,v,ic])=>(
            <div key={l} style={{background:'#fff',borderRadius:12,padding:20,border:'1px solid #E5E7EB',display:'flex',alignItems:'center',gap:12}}>
              <div style={{fontSize:28}}>{ic}</div>
              <div><div style={{fontSize:24,fontWeight:700,color:'#185FA5'}}>{v}</div><div style={{fontSize:12,color:'#6B7280'}}>{l}</div></div>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          <div>
            <h2 style={{fontSize:16,fontWeight:600,marginBottom:12}}>Active Job Listings</h2>
            {jobs.map((j,i)=>(
              <div key={i} style={{background:'#fff',borderRadius:12,padding:16,marginBottom:10,border:'1px solid #E5E7EB'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                  <span style={{fontWeight:600,fontSize:14}}>{j.title}</span>
                  <span style={{background:j.status==='Active'?'#F0FDF4':'#F3F4F6',color:j.status==='Active'?'#166534':'#6B7280',padding:'2px 8px',borderRadius:6,fontSize:12,fontWeight:500}}>{j.status}</span>
                </div>
                <div style={{fontSize:13,color:'#6B7280',marginBottom:8}}>👥 {j.apps} applicants · ⭐ {j.shortlisted} AI-shortlisted</div>
                <div style={{height:5,background:'#F3F4F6',borderRadius:3,overflow:'hidden'}}>
                  <div style={{height:'100%',background:'#185FA5',width:`${Math.round(j.apps/60*100)}%`,borderRadius:3}}></div>
                </div>
              </div>
            ))}
            <button onClick={()=>router.push('/employer')} style={{width:'100%',padding:'10px',background:'#185FA5',color:'#fff',border:'none',borderRadius:8,fontSize:14,fontWeight:500,cursor:'pointer',marginTop:4}}>
              + Post a new job
            </button>
          </div>
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <h2 style={{fontSize:16,fontWeight:600}}>AI Candidates</h2>
              <button onClick={findCandidates} disabled={aiLoading} style={{padding:'5px 12px',background:'#185FA5',color:'#fff',border:'none',borderRadius:8,fontSize:12,fontWeight:500,cursor:'pointer',opacity:aiLoading?0.6:1}}>
                {aiLoading?'Loading...':'🤖 Find candidates'}
              </button>
            </div>
            {candidates.length===0 && !aiLoading && <div style={{background:'#fff',borderRadius:12,padding:24,textAlign:'center',color:'#9CA3AF',border:'1px solid #E5E7EB',fontSize:13}}>Click "Find candidates" to get AI-matched profiles</div>}
            {aiLoading && <div style={{background:'#fff',borderRadius:12,padding:24,textAlign:'center',color:'#6B7280',border:'1px solid #E5E7EB',fontSize:13}}>🤖 AI is shortlisting candidates...</div>}
            {candidates.map((c,i)=>(
              <div key={i} style={{background:'#fff',borderRadius:12,padding:14,marginBottom:8,border:'1px solid #E5E7EB',display:'flex',gap:10,alignItems:'flex-start'}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:'#E6F1FB',color:'#0C447C',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:600,flexShrink:0}}>
                  {c.name?.split(' ').map((w:string)=>w[0]).join('').slice(0,2)}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13}}>{c.name}</div>
                  <div style={{fontSize:12,color:'#6B7280'}}>{c.currentRole} · {c.experience}</div>
                  <div style={{display:'flex',gap:4,flexWrap:'wrap' as const,marginTop:4}}>
                    {(c.skills||[]).map((s:string)=><span key={s} style={{background:'#EEEDFE',color:'#3C3489',padding:'1px 6px',borderRadius:10,fontSize:10,fontWeight:500}}>{s}</span>)}
                  </div>
                </div>
                <div style={{textAlign:'center',flexShrink:0}}>
                  <div style={{fontSize:16,fontWeight:700,color:'#185FA5'}}>{c.matchScore}%</div>
                  <div style={{fontSize:10,color:'#9CA3AF'}}>match</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
