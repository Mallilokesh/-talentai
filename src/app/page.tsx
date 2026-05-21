import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const stats = [['48,200+','Active job listings'],['12,500+','Companies hiring'],['94%','AI match accuracy'],['2.4M+','Registered users']]
const categories = [['💻','Engineering','18,400'],['📊','Finance','6,200'],['🏥','Healthcare','9,100'],['🎨','Design','4,300'],['📣','Marketing','5,600'],['🏗️','Operations','7,800']]
const features = [
  ['🤖','AI Job Matching','Scores every job against your profile with up to 98% accuracy using skill, experience, and culture-fit analysis.'],
  ['⚡','Instant Shortlisting','Employers get AI-ranked candidates in seconds — no manual screening needed.'],
  ['📊','Market Intelligence','Real-time insights on salary benchmarks, trending skills, and hiring patterns across India.'],
  ['🔒','Privacy First','Your data is never sold. Control exactly who sees your profile at all times.'],
]
const testimonials = [
  {name:'Priya Nair',role:'Software Engineer · Hired at Razorpay',text:'TalentAI matched me with my dream job in 3 days. The AI recommendations were spot-on!',avatar:'PN'},
  {name:'Rahul Mehta',role:'HR Lead · Infosys',text:'We cut our hiring time by 60%. The AI candidate shortlisting is incredibly accurate.',avatar:'RM'},
  {name:'Sneha Iyer',role:'Product Manager · Swiggy',text:'Finally a job portal that actually understands what I\'m looking for. Highly recommend!',avatar:'SI'},
]

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section style={{background:'linear-gradient(135deg,#185FA5 0%,#0C447C 100%)',padding:'72px 16px',textAlign:'center'}}>
          <div style={{maxWidth:700,margin:'0 auto'}}>
            <div style={{display:'inline-block',background:'rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.9)',fontSize:12,fontWeight:600,padding:'4px 14px',borderRadius:20,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:20}}>AI-Powered Job Matching</div>
            <h1 style={{fontSize:42,fontWeight:700,color:'#fff',lineHeight:1.2,marginBottom:16}}>Find your perfect career match — <span style={{color:'#93C5FD'}}>intelligently</span></h1>
            <p style={{fontSize:17,color:'rgba(255,255,255,0.8)',lineHeight:1.7,marginBottom:32,maxWidth:560,margin:'0 auto 32px'}}>Our AI engine analyzes your skills, experience, and goals to recommend roles with pinpoint accuracy — for both job seekers and hiring teams.</p>
            <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
              <Link href="/jobs" style={{background:'#fff',color:'#185FA5',padding:'13px 28px',borderRadius:10,textDecoration:'none',fontWeight:600,fontSize:15}}>🔍 Find AI-matched jobs</Link>
              <Link href="/register" style={{background:'rgba(255,255,255,0.15)',color:'#fff',border:'1px solid rgba(255,255,255,0.3)',padding:'13px 28px',borderRadius:10,textDecoration:'none',fontWeight:600,fontSize:15}}>Get started free →</Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section style={{background:'#fff',borderBottom:'1px solid #E5E7EB',padding:'32px 16px'}}>
          <div style={{maxWidth:800,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:24,textAlign:'center'}}>
            {stats.map(([n,l])=>(
              <div key={l}><div style={{fontSize:26,fontWeight:700,color:'#185FA5'}}>{n}</div><div style={{fontSize:13,color:'#6B7280',marginTop:4}}>{l}</div></div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section style={{padding:'56px 16px',background:'#F9FAFB'}}>
          <div style={{maxWidth:860,margin:'0 auto'}}>
            <h2 style={{fontSize:26,fontWeight:700,textAlign:'center',marginBottom:8}}>Browse by category</h2>
            <p style={{color:'#6B7280',textAlign:'center',fontSize:14,marginBottom:32}}>AI-matched roles across every industry</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
              {categories.map(([ic,name,count])=>(
                <Link key={name} href={`/jobs?category=${name}`} style={{textDecoration:'none'}}>
                  <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:14,padding:'20px 16px',textAlign:'center',cursor:'pointer',transition:'all .15s'}}>
                    <div style={{fontSize:28,marginBottom:8}}>{ic}</div>
                    <div style={{fontSize:14,fontWeight:600,color:'#111827'}}>{name}</div>
                    <div style={{fontSize:12,color:'#9CA3AF',marginTop:4}}>{count} jobs</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={{padding:'56px 16px',background:'#fff'}}>
          <div style={{maxWidth:860,margin:'0 auto'}}>
            <h2 style={{fontSize:26,fontWeight:700,textAlign:'center',marginBottom:8}}>Why TalentAI?</h2>
            <p style={{color:'#6B7280',textAlign:'center',fontSize:14,marginBottom:36}}>Built different — with real AI at the core</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16}}>
              {features.map(([ic,title,desc])=>(
                <div key={title} style={{background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:14,padding:20,display:'flex',gap:14}}>
                  <div style={{fontSize:28,flexShrink:0}}>{ic}</div>
                  <div><div style={{fontWeight:600,fontSize:15,marginBottom:6}}>{title}</div><div style={{fontSize:13,color:'#6B7280',lineHeight:1.6}}>{desc}</div></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section style={{padding:'56px 16px',background:'#F9FAFB'}}>
          <div style={{maxWidth:860,margin:'0 auto'}}>
            <h2 style={{fontSize:26,fontWeight:700,textAlign:'center',marginBottom:8}}>Loved by professionals</h2>
            <p style={{color:'#6B7280',textAlign:'center',fontSize:14,marginBottom:32}}>Join thousands already hired through TalentAI</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
              {testimonials.map((t,i)=>(
                <div key={i} style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:14,padding:20}}>
                  <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:12}}>
                    <div style={{width:36,height:36,borderRadius:'50%',background:'#E6F1FB',color:'#0C447C',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:600}}>{t.avatar}</div>
                    <div><div style={{fontSize:13,fontWeight:600}}>{t.name}</div><div style={{fontSize:11,color:'#6B7280'}}>{t.role}</div></div>
                  </div>
                  <p style={{fontSize:13,color:'#374151',lineHeight:1.6,fontStyle:'italic'}}>"{t.text}"</p>
                  <div style={{color:'#F59E0B',fontSize:14,marginTop:8}}>★★★★★</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{background:'#185FA5',padding:'56px 16px',textAlign:'center'}}>
          <div style={{maxWidth:500,margin:'0 auto'}}>
            <div style={{fontSize:36,marginBottom:12}}>🚀</div>
            <h2 style={{fontSize:26,fontWeight:700,color:'#fff',marginBottom:12}}>Ready to find your next role?</h2>
            <p style={{color:'rgba(255,255,255,0.8)',fontSize:15,marginBottom:28}}>Join 2.4 million professionals using TalentAI to accelerate their careers.</p>
            <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
              <Link href="/register" style={{background:'#fff',color:'#185FA5',padding:'12px 28px',borderRadius:10,textDecoration:'none',fontWeight:600,fontSize:15}}>Get started free →</Link>
              <Link href="/login" style={{background:'transparent',color:'#fff',border:'1px solid rgba(255,255,255,0.4)',padding:'12px 28px',borderRadius:10,textDecoration:'none',fontWeight:500,fontSize:15}}>Sign in</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
