import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { WORKS, EMOTION_WORDS, BAND_META } from '../data/works'
import { useGo } from '../App'

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

// ── CH.02 引入页（ref: podium.global）──
// 中央 3D 小房子缓慢自转，10 张展品图像环绕轨道飞行；
// 滚动驱动三幕文案：切片 → 环绕 → 三色带浮现，末尾进入三角大厅。
export default function Intro2() {
  const go = useGo()
  const wrapRef = useRef<HTMLDivElement>(null)
  const pRef = useRef(0)
  const [p, setP] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current
      if (!el) return
      const total = el.offsetHeight - window.innerHeight
      const v = total > 0 ? clamp01(window.scrollY / total) : 0
      pRef.current = v
      setP(v)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    // 测试钩子：?p=0.6 直接跳到某进度（无头截图用）
    const q = new URLSearchParams(window.location.search).get('p')
    if (q) requestAnimationFrame(() => {
      const el = wrapRef.current
      if (!el) return
      window.scrollTo(0, (el.offsetHeight - window.innerHeight) * parseFloat(q))
      onScroll()
    })
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [])

  const o1 = 1 - smooth(0.32, 0.48, p)
  const o2 = smooth(0.44, 0.58, p) * (1 - smooth(0.74, 0.88, p))
  const o3 = smooth(0.78, 0.92, p)
  const bandWords = (b: 'blue' | 'gold' | 'gray') => EMOTION_WORDS.filter(w => w.band === b).length

  return (
    <div ref={wrapRef} className="intro2-wrap">
      <div className="intro2-stage">
        <House3D pRef={pRef} />
        <OrbitImages pRef={pRef} />

        {/* 第一幕：切片 */}
        <div className="intro2-copy" style={{ opacity: o1, visibility: o1 < 0.02 ? 'hidden' : 'visible' }}>
          <p className="kicker">CHAPTER 02 · INTRO — 引入</p>
          <h1 className="display">一件展品，<br />就是客厅的一片切片。</h1>
          <p className="hint mt-4">向下滚动 · 让六百年的客厅环绕这间小房子旋转</p>
        </div>
        {/* 第二幕：环绕 */}
        <div className="intro2-copy" style={{ opacity: o2, visibility: o2 < 0.02 ? 'hidden' : 'visible' }}>
          <p className="kicker">ORBIT — 环绕</p>
          <h1 className="display">当图像开始环绕，<br />客厅从背景变成了主体。</h1>
          <p className="hint mt-4">小房子 = 客厅的最小单元；环绕它的，是同一语料库中的 {WORKS.length} 个客厅切片</p>
        </div>
        {/* 第三幕：三色带浮现 */}
        <div className="intro2-copy" style={{ opacity: o3, visibility: o3 < 0.02 ? 'hidden' : 'visible' }}>
          <p className="kicker">THREE BANDS — 三色带</p>
          <h1 className="display">三种情绪，<br />即将浮现。</h1>
          <div className="flex gap-5 mt-5 flex-wrap">
            {(['blue', 'gold', 'gray'] as const).map(b => (
              <span key={b} className="text-sm font-bold" style={{ color: BAND_META[b].color }}>
                ● {BAND_META[b].name} · {bandWords(b)} 词
              </span>
            ))}
          </div>
          <button className="hud-btn mt-6" onClick={() => go('/demo2')}>进入三角大厅 →</button>
        </div>

        {/* 跳过 + 进度 */}
        <button className="intro2-skip hud-btn" onClick={() => go('/demo2')}>跳过引入 →</button>
        <div className="intro2-progress">
          <span>{String(Math.round(p * 100)).padStart(3, '0')}</span>
          <div className="intro2-pbar"><div style={{ height: `${p * 100}%` }} /></div>
          <span>SCROLL</span>
        </div>
        {p < 0.04 && <div className="intro2-scrollhint">↓</div>}
      </div>
    </div>
  )
}

// ── 中央 3D 小房子（three.js）──
function House3D({ pRef }: { pRef: React.MutableRefObject<number> }) {
  const mountRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let W = mount.clientWidth, H = mount.clientHeight
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 100)
    camera.position.set(0, 1.5, 6.4)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 0.85))
    const key = new THREE.DirectionalLight(0xfff2dd, 1.1)
    key.position.set(3, 5, 4)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xdfe8ff, 0.35)
    fill.position.set(-3, 2, -2)
    scene.add(fill)

    const house = new THREE.Group()
    const matWall = new THREE.MeshStandardMaterial({ color: 0xf8f2e2, roughness: 0.95 })
    const matRoof = new THREE.MeshStandardMaterial({ color: 0xd9973f, roughness: 0.75 })
    const matDark = new THREE.MeshStandardMaterial({ color: 0x5a4a36, roughness: 0.9 })
    const matWin = new THREE.MeshStandardMaterial({ color: 0x3d5a99, roughness: 0.4, emissive: 0x1b2a4d, emissiveIntensity: 0.6 })

    const walls = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.3, 1.6), matWall)
    walls.position.y = 0.65
    house.add(walls)
    // 线稿勾边（呼应站内的线条插画风）
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(walls.geometry),
      new THREE.LineBasicMaterial({ color: 0x26211a, transparent: true, opacity: 0.35 }))
    edges.position.copy(walls.position)
    house.add(edges)

    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.62, 0.95, 4), matRoof)
    roof.rotation.y = Math.PI / 4
    roof.position.y = 1.775
    house.add(roof)
    const roofEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(roof.geometry),
      new THREE.LineBasicMaterial({ color: 0x26211a, transparent: true, opacity: 0.3 }))
    roofEdges.rotation.copy(roof.rotation)
    roofEdges.position.copy(roof.position)
    house.add(roofEdges)

    const door = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.72, 0.06), matDark)
    door.position.set(0, 0.36, 0.81)
    house.add(door)
    const winL = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, 0.06), matWin)
    winL.position.set(-0.62, 0.82, 0.81)
    house.add(winL)
    const winR = winL.clone()
    winR.position.x = 0.62
    house.add(winR)
    const winSide = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.36, 0.36), matWin)
    winSide.position.set(1.01, 0.82, 0)
    house.add(winSide)
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.55, 0.24),
      new THREE.MeshStandardMaterial({ color: 0xb9ad97, roughness: 0.9 }))
    chimney.position.set(0.55, 1.95, -0.35)
    house.add(chimney)

    // 地面软阴影
    const sc = document.createElement('canvas')
    sc.width = sc.height = 128
    const g = sc.getContext('2d')
    if (g) {
      const grad = g.createRadialGradient(64, 64, 6, 64, 64, 62)
      grad.addColorStop(0, 'rgba(38,33,26,0.35)')
      grad.addColorStop(1, 'rgba(38,33,26,0)')
      g.fillStyle = grad
      g.fillRect(0, 0, 128, 128)
    }
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 4.6),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }))
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = 0.01
    scene.add(shadow)
    scene.add(house)

    let raf = 0
    const loop = () => {
      const p = pRef.current
      house.rotation.y += 0.0045 + p * 0.012
      const s = 1 - 0.32 * smooth(0.45, 1, p)
      house.scale.setScalar(s)
      house.position.y = 0.15 * smooth(0.45, 1, p)
      shadow.scale.setScalar(s)
      camera.position.y = 1.5 + 0.5 * smooth(0.3, 1, p)
      camera.lookAt(0, 0.85, 0)
      renderer.render(scene, camera)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onResize = () => {
      W = mount.clientWidth
      H = mount.clientHeight
      camera.aspect = W / H
      camera.updateProjectionMatrix()
      renderer.setSize(W, H)
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement)
    }
  }, [])
  return <div ref={mountRef} className="intro2-house" aria-hidden />
}

// ── 环绕飞行的展品图像（伪 3D 轨道，资料库 /works/*.jpg）──
function OrbitImages({ pRef }: { pRef: React.MutableRefObject<number> }) {
  const imgs = useMemo(() => WORKS.filter(w => w.img).slice(0, 10), [])
  const refs = useRef<(HTMLDivElement | null)[]>([])
  useEffect(() => {
    let raf = 0
    const tick = (t: number) => {
      const p = pRef.current
      const vw = window.innerWidth, vh = window.innerHeight
      const cx = vw / 2, cy = vh * 0.5
      const R = Math.min(vw, vh) * (0.30 + 0.13 * easeOut(p))
      const spread = 0.5 + 0.5 * easeOut(clamp01(p * 2.4))
      imgs.forEach((_w, i) => {
        const el = refs.current[i]
        if (!el) return
        const a = (i / imgs.length) * Math.PI * 2 + t * 0.00018
        const depth = Math.sin(a) // -1 深处(房后) → 1 近处(房前)
        const x = cx + Math.cos(a) * R * spread
        const y = cy + depth * R * 0.30 * spread + Math.sin(t * 0.0011 + i * 1.7) * 7
        const s = (0.5 + 0.5 * (depth + 1) / 2) * (0.7 + 0.3 * spread)
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${Math.cos(a) * 7}deg) scale(${s})`
        el.style.opacity = String(clamp01((0.28 + 0.72 * (depth + 1) / 2) * spread))
        el.style.zIndex = depth > 0.15 ? '30' : '15'
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [imgs])
  return (
    <>
      {imgs.map((w, i) => (
        <div key={w.id} ref={el => { refs.current[i] = el }} className="orbit-img" title={`${w.name} · ${w.yearLabel}`}>
          <img src={w.img} alt={w.name} draggable={false} />
        </div>
      ))}
    </>
  )
}
