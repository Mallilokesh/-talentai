'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/login')
  }, [user, loading])

  if (loading || !user) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading...</div>

  const stats = [['👥','Total Users','2,483'],['💼','Active Jobs','48,200'],['🏢','Employers','12,500'],['✅','Verified Today','142']]
  const recentUsers = [
    {name:'Rahul Mehta',email:'rahul@example.com',role:'seeker',status:'Active',joined:'Today'},
    {name:'TechCorp HR',email:'hr@techcorp.com',role:'employer',status:'Active',joined:'Today'},
    {name:'Sneha Iyer',email:'sneha@example.com',role:'seeker',status:'Pending',joined:'Yesterday'},
    {name:'Zepto Hiring',email:'jobs@zepto.com',role:'employer',status:'Active',joined:'May 18'},
    {name:'Karthik Rao',email:'karthik@example.com',role:'seeker',status:'Active',joined:'May 17'},
  ]

  return (
    <div style={{minHeight:'100vh',background:'#F3F4F6'}}>
      {/* Navbar */}
      <div style={{background:'#fff',borderBottom:'1px solid #E5E7EB',padding:'12px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontSize:20,fontWeight:600,color:'#185FA5'}}>Talent<span style={{color:'#9CA3AF',fontWeight:400}}>AI</span> <span style={{fontSize:13,background:'#FEF3C7',color:'#92400E',padding:'2px 8px',borderRadius:6,fontWeight:500,marginLeft:8}}>Admin</span></div>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <span style={{fontSize:14,color:'#374151'}}>👋 {user.name}</span>
          <button onClick={logout} style={{padding:'6px 14px',background:'#FEF2F2',color:'#DC2626',border:'1px solid #FECACA',borderRadius:8,fontSize:13,cursor:'pointer',fontWeight:500}}>Logout</button>
        </div>
      </div>
      <div style={{maxWidth:900,margin:'0 auto',padding:24}}>
        <h1 style={{fontSize:22,fontWeight:600,marginBottom:6}}>Admin Dashboard</h1>
        <p style={{color:'#6B7280',fontSize:14,marginBottom:24}}>Platform overview and user management</p>
        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:28}}>
          {stats.map(([icon,label,val])=>(
            <div key={label} style={{background:'#fff',borderRadius:12,padding:20,textAlign:'center',border:'1px solid #E5E7EB'}}>
              <div style={{fontSize:24,marginBottom:6}}>{icon}</div>
              <div style={{fontSize:22,fontWeight:700,color:'#185FA5'}}>{val}</div>
              <div style={{fontSize:12,color:'#6B7280',marginTop:2}}>{label}</div>
            </div>
          ))}
        </div>
        {/* Users table */}
        <div style={{background:'#fff',borderRadius:12,border:'1px solid #E5E7EB',overflow:'hidden'}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid #E5E7EB',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h2 style={{fontSize:16,fontWeight:600}}>Recent Users</h2>
            <span style={{fontSize:12,color:'#185FA5',fontWeight:500,cursor:'pointer'}}>View all →</span>
          </div>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr style={{background:'#F9FAFB'}}>
              {['Name','Email','Role','Status','Joined'].map(h=><th key={h} style={{padding:'10px 16px',textAlign:'left',fontSize:12,color:'#6B7280',fontWeight:600}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {recentUsers.map((u,i)=>(
                <tr key={i} style={{borderTop:'1px solid #F3F4F6'}}>
                  <td style={{padding:'12px 16px',fontSize:14,fontWeight:500}}>{u.name}</td>
                  <td style={{padding:'12px 16px',fontSize:13,color:'#6B7280'}}>{u.email}</td>
                  <td style={{padding:'12px 16px'}}><span style={{background:u.role==='employer'?'#EFF6FF':'#F0FDF4',color:u.role==='employer'?'#1D4ED8':'#166534',padding:'2px 8px',borderRadius:6,fontSize:12,fontWeight:500,textTransform:'capitalize'}}>{u.role}</span></td>
                  <td style={{padding:'12px 16px'}}><span style={{background:u.status==='Active'?'#F0FDF4':'#FFFBEB',color:u.status==='Active'?'#166534':'#92400E',padding:'2px 8px',borderRadius:6,fontSize:12,fontWeight:500}}>{u.status}</span></td>
                  <td style={{padding:'12px 16px',fontSize:13,color:'#6B7280'}}>{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
