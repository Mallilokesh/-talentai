'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const user = await login(email, password)
      router.push(user.role === 'admin' ? '/dashboard/admin' : user.role === 'employer' ? '/dashboard/employer' : '/dashboard/seeker')
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  function fill(r: string) {
    const c: any = { admin:['admin@talentai.com','admin123'], seeker:['seeker@talentai.com','seeker123'], employer:['employer@talentai.com','employer123'] }
    setEmail(c[r][0]); setPassword(c[r][1])
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#EFF6FF,#F9FAFB)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{width:'100%',maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <Link href="/" style={{textDecoration:'none'}}>
            <div style={{fontSize:32,fontWeight:700,color:'#185FA5'}}>Talent<span style={{color:'#9CA3AF',fontWeight:400}}>AI</span></div>
          </Link>
          <p style={{color:'#6B7280',marginTop:6,fontSize:14}}>Sign in to your account</p>
        </div>

        <div style={{background:'#EFF6FF',border:'1px solid #BFDBFE',borderRadius:12,padding:14,marginBottom:18}}>
          <p style={{fontSize:12,fontWeight:600,color:'#1E40AF',marginBottom:8}}>🚀 Demo credentials — click to fill:</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
            {[['admin','🛡️ Admin'],['seeker','🔍 Seeker'],['employer','🏢 Employer']].map(([r,label])=>(
              <button key={r} onClick={()=>fill(r)} style={{padding:'8px 4px',background:'#fff',border:'1px solid #93C5FD',borderRadius:8,fontSize:12,fontWeight:500,color:'#1D4ED8',cursor:'pointer',textAlign:'center'}}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{background:'#fff',borderRadius:20,padding:28,boxShadow:'0 4px 20px rgba(0,0,0,0.08)',border:'1px solid #E5E7EB'}}>
          <h2 style={{fontSize:20,fontWeight:600,marginBottom:20,color:'#111827'}}>Welcome back</h2>
          {error && <div style={{background:'#FEF2F2',border:'1px solid #FCA5A5',color:'#DC2626',borderRadius:8,padding:'10px 14px',fontSize:13,marginBottom:16}}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:12,color:'#6B7280',display:'block',marginBottom:5,fontWeight:500}}>Email address</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com"
                style={{width:'100%',padding:'9px 12px',fontSize:14,border:'1px solid #E5E7EB',borderRadius:8,outline:'none',boxSizing:'border-box'}} />
            </div>
            <div style={{marginBottom:8}}>
              <label style={{fontSize:12,color:'#6B7280',display:'block',marginBottom:5,fontWeight:500}}>Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••"
                style={{width:'100%',padding:'9px 12px',fontSize:14,border:'1px solid #E5E7EB',borderRadius:8,outline:'none',boxSizing:'border-box'}} />
            </div>
            <div style={{textAlign:'right',marginBottom:20}}>
              <Link href="/forgot-password" style={{fontSize:13,color:'#185FA5',textDecoration:'none'}}>Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} style={{width:'100%',padding:'12px',background:'#185FA5',color:'#fff',border:'none',borderRadius:8,fontSize:15,fontWeight:600,cursor:'pointer',opacity:loading?0.6:1}}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>
          <p style={{textAlign:'center',fontSize:13,color:'#6B7280',marginTop:18}}>
            No account? <Link href="/register" style={{color:'#185FA5',fontWeight:600,textDecoration:'none'}}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
