'use client'
const COLORS = [
  {bg:'#E6F1FB',tc:'#0C447C'},{bg:'#EEEDFE',tc:'#3C3489'},
  {bg:'#EAF3DE',tc:'#3B6D11'},{bg:'#FAEEDA',tc:'#633806'},{bg:'#FAECE7',tc:'#712B13'},
]
interface Props { name: string; index?: number; size?: number; rounded?: 'full'|'lg' }
export default function Avatar({ name, index=0, size=36, rounded='full' }: Props) {
  const c = COLORS[index % COLORS.length]
  const initials = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  return (
    <div style={{ width:size,height:size,flexShrink:0,background:c.bg,color:c.tc,
      borderRadius:rounded==='full'?'50%':8,display:'flex',alignItems:'center',
      justifyContent:'center',fontSize:size<40?11:13,fontWeight:500 }}>{initials}</div>
  )
}
