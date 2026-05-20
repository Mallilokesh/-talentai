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
    const creds: any = { admin: ['admin@talentai.com','admin123'], seeker: ['seeker@talentai.com','seeker123'], employer: ['employer@talentai.com','employer123'] }
    setEmail(creds[r][0]); setPassword(creds[r][1])
  }

  return (
    <div style={{minHeight:'100vh',background:'#F3F4F6',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{width:'100%',maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:30,fontWeight:600,color:'#185FA5'}}>Talent<span style={{color:'#9CA3AF',fontWeight:400}}>AI</span></div>
          <p style={{color:'#6B7280',marginTop:6,fontSize:14}}>Sign in to your account</p>
        </div>
        <div style={{background:'#EFF6FF',border:'1px solid #BFDBFE',borderRadius:12,padding:14,marginBottom:18}}>
          <p style={{fontSize:12,fontWeight:600,color:'#1E40AF',marginBottom:8}}>🚀 Demo — click to fill credentials:</p>
          <div style={{display:'flex',gap:8}}>
            {['admin','seeker','employer'].map(r=>(
              <button key={r} onClick={()=>fill(r)} style={{padding:'6px 14px',background:'#fff',border:'1px solid #93C5FD',borderRadius:8,fontSize:12,fontWeight:500,color:'#1D4ED8',cursor:'pointer',textTransform:'capitalize'}}>{r}</button>
            ))}
          </div>
        </div>
        <div style={{background:'#fff',borderRadius:16,padding:28,boxShadow:'0 2px 8px rgba(0,0,0,0.07)',border:'1px solid #E5E7EB'}}>
          <h2 style={{fontSize:20,fontWeight:600,marginBottom:20,color:'#111827'}}>Welcome back</h2>
          {error && <div style={{background:'#FEF2F2',border:'1px solid #FCA5A5',color:'#DC2626',borderRadius:8,padding:'10px 14px',fontSize:13,marginBottom:16}}>{error}</div>}
          <form onSubmit={handleSubmit}>
            {[['Email','email','email',email,setEmail],['Password','password','password',password,setPassword]].map(([label,type,_,val,setter]:any)=>(
              <div key={label} style={{marginBottom:14}}>
                <label style={{fontSize:12,color:'#6B7280',display:'block',marginBottom:5,fontWeight:500}}>{label}</label>
                <input type={type} value={val} onChange={e=>setter(e.target.value)} required
                  placeholder={type==='email'?'you@example.com':'••••••••'}
                  style={{width:'100%',padding:'9px 12px',fontSize:14,border:'1px solid #E5E7EB',borderRadius:8,outline:'none',boxSizing:'border-box'}} />
              </div>
            ))}
            <div style={{textAlign:'right',marginBottom:18}}>
              <Link href="/forgot-password" style={{fontSize:13,color:'#185FA5',textDecoration:'none'}}>Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} style={{width:'100%',padding:'11px',background:'#185FA5',color:'#fff',border:'none',borderRadius:8,fontSize:15,fontWeight:500,cursor:'pointer',opacity:loading?0.6:1}}>
              {loading?'Signing in...':'Sign in'}
            </button>
          </form>
          <p style={{textAlign:'center',fontSize:13,color:'#6B7280',marginTop:18}}>
            No account?{' '}<Link href="/register" style={{color:'#185FA5',fontWeight:600,textDecoration:'none'}}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
