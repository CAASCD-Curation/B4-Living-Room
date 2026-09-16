import { useCallback, useContext, useEffect, useRef, useState, createContext } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import Home from './sections/Home'
import Triangle from './sections/Triangle'
import Network from './sections/Network'
import Intro2 from './sections/Intro2'

// ── 页面转场（三面板交错上滑，参考 makemepulse 2019 的章节切换）──
const GoCtx = createContext<(path: string) => void>(() => {})
export const useGo = () => useContext(GoCtx)

function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(false)
  const go = useCallback((path: string) => {
    if (on) return
    setOn(true) // 面板盖下
    setTimeout(() => {
      window.location.hash = '#' + path
      setTimeout(() => setOn(false), 120) // 目的地就绪后抬升
    }, 680)
  }, [on])
  return (
    <GoCtx.Provider value={go}>
      {children}
      <div className={`wipe ${on ? 'wipe-on' : 'wipe-off'}`} aria-hidden>
        <div className="wipe-p" /><div className="wipe-p" /><div className="wipe-p" />
      </div>
    </GoCtx.Provider>
  )
}

// ── 加载页：大数字百分比 + 细进度线 ──
function Preloader() {
  const [n, setN] = useState(0)
  const [gone, setGone] = useState(false)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("nosplash")) { setN(100); setGone(true); return }
    const t0 = performance.now(), D = 1500
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / D)
      setN(Math.round(100 * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setTimeout(() => setGone(true), 300)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  if (gone) return null
  return (
    <div className={`preloader ${n >= 100 ? 'preloader-exit' : ''}`}>
      <p className="pre-kicker">LIVING ROOM · 结构方案 DEMO</p>
      <p className="pre-num">{String(n).padStart(3, '0')}</p>
      <div className="pre-bar"><div style={{ width: `${n}%` }} /></div>
      <p className="pre-foot">1427 — 2005 · SIX HUNDRED YEARS OF LIVING ROOMS</p>
    </div>
  )
}

// ── 自定义光标：细环，悬停可交互元素时放大 ──
function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    let x = -100, y = -100, cx = -100, cy = -100, big = false, raf = 0
    const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY }
    const over = (e: MouseEvent) => {
      big = !!(e.target as HTMLElement).closest?.('a,button,.cursor-pointer,[data-hover]')
      el.classList.toggle('cursor-big', big)
    }
    const loop = () => {
      cx += (x - cx) * 0.22; cy += (y - cy) * 0.22
      el.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%) scale(${big ? 1.8 : 1})`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); cancelAnimationFrame(raf) }
  }, [])
  return <div ref={ref} className="cursor-ring" aria-hidden />
}

export default function App() {
  return (
    <TransitionProvider>
      <Shell />
    </TransitionProvider>
  )
}

function Shell() {
  const go = useGo()
  const { pathname } = useLocation()
  return (
    <div className="site">
      <Preloader />
      <Cursor />
      <div className="grain" aria-hidden />
      <header className="hud-header">
        <button className="hud-brand" onClick={() => go('/')}>LIVING·ROOM — 结构方案 DEMO</button>
        <nav className="hud-nav">
          <button onClick={() => go('/')}>INDEX 首页</button>
          <button onClick={() => go('/demo2')}>CH.02 情绪三色带</button>
          <button onClick={() => go('/demo7')}>CH.07 时空网络</button>
        </nav>
      </header>
      <main className={pathname === '/intro2' ? 'hud-main hud-main-full' : 'hud-main'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/intro2" element={<Intro2 />} />
          <Route path="/demo2" element={<Triangle />} />
          <Route path="/demo7" element={<Network />} />
        </Routes>
      </main>
      <footer className="hud-footer">
        <span>Nº1–22 + 200 ENTRIES</span>
        <span>7 STRUCTURES / ONE LIVING ROOM</span>
        <span>1427 — 2005</span>
      </footer>
    </div>
  )
}
