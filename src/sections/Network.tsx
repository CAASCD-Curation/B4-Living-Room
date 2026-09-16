import { useMemo, useState } from 'react'
import { WORKS, CAT_META, BAND_META, type Work } from '../data/works'
import { useGo } from '../App'

const X0 = 1427, X1 = 2005
const INK_D = '#26211a', DIM_D = '#837766', PANEL_D = '#fbf7ec', LINE_D = 'rgba(38,33,26,0.15)'
const LANES: { key: keyof typeof CAT_META; y: number }[] = [
  { key: 'A', y: 80 }, { key: 'B', y: 165 }, { key: 'C', y: 250 }, { key: 'D', y: 335 },
]
function seeded(s: string) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 9973; return (h % 100) / 100 }
const xOf = (year: number) => 40 + ((year - X0) / (X1 - X0)) * 920

export default function Network() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [timeLimit, setTimeLimit] = useState(X1)

  // 节点坐标（按年份 + 泳道 + 稳定抖动）
  const pos = useMemo(() => {
    const m: Record<string, { x: number; y: number }> = {}
    for (const w of WORKS) {
      const lane = LANES.find(l => l.key === w.cat)!
      m[w.id] = { x: xOf(w.year), y: lane.y + (seeded(w.id) - 0.5) * 44 }
    }
    return m
  }, [])

  const selected = WORKS.find(w => w.id === selectedId) || null
  const partners = useMemo(() => {
    if (!selected) return []
    return WORKS.filter(w => w.id !== selected.id && w.tags.some(t => selected.tags.includes(t)))
  }, [selected])
  const partnerIds = new Set(partners.map(p => p.id))
  const tagNodes = selectedTag ? WORKS.filter(w => w.tags.includes(selectedTag)) : []

  return (
    <div className="space-y-6">
      <div>
        <p className="kicker">CHAPTER 07 · 多元 — NETWORK / 六百年时空网络（落地首选）</p>
        <h1 className="display">时空网络</h1>
        <div className="hairline" />
        <p className="hint">逻辑链：时间轴 → 点击节点 → 标签伙伴连成「六百年对话路径」→ 点击伙伴跳转 → 或跳到 CH.02 情绪带</p>
      </div>

      {/* 时间滑块 */}
      <div className="flex items-center gap-3 text-xs" style={{ color: DIM_D, fontFamily: 'var(--mono)', letterSpacing: '0.14em' }}>
        <span className="shrink-0">{X0}</span>
        <input type="range" min={X0} max={X1} value={timeLimit} onChange={e => setTimeLimit(+e.target.value)}
          className="flex-1" style={{ accentColor: '#b3760f' }} />
        <span className="shrink-0">{timeLimit}</span>
        <span className="shrink-0">{timeLimit < X1 ? '· 之后的节点已暗下去' : '· 拖动让未来暗下去'}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* ── 网络画布 ── */}
        <div className="lg:col-span-2 rounded-xl border overflow-hidden dark-panel">
          <svg viewBox="0 0 1000 400" className="w-full">
            {/* 泳道 */}
            {LANES.map(l => (
              <g key={l.key}>
                <rect x="0" y={l.y - 34} width="1000" height="68" fill={CAT_META[l.key].color} opacity="0.09" />
                <text x="12" y={l.y + 3} fontSize="11" fill={CAT_META[l.key].color} fontWeight="700">{CAT_META[l.key].name}</text>
                <text x="12" y={l.y + 16} fontSize="8" fill={DIM_D}>{CAT_META[l.key].desc}</text>
              </g>
            ))}
            {/* 时间轴刻度 */}
            {[1500, 1600, 1700, 1800, 1900, 2000].map(y => (
              <g key={y}>
                <line x1={xOf(y)} y1="30" x2={xOf(y)} y2="385" stroke={LINE_D} strokeWidth="0.6" strokeDasharray="2 3" />
                <text x={xOf(y)} y="395" fontSize="9" textAnchor="middle" fill={DIM_D}>{y}</text>
              </g>
            ))}
            {/* 当前时间线 */}
            <line x1={xOf(timeLimit)} y1="30" x2={xOf(timeLimit)} y2="385" stroke="#b3760f" strokeWidth="1.2" opacity="0.7" />

            {/* 选中节点的伙伴连线 */}
            {selected && partners.map(p => {
              const a = pos[selected.id], b = pos[p.id]
              const mx = (a.x + b.x) / 2, my = Math.min(a.y, b.y) - 45
              return <path key={p.id} d={`M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`} fill="none"
                stroke={CAT_META[p.cat].color} strokeWidth="1" opacity="0.6" className="edge-anim" />
            })}
            {/* 标签高亮连线 */}
            {selectedTag && tagNodes.slice(0, 12).map(p => {
              if (p.id === selectedId) return null
              const a = pos[selectedId ?? tagNodes[0].id], b = pos[p.id]
              const mx = (a.x + b.x) / 2, my = Math.min(a.y, b.y) - 35
              return <path key={p.id} d={`M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`} fill="none"
                stroke={INK_D} strokeWidth="0.7" opacity="0.3" />
            })}

            {/* 节点 */}
            {WORKS.map(w => {
              const p = pos[w.id]
              const dim = w.year > timeLimit
              const isSel = w.id === selectedId
              const isPartner = partnerIds.has(w.id)
              const isTagNode = selectedTag ? w.tags.includes(selectedTag) : false
              return (
                <g key={w.id} className="cursor-pointer" opacity={dim ? 0.12 : 1}
                  onClick={() => { setSelectedId(w.id); setSelectedTag(null) }}>
                  {isPartner && <circle cx={p.x} cy={p.y} r="13" fill="none" stroke={CAT_META[w.cat].color} strokeWidth="1" strokeDasharray="2 2" className="spin-slow" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />}
                  <circle cx={p.x} cy={p.y} r={w.img ? 9 : 6.5}
                    fill={isSel ? '#b3760f' : CAT_META[w.cat].color}
                    stroke={isTagNode ? INK_D : PANEL_D} strokeWidth={isTagNode ? 2 : 1.2} />
                  {isSel && <circle cx={p.x} cy={p.y} r="15" fill="none" stroke="#b3760f" strokeWidth="0.8" opacity="0.6" />}
                  <text x={p.x} y={p.y - (w.img ? 14 : 11)} fontSize="7.5" textAnchor="middle"
                    fill={isSel || isPartner ? INK_D : DIM_D} fontWeight={isSel || isPartner ? 700 : 400}>
                    {w.name.length > 8 ? w.name.slice(0, 8) + '…' : w.name}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* ── 详情面板 ── */}
        <div className="rounded-xl border p-5 dark-panel">
          {selectedTag && !selected ? (
            <TagPanel tag={selectedTag} nodes={tagNodes} onPick={id => { setSelectedId(id); setSelectedTag(null) }} onClose={() => setSelectedTag(null)} />
          ) : selected ? (
            <NodePanel w={selected} partners={partners} onPick={id => setSelectedId(id)}
              onTag={t => { setSelectedTag(t); setSelectedId(null) }} />
          ) : (
            <div className="text-sm leading-7 h-full flex flex-col justify-center" style={{ color: DIM_D }}>
              <p className="kicker" style={{ marginBottom: '0.5rem' }}>HOW TO READ</p>
              <p className="text-2xl font-bold mb-3" style={{ color: INK_D }}>六百年时空网络</p>
              <ol className="list-decimal list-inside space-y-2 text-[13px]">
                <li>横轴 = 时间（1427–2005），四条泳道 = 艺术 / 文学 / 当代 / 负边界</li>
                <li>点击任意节点 → 右侧打开详情</li>
                <li>共享标签的跨时代「伙伴」被点亮并以弧线相连</li>
                <li>点击伙伴 = 网络内跳转；点击标签 = 全体亮灯</li>
                <li>也可从详情页跳到「CH.02」查看它所属的情绪带</li>
              </ol>
              <p className="mt-5 hint">先点一颗星试试——比如 1956 年的汉密尔顿，或 1879 年娜拉的客厅。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Chip({ children, onClick, title }: { children: React.ReactNode; onClick?: () => void; title?: string }) {
  return (
    <button onClick={onClick} title={title}
      className="text-[11px] px-2 py-1 rounded-full border transition-colors duration-300 hover:border-[#b3760f] hover:text-[#b3760f]"
      style={{ borderColor: LINE_D, color: INK_D, background: 'none' }}>
      {children}
    </button>
  )
}

function NodePanel({ w, partners, onPick, onTag }: {
  w: Work; partners: Work[]; onPick: (id: string) => void; onTag: (t: string) => void
}) {
  const go = useGo()
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] px-2 py-0.5 rounded text-white" style={{ background: CAT_META[w.cat].color }}>{CAT_META[w.cat].name}</span>
        <span className="text-xs" style={{ color: DIM_D, fontFamily: 'var(--mono)' }}>{w.yearLabel}</span>
        {w.band && (
          <button onClick={() => go('/demo2')} className="text-[10px] px-2 py-0.5 rounded border transition-colors duration-300 hover:border-[#b3760f]"
            style={{ borderColor: BAND_META[w.band].color, color: BAND_META[w.band].color, background: 'none' }}>
            CH.02 · {BAND_META[w.band].name} →
          </button>
        )}
      </div>
      <h3 className="text-xl font-bold leading-6">{w.name}</h3>
      <p className="text-xs" style={{ color: DIM_D }}>{w.source}</p>
      {w.img && <img src={w.img} alt={w.name} className="w-full h-40 object-cover rounded-lg border" style={{ borderColor: LINE_D }} />}
      <p className="text-[13px] leading-6">{w.desc}</p>
      <div>
        <p className="text-[10px] tracking-widest mb-1.5" style={{ color: DIM_D, fontFamily: 'var(--mono)' }}>共享标签 · 点击 = 全体亮灯</p>
        <div className="flex flex-wrap gap-1.5">
          {w.tags.map(t => <Chip key={t} onClick={() => onTag(t)}># {t}</Chip>)}
        </div>
      </div>
      <p className="text-[11px]" style={{ color: DIM_D }}>情绪：{w.emotions.join(' · ')}</p>
      <div>
        <p className="text-[10px] tracking-widest mb-1.5" style={{ color: DIM_D, fontFamily: 'var(--mono)' }}>标签伙伴 · 六百年对话路径 · 点击跳转</p>
        {partners.length === 0
          ? <p className="text-xs" style={{ color: DIM_D }}>这是一座孤岛——暂时没有共享标签的伙伴。</p>
          : <div className="space-y-1 max-h-44 overflow-auto pr-1">
              {partners.map(p => (
                <button key={p.id} onClick={() => onPick(p.id)}
                  className="w-full text-left text-xs px-2.5 py-1.5 rounded border transition-colors duration-300 hover:border-[#b3760f]"
                  style={{ borderColor: LINE_D, background: 'none', color: INK_D }}>
                  <span className="w-2 h-2 rounded-full inline-block mr-2 shrink-0" style={{ background: CAT_META[p.cat].color }} />
                  <span className="font-bold">{p.name}</span>
                  <span className="opacity-60 ml-2">{p.yearLabel} · {p.tags.filter(t => w.tags.includes(t)).map(t => '#' + t).join(' ')}</span>
                </button>
              ))}
            </div>}
      </div>
    </div>
  )
}

function TagPanel({ tag, nodes, onPick, onClose }: {
  tag: string; nodes: Work[]; onPick: (id: string) => void; onClose: () => void
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold" style={{ color: '#b3760f' }}># {tag}</p>
        <button onClick={onClose} className="hud-btn">✕</button>
      </div>
      <p className="text-xs" style={{ color: DIM_D }}>共享「{tag}」标签的 {nodes.length} 个客厅——点击任意一个跳转：</p>
      <div className="space-y-1.5 max-h-96 overflow-auto pr-1">
        {nodes.map(n => (
          <button key={n.id} onClick={() => onPick(n.id)}
            className="w-full text-left text-xs px-3 py-2 rounded border transition-colors duration-300 hover:border-[#b3760f]"
            style={{ borderColor: LINE_D, background: 'none', color: INK_D }}>
            <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: CAT_META[n.cat].color }} />
            <span className="font-bold">{n.name}</span>
            <span className="ml-2 opacity-60">{n.yearLabel}</span>
            <p className="mt-1 opacity-50 truncate">{n.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
