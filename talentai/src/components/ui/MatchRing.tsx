'use client'
interface Props { pct: number; size?: number }
export default function MatchRing({ pct, size = 48 }: Props) {
  const r = size * 0.31
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct / 100)
  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E5E7EB" strokeWidth="3" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#185FA5" strokeWidth="3"
          strokeDasharray={`${circ.toFixed(1)}`} strokeDashoffset={`${offset.toFixed(1)}`} strokeLinecap="round" />
      </svg>
      <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:size<44?9:11,fontWeight:500,color:'#185FA5' }}>{pct}%</div>
    </div>
  )
}
