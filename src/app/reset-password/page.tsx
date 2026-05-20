'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const params = useSearchParams()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: params.get('email'), token: params.get('token'), password }),
      })
      const data = await res.json()
      if (data.success) { setSuccess(true); setTimeout(()=>router.push('/login'), 2500) }
      else setError(data.error)
    } catch { setError('Network error.') }
    finally { setLoading(false) }
  }

  const inp = {width:'100%',padding:'9px 12px',fontSize:14,border:'1px solid #E5E7EB',borderRadius:8,outline:'none',boxSizing:'border-box' as const}

  return (
    <div style={{minHeight:'100vh',background:'#F3F4F6',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{width:'100%',maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:30,fontWeight:600,color:'#185FA5'}}>Talent<span style={{color:'#9CA3AF',fontWeight:400}}>AI</span></div>
        </div>
        <div style={{background:'#fff',borderRadius:16,padding:28,boxShadow:'0 2px 8px rgba(0,0,0,0.07)',border:'1px solid #E5E7EB'}}>
          {success ? (
            <div style={{textAlign:'center',padding:'16px 0'}}>
              <div style={{fontSize:40,marginBottom:12}}>✅</div>
              <h2 style={{color:'#166534',marginBottom:8}}>Password updated!</h2>
              <p style={{color:'#6B7280',fontSize:14}}>Redirecting to login...</p>
            </div>
          ) : (
            <>
              <h2 style={{fontSize:20,fontWeight:600,marginBottom:8,color:'#111827'}}>Set new password</h2>
              <p style={{fontSize:14,color:'#6B7280',marginBottom:20}}>Choose a strong password for your account.</p>
              {error && <div style={{background:'#FEF2F2',border:'1px solid #FCA5A5',color:'#DC2626',borderRadius:8,padding:'10px 14px',fontSize:13,marginBottom:16}}>{error}</div>}
              <form onSubmit={handleSubmit}>
                <div style={{marginBottom:14}}><label style={{fontSize:12,color:'#6B7280',display:'block',marginBottom:5,fontWeight:500}}>New password</label><input type="password" style={inp} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min. 6 characters" required /></div>
                <div style={{marginBottom:20}}><label style={{fontSize:12,color:'#6B7280',display:'block',marginBottom:5,fontWeight:500}}>Confirm password</label><input type="password" style={inp} value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repeat password" required /></div>
                <button type="submit" disabled={loading} style={{width:'100%',padding:'11px',background:'#185FA5',color:'#fff',border:'none',borderRadius:8,fontSize:15,fontWeight:500,cursor:'pointer',opacity:loading?0.6:1}}>
                  {loading?'Updating...':'Update password'}
                </button>
              </form>
            </>
          )}
          <p style={{textAlign:'center',fontSize:13,color:'#6B7280',marginTop:16}}>
            <Link href="/login" style={{color:'#185FA5',fontWeight:500,textDecoration:'none'}}>← Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
