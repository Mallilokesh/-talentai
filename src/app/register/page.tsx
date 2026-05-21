'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'

export default function RegisterPage() {
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'', role:'seeker', company:'' })
  const [error, setError] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setResult(null)
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (form.role === 'employer' && !form.company) { setError('Company name is required'); return }
    setLoading(true)
    try {
      const data = await register({ name:form.name, email:form.email, password:form.password, role:form.role, company:form.company })
      setResult(data)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const inp = { width:'100%', padding:'9px 12px', fontSize:14, border:'1px solid #E5E7EB', borderRadius:8, outline:'none', boxSizing:'border-box' as const }
  const lbl = { fontSize:12, color:'#6B7280', display:'block' as const, marginBottom:5, fontWeight:500 as const }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#EFF6FF,#F9FAFB)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{width:'100%',maxWidth:460}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <Link href="/" style={{textDecoration:'none'}}>
            <div style={{fontSize:30,fontWeight:700,color:'#185FA5'}}>Talent<span style={{color:'#9CA3AF',fontWeight:400}}>AI</span></div>
          </Link>
          <p style={{color:'#6B7280',marginTop:6,fontSize:14}}>Create your free account</p>
        </div>

        <div style={{background:'#fff',borderRadius:20,padding:28,boxShadow:'0 4px 20px rgba(0,0,0,0.08)',border:'1px solid #E5E7EB'}}>
          {result ? (
            <div style={{textAlign:'center',padding:'8px 0'}}>
              <div style={{fontSize:48,marginBottom:12}}>🎉</div>
              <h2 style={{color:'#111827',marginBottom:8,fontSize:20}}>Account created!</h2>
              <p style={{color:'#4B5563',fontSize:14,lineHeight:1.6,marginBottom:20}}>{result.message}</p>

              {result.devMode && result.devVerifyUrl && (
                <div style={{background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:12,padding:16,marginBottom:16,textAlign:'left'}}>
                  <p style={{fontSize:12,fontWeight:600,color:'#92400E',marginBottom:8}}>⚠️ Dev Mode — No email configured</p>
                  <p style={{fontSize:12,color:'#78350F',marginBottom:10}}>Click the button below to verify your account instantly (this link would normally be sent to your email):</p>
                  <Link href={result.devVerifyUrl} style={{display:'block',background:'#185FA5',color:'#fff',padding:'10px 16px',borderRadius:8,textDecoration:'none',fontSize:13,fontWeight:600,textAlign:'center'}}>
                    ✅ Click here to verify your account
                  </Link>
                </div>
              )}

              {result.emailSent && (
                <div style={{background:'#F0FDF4',border:'1px solid #86EFAC',borderRadius:12,padding:16,marginBottom:16}}>
                  <p style={{fontSize:13,color:'#166534'}}>📧 Verification email sent to <strong>{form.email}</strong></p>
                </div>
              )}

              <Link href="/login" style={{display:'inline-block',background:'#185FA5',color:'#fff',padding:'10px 28px',borderRadius:8,textDecoration:'none',fontSize:14,fontWeight:600}}>
                Sign in →
              </Link>
            </div>
          ) : (
            <>
              <h2 style={{fontSize:20,fontWeight:600,marginBottom:20,color:'#111827'}}>Get started free</h2>
              {error && <div style={{background:'#FEF2F2',border:'1px solid #FCA5A5',color:'#DC2626',borderRadius:8,padding:'10px 14px',fontSize:13,marginBottom:16}}>{error}</div>}
              <form onSubmit={handleSubmit}>
                <div style={{marginBottom:14}}><label style={lbl}>Full name</label><input style={inp} value={form.name} onChange={set('name')} placeholder="Arjun Sharma" required /></div>
                <div style={{marginBottom:14}}><label style={lbl}>Email address</label><input style={inp} type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required /></div>
                <div style={{marginBottom:14}}>
                  <label style={lbl}>I am a</label>
                  <select style={inp} value={form.role} onChange={set('role')}>
                    <option value="seeker">🔍 Job Seeker</option>
                    <option value="employer">🏢 Employer / Recruiter</option>
                  </select>
                </div>
                {form.role === 'employer' && (
                  <div style={{marginBottom:14}}><label style={lbl}>Company name</label><input style={inp} value={form.company} onChange={set('company')} placeholder="e.g. Infosys" required /></div>
                )}
                <div style={{marginBottom:14}}><label style={lbl}>Password</label><input style={inp} type="password" value={form.password} onChange={set('password')} placeholder="Min. 6 characters" required /></div>
                <div style={{marginBottom:20}}><label style={lbl}>Confirm password</label><input style={inp} type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" required /></div>
                <button type="submit" disabled={loading} style={{width:'100%',padding:'12px',background:'#185FA5',color:'#fff',border:'none',borderRadius:8,fontSize:15,fontWeight:600,cursor:'pointer',opacity:loading?0.6:1}}>
                  {loading ? 'Creating account...' : 'Create account →'}
                </button>
              </form>
            </>
          )}
          <p style={{textAlign:'center',fontSize:13,color:'#6B7280',marginTop:18}}>
            Have an account? <Link href="/login" style={{color:'#185FA5',fontWeight:600,textDecoration:'none'}}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
