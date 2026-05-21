import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{borderTop:'1px solid #E5E7EB',background:'#fff',padding:'40px 16px 24px'}}>
      <div style={{maxWidth:1000,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:32,marginBottom:32}}>
          <div>
            <div style={{fontSize:22,fontWeight:700,color:'#185FA5',marginBottom:8}}>Talent<span style={{color:'#9CA3AF',fontWeight:400}}>AI</span></div>
            <p style={{fontSize:13,color:'#6B7280',lineHeight:1.7,maxWidth:220}}>AI-powered job matching for seekers and employers. Built with Next.js and Google Gemini AI.</p>
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:'#111827',marginBottom:12}}>For Job Seekers</div>
            {[['Find Jobs','/jobs'],['AI Insights','/insights'],['Sign Up','/register']].map(([l,h])=>(
              <div key={l} style={{marginBottom:8}}><Link href={h} style={{fontSize:13,color:'#6B7280',textDecoration:'none'}}>{l}</Link></div>
            ))}
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:'#111827',marginBottom:12}}>For Employers</div>
            {[['Post a Job','/employer'],['Find Candidates','/employer'],['Dashboard','/dashboard/employer']].map(([l,h])=>(
              <div key={l} style={{marginBottom:8}}><Link href={h} style={{fontSize:13,color:'#6B7280',textDecoration:'none'}}>{l}</Link></div>
            ))}
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:'#111827',marginBottom:12}}>Account</div>
            {[['Sign in','/login'],['Register','/register'],['Forgot Password','/forgot-password']].map(([l,h])=>(
              <div key={l} style={{marginBottom:8}}><Link href={h} style={{fontSize:13,color:'#6B7280',textDecoration:'none'}}>{l}</Link></div>
            ))}
          </div>
        </div>
        <div style={{borderTop:'1px solid #E5E7EB',paddingTop:20,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
          <p style={{fontSize:12,color:'#9CA3AF'}}>© {new Date().getFullYear()} TalentAI. Built with Next.js 14 + Google Gemini AI.</p>
          <div style={{display:'flex',gap:16}}>
            <span style={{fontSize:12,color:'#9CA3AF'}}>🛡️ Privacy First</span>
            <span style={{fontSize:12,color:'#9CA3AF'}}>⚡ AI-Powered</span>
            <span style={{fontSize:12,color:'#9CA3AF'}}>🇮🇳 Made for India</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
