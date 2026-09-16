import { useMemo, useState } from 'react'
import { WORKS, EMOTION_WORDS, BAND_META, type Work } from '../data/works'

type BandKey = 'blue' | 'gold' | 'gray'
type View = { mode: 'hall' } | { mode: 'band'; band: BandKey }

// 三角形顶点（viewBox 100x100）
const V = { blue: { x: 50, y: 9 }, gold: { x: 91, y: 86 }, gray: { x: 9, y: 86 } }

function seeded(i: number) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }

export default function Triangle() {
  const [view, setView] = useState<View>({ mode: 'hall' })
  const [flipped, setFlipped] = useState<string | null>(null)

  if (view.mode === 'band') return <BandView band={view.band} flipped={flipped} setFlipped={setFlipped} go={setView} />
  return <Hall go={setView} />
}

// ── 三角大厅（几何线条版）──
function Hall({ go }: { go: (v: View) => void }) {
  // 32 个情绪词在三角内漂移（重心采样，稳定）
  const words = useMemo(() => EMOTION_WORDS.map((w, i) => {
    let r1 = seeded(i), r2 = seeded(i + 77)
    if (r1 + r2 > 1) { r1 = 1 - r1; r2 = 1 - r2 }
    const x = V.blue.x + r1 * (V.gold.x - V.blue.x) + r2 * (V.gray.x - V.blue.x)
    const y = V.blue.y + r1 * (V.gold.y - V.blue.y) + r2 * (V.gray.y - V.blue.y)
    return { ...w, x, y, dur: 6 + seeded(i + 9) * 6, delay: -seeded(i + 33) * 8 }
  }), [])
  const counts = (b: BandKey) => WORKS.filter(w => w.band === b).length

  return (
    <div className="space-y-6">
      <div>
        <p className="kicker">CHAPTER 02 · 一分为三 — TRIANGLE / 情绪语法三色带</p>
        <h1 className="display">情绪三色带</h1>
        <div className="hairline" />
        <p className="hint">逻辑链：三角大厅 → 点击顶点进入情绪带 → 沿边滑动揭开伪装层</p>
      </div>
      <svg viewBox="0 0 100 100" className="w-full max-w-3xl mx-auto">
        <polygon points={`${V.blue.x},${V.blue.y} ${V.gold.x},${V.gold.y} ${V.gray.x},${V.gray.y}`}
          fill="rgba(38,33,26,0.035)" stroke="rgba(38,33,26,0.22)" strokeWidth="0.4" />
        {/* 三条边：点击 → 伪装层（灰带） */}
        {([['blue', 'gold'], ['gold', 'gray'], ['gray', 'blue']] as const).map(([a, b], i) => (
          <line key={i} x1={V[a].x} y1={V[a].y} x2={V[b].x} y2={V[b].y}
            stroke="#6b6b6b" strokeWidth="2.6" strokeOpacity="0.001" className="cursor-pointer"
            onClick={() => go({ mode: 'band', band: 'gray' })}>
            <title>沿边滑动 → 揭开伪装层</title>
          </line>
        ))}
        {/* 漂移的情绪词 */}
        {words.map((w, i) => (
          <text key={i} x={w.x} y={w.y} textAnchor="middle" fontSize="2.6"
            fill={BAND_META[w.band].color} opacity="0.85" className="drift-word"
            style={{ animationDuration: `${w.dur}s`, animationDelay: `${w.delay}s` }}>
            {w.word}
          </text>
        ))}
        {/* 三个顶点 */}
        {(['blue', 'gold', 'gray'] as BandKey[]).map(k => (
          <g key={k} className="cursor-pointer" onClick={() => go({ mode: 'band', band: k })}>
            <circle cx={V[k].x} cy={V[k].y} r="6.5" fill={BAND_META[k].color} />
            <circle cx={V[k].x} cy={V[k].y} r="8.5" fill="none" stroke={BAND_META[k].color} strokeWidth="0.4" strokeDasharray="1.5 1.2" className="spin-slow" style={{ transformOrigin: `${V[k].x}px ${V[k].y}px` }} />
            <text x={V[k].x} y={V[k].y - 10.5} textAnchor="middle" fontSize="3.4" fontWeight="700" fill={BAND_META[k].color}>
              {BAND_META[k].name}
            </text>
            <text x={V[k].x} y={V[k].y + 0.8} textAnchor="middle" fontSize="2.2" fill="#fff">{counts(k)} 件</text>
            <text x={V[k].x} y={V[k].y + 14} textAnchor="middle" fontSize="2" fill="#837766">点击进入 →</text>
          </g>
        ))}
      </svg>
      <p className="text-center hint">
        32 个情绪词在三角中漂移（正面 12 金 · 中性 7 灰 · 负面 13 蓝）· 点击任意一条边 = 沿边滑动，进入「伪装地带」
      </p>
    </div>
  )
}

// ── 情绪带视图 ──
function BandView({ band, flipped, setFlipped, go }: {
  band: BandKey; flipped: string | null; setFlipped: (id: string | null) => void; go: (v: View) => void
}) {
  const meta = BAND_META[band]
  const list = WORKS.filter(w => w.band === band)
  const others = (['blue', 'gold', 'gray'] as BandKey[]).filter(b => b !== band)
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => go({ mode: 'hall' })} className="hud-btn">← 返回三角大厅</button>
        <span className="kicker" style={{ marginBottom: 0 }}>CHAPTER 02 · 情绪三色带</span>
        {others.map(b => (
          <button key={b} onClick={() => { setFlipped(null); go({ mode: 'band', band: b }) }} className="hud-btn">
            跳转到 {BAND_META[b].name} →
          </button>
        ))}
      </div>

      <div className="p-6 rounded-xl border-l-4" style={{ borderColor: meta.color, background: meta.soft }}>
        <p className="text-[10px] tracking-[0.4em] mb-1" style={{ color: meta.color }}>{meta.en}</p>
        <h2 className="text-3xl font-bold mb-2">{meta.name}</h2>
        <p className="text-sm leading-7 max-w-3xl">{meta.desc}</p>
        {band === 'gray' && <p className="text-xs mt-2" style={{ color: '#8a8272' }}>💡 本带所有展品都带「伪装层」——点击卡片翻面，看表面判词如何崩塌。</p>}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map(w => <WorkCard key={w.id} w={w} flipped={flipped === w.id} onFlip={() => setFlipped(flipped === w.id ? null : w.id)} />)}
      </div>
    </div>
  )
}

function WorkCard({ w, flipped, onFlip }: { w: Work; flipped: boolean; onFlip: () => void }) {
  const hasMask = !!w.mask
  return (
    <div className={`flip-wrap h-72 cursor-pointer ${hasMask ? '' : 'cursor-default'}`} onClick={() => hasMask && onFlip()}>
      <div className={`flip-inner ${flipped ? 'flipped' : ''}`}>
        {/* 正面 */}
        <div className="flip-face rounded-xl overflow-hidden border flex flex-col" style={{ borderColor: '#d8cfbc', background: '#fffdf8' }}>
          {w.img
            ? <img src={w.img} alt={w.name} className="h-44 w-full object-cover" />
            : <div className="h-44 w-full flex items-center justify-center text-4xl font-black" style={{ background: '#efe8d8', color: '#c9bda2' }}>档案</div>}
          <div className="p-3 flex-1">
            <p className="font-bold text-sm leading-5">{w.name}</p>
            <p className="text-[11px] mt-0.5" style={{ color: '#9a8f7a' }}>{w.source}</p>
            <p className="text-[11px] mt-1 leading-4 line-clamp-2" style={{ color: '#6b6252' }}>
              {hasMask ? `表面：${w.mask!.surface}` : w.desc}
            </p>
            {hasMask && <p className="text-[10px] mt-1.5" style={{ color: '#6b6b6b' }}>🎭 点击揭开伪装层</p>}
          </div>
        </div>
        {/* 背面：伪装层 */}
        <div className="flip-face flip-back rounded-xl overflow-hidden border flex flex-col items-center justify-center p-5 text-center"
          style={{ borderColor: '#6b6b6b', background: '#3a3a38', color: '#e8e6e0' }}>
          <p className="text-[10px] tracking-[0.4em] mb-3" style={{ color: '#9a968c' }}>伪装层 · MASK OFF</p>
          {w.mask && (
            <>
              <p className="text-xs line-through opacity-50 mb-3">{w.mask.surface}</p>
              <p className="text-sm font-bold leading-6">{w.mask.hidden}</p>
            </>
          )}
          <p className="text-[10px] mt-4 opacity-60">点击翻回 →</p>
        </div>
      </div>
    </div>
  )
}
