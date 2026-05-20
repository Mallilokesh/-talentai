$content = @'
'use client'
import { Suspense } from 'react'
import { useEffect, useState } from 'react'
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
    }).then(r => r.json()).then(data => {
      if (data.success) {
        localStorage.setItem('talentai_user', JSON.stringify({ ...data.user, token: data.token }))
        setStatus('success')
        setTimeout(() => router.push(data.user.role === 'employer' ? '/dashboard/employer' : '/dashboard/seeker'), 2000)
      } else { setStatus('error'); setMessage(data.error || 'Verification failed.') }
    }).catch(() => { setStatus('error'); setMessage('Network error.') })
  }, [])

  return (
    <div style={{minHeight:'100vh',background:'#F3F4F6',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',borderRadius:16,padding:40,maxWidth:420,width:'100%',textAlign:'center',boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
        {status==='loading' && <><div style={{fontSize:40,marginBottom:16}}>⏳</div><h2>Verifying your email...</h2></>}
        {status==='success' && <><div style={{fontSize:40,marginBottom:16}}>✅</div><h2 style={{color:'#166534',marginBottom:8}}>Email verified!</h2><p style={{color:'#6B7280',fontSize:14}}>Redirecting to your dashboard...</p></>}
        {status==='error' && <><div style={{fontSize:40,marginBottom:16}}>❌</div><h2 style={{color:'#DC2626',marginBottom:8}}>Verification failed</h2><p style={{color:'#6B7280',fontSize:14,marginBottom:20}}>{message}</p><Link href="/login" style={{background:'#185FA5',color:'#fff',padding:'10px 24px',borderRadius:8,textDecoration:'none',fontSize:14}}>Back to login</Link></>}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return <Suspense fallback={<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading...</div>}><VerifyContent /></Suspense>
}
'@
Set-Content -Path "src\app\verify-email\page.tsx" -Value $content