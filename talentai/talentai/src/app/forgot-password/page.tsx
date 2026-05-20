'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) setSuccess(data.message)
      else setError(data.error)
    } catch { setError('Network error. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{minHeight:'100vh',background:'#F3F4F6',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{width:'100%',maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:30,fontWeight:600,color:'#185FA5'}}>Talent<span style={{color:'#9CA3AF',fontWeight:400}}>AI</span></div>
        </div>
        <div style={{background:'#fff',borderRadius:16,padding:28,boxShadow:'0 2px 8px rgba(0,0,0,0.07)',border:'1px solid #E5E7EB'}}>
          <h2 style={{fontSize:20,fontWeight:600,marginBottom:8,color:'#111827'}}>Forgot password?</h2>
          <p style={{fontSize:14,color:'#6B7280',marginBottom:20}}>Enter your email and we&apos;ll send a reset link.</p>
          {error && <div style={{background:'#FEF2F2',border:'1px solid #FCA5A5',color:'#DC2626',borderRadius:8,padding:'10px 14px',fontSize:13,marginBottom:16}}>{error}</div>}
          {success ? (
            <div style={{background:'#F0FDF4',border:'1px solid #86EFAC',color:'#166534',borderRadius:8,padding:16,textAlign:'center'}}>
              <div style={{fontSize:28,marginBottom:8}}>📧</div>
              <strong>Reset link sent!</strong><br/>
              <span style={{fontSize:13}}>{success}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom:16}}>
                <label style={{fontSize:12,color:'#6B7280',display:'block',marginBottom:5,fontWeight:500}}>Email address</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                  placeholder="you@example.com"
                  style={{width:'100%',padding:'9px 12px',fontSize:14,border:'1px solid #E5E7EB',borderRadius:8,outline:'none',boxSizing:'border-box'}} />
              </div>
              <button type="submit" disabled={loading} style={{width:'100%',padding:'11px',background:'#185FA5',color:'#fff',border:'none',borderRadius:8,fontSize:15,fontWeight:500,cursor:'pointer',opacity:loading?0.6:1}}>
                {loading?'Sending...':'Send reset link'}
              </button>
            </form>
          )}
          <p style={{textAlign:'center',fontSize:13,color:'#6B7280',marginTop:16}}>
            <Link href="/login" style={{color:'#185FA5',fontWeight:500,textDecoration:'none'}}>← Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
