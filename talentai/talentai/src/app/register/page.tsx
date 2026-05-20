'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'

export default function RegisterPage() {
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'', role:'seeker', company:'' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => setForm(f=>({...f,[k]:e.target.value}))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setSuccess('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (form.role === 'employer' && !form.company) { setError('Company name is required for employers'); return }
    setLoading(true)
    try {
      const data = await register({ name:form.name, email:form.email, password:form.password, role:form.role, company:form.company })
      setSuccess(data.message || 'Account created! Check your email to verify.')
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const inp = {width:'100%',padding:'9px 12px',fontSize:14,border:'1px solid #E5E7EB',borderRadius:8,outline:'none',boxSizing:'border-box' as const}
  const lbl = {fontSize:12,color:'#6B7280',display:'block' as const,marginBottom:5,fontWeight:500 as const}

  return (
    <div style={{minHeight:'100vh',background:'#F3F4F6',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{width:'100%',maxWidth:460}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:30,fontWeight:600,color:'#185FA5'}}>Talent<span style={{color:'#9CA3AF',fontWeight:400}}>AI</span></div>
          <p style={{color:'#6B7280',marginTop:6,fontSize:14}}>Create your free account</p>
        </div>
        <div style={{background:'#fff',borderRadius:16,padding:28,boxShadow:'0 2px 8px rgba(0,0,0,0.07)',border:'1px solid #E5E7EB'}}>
          <h2 style={{fontSize:20,fontWeight:600,marginBottom:20,color:'#111827'}}>Get started</h2>
          {error && <div style={{background:'#FEF2F2',border:'1px solid #FCA5A5',color:'#DC2626',borderRadius:8,padding:'10px 14px',fontSize:13,marginBottom:16}}>{error}</div>}
          {success && (
            <div style={{background:'#F0FDF4',border:'1px solid #86EFAC',color:'#166534',borderRadius:8,padding:'14px',fontSize:13,marginBottom:16,textAlign:'center'}}>
              <div style={{fontSize:24,marginBottom:6}}>📧</div>
              <strong>Check your email!</strong><br/>{success}
            </div>
          )}
          {!success && (
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom:14}}><label style={lbl}>Full name</label><input style={inp} value={form.name} onChange={set('name')} placeholder="Arjun Sharma" required /></div>
              <div style={{marginBottom:14}}><label style={lbl}>Email address</label><input style={inp} type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required /></div>
              <div style={{marginBottom:14}}>
                <label style={lbl}>I am a</label>
                <select style={inp} value={form.role} onChange={set('role')}>
                  <option value="seeker">Job Seeker</option>
                  <option value="employer">Employer / Recruiter</option>
                </select>
              </div>
              {form.role === 'employer' && (
                <div style={{marginBottom:14}}><label style={lbl}>Company name</label><input style={inp} value={form.company} onChange={set('company')} placeholder="e.g. Infosys" required /></div>
              )}
              <div style={{marginBottom:14}}><label style={lbl}>Password</label><input style={inp} type="password" value={form.password} onChange={set('password')} placeholder="Min. 6 characters" required /></div>
              <div style={{marginBottom:20}}><label style={lbl}>Confirm password</label><input style={inp} type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" required /></div>
              <button type="submit" disabled={loading} style={{width:'100%',padding:'11px',background:'#185FA5',color:'#fff',border:'none',borderRadius:8,fontSize:15,fontWeight:500,cursor:'pointer',opacity:loading?0.6:1}}>
                {loading?'Creating account...':'Create account'}
              </button>
            </form>
          )}
          <p style={{textAlign:'center',fontSize:13,color:'#6B7280',marginTop:18}}>
            Have an account?{' '}<Link href="/login" style={{color:'#185FA5',fontWeight:600,textDecoration:'none'}}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
