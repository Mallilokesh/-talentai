'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function VerifyContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading'|'success'|'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = params.get('token')
    const email = params.get('email')
    if (!token || !email) { setStatus('error'); setMessage('Invalid verification link.'); return }
    fetch('/api/auth/verify-email', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('talentai_user', JSON.stringify({ ...data.user, token: data.token }))
          setStatus('success')
          setTimeout(() => router.push(data.user.role === 'employer' ? '/dashboard/employer' : '/dashboard/seeker'), 2500)
        } else { setStatus('error'); setMessage(data.error || 'Verification failed.') }
      })
      .catch(() => { setStatus('error'); setMessage('Network error. Please try again.') })
  }, [params, router])

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#EFF6FF,#F9FAFB)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{background:'#fff',borderRadius:20,padding:48,maxWidth:440,width:'100%',textAlign:'center',boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
        {status === 'loading' && (<><div style={{fontSize:48,marginBottom:16}}>⏳</div><h2 style={{color:'#111827',marginBottom:8}}>Verifying your email...</h2><p style={{color:'#6B7280',fontSize:14}}>Please wait a moment.</p></>)}
        {status === 'success' && (<><div style={{fontSize:48,marginBottom:16}}>✅</div><h2 style={{color:'#166534',marginBottom:8}}>Email verified!</h2><p style={{color:'#6B7280',fontSize:14}}>Redirecting to your dashboard...</p></>)}
        {status === 'error' && (<><div style={{fontSize:48,marginBottom:16}}>❌</div><h2 style={{color:'#DC2626',marginBottom:8}}>Verification failed</h2><p style={{color:'#6B7280',fontSize:14,marginBottom:24}}>{message}</p><Link href="/login" style={{background:'#185FA5',color:'#fff',padding:'11px 28px',borderRadius:8,textDecoration:'none',fontSize:14,fontWeight:600}}>Back to login</Link></>)}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <p style={{color:'#6B7280'}}>Loading...</p>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
