'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const path = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    try { const s = localStorage.getItem('talentai_user'); if (s) setUser(JSON.parse(s)) } catch {}
  }, [])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    localStorage.removeItem('talentai_user')
    setUser(null)
    router.push('/login')
  }

  const links = [{href:'/',label:'Home'},{href:'/jobs',label:'Find Jobs'},{href:'/employer',label:'Employer'},{href:'/insights',label:'AI Insights'}]

  return (
    <header style={{background:'#fff',borderBottom:'1px solid #E5E7EB',position:'sticky',top:0,zIndex:50}}>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'10px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:16}}>
        <Link href="/" style={{fontSize:20,fontWeight:600,color:'#185FA5',textDecoration:'none'}}>Talent<span style={{color:'#9CA3AF',fontWeight:400}}>AI</span></Link>
        <nav style={{display:'flex',gap:2}}>
          {links.map(l=>(
            <Link key={l.href} href={l.href} style={{padding:'6px 12px',borderRadius:8,fontSize:13,textDecoration:'none',fontWeight:path===l.href?500:400,background:path===l.href?'#F3F4F6':'transparent',color:path===l.href?'#111827':'#6B7280'}}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{display:'flex',alignItems:'center',gap:5,fontSize:12,fontWeight:500,color:'#185FA5',background:'#EFF6FF',padding:'4px 10px',borderRadius:20}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#185FA5',display:'inline-block'}}></span>Live AI
          </span>
          {user ? (
            <>
              <Link href={`/dashboard/${user.role}`} style={{fontSize:13,color:'#185FA5',textDecoration:'none',fontWeight:500}}>Dashboard</Link>
              <button onClick={logout} style={{padding:'6px 14px',background:'#FEF2F2',color:'#DC2626',border:'1px solid #FECACA',borderRadius:8,fontSize:13,cursor:'pointer',fontWeight:500}}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" style={{padding:'6px 14px',border:'1px solid #E5E7EB',borderRadius:8,fontSize:13,textDecoration:'none',color:'#374151',fontWeight:500}}>Sign in</Link>
              <Link href="/register" style={{padding:'6px 14px',background:'#185FA5',color:'#fff',borderRadius:8,fontSize:13,textDecoration:'none',fontWeight:500}}>Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
