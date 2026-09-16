import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { works } from "@/data/works";
import { CATEGORY_META, type Category, type Work } from "@/types/work";
import WorkModal from "@/components/WorkModal";

/* ================= 首页 · 沙发星环档案 =================
 * 移植自组员版首页：粉色沙发居中的可旋转资料圈。
 * 左栏分类检索 · 右栏年代滑块（与星环联动）· 滚轮切换年代 ·
 * 拖拽旋转 · 点击作品打开档案 · 围合/打开切换星环松紧。 */

const PINK = 0xcf6f7f;
const PINK_LIGHT = 0xe0a3ae;
const ERAS = 8;

const parseYear = (s: string | null): number => {
  if (!s) return 2020;
  const m = s.match(/\d{4}/);
  return m ? parseInt(m[0], 10) : 2020; // 「不详」归入当代
};

/* 确定性小随机 */
function hashRand(id: string, salt: number) {
  let h = salt;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffff;
  return (h % 1000) / 1000;
}

/* ---------- 粉色沙发（Three.js） ---------- */
function buildSofa(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: PINK, roughness: 0.95, metalness: 0 });
  const matLight = new THREE.MeshStandardMaterial({ color: PINK_LIGHT, roughness: 1, metalness: 0 });
  const matLeg = new THREE.MeshStandardMaterial({ color: 0x5a4034, roughness: 0.6 });

  const add = (geo: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    mesh.rotation.z = rz;
    g.add(mesh);
    return mesh;
  };

  add(new RoundedBoxGeometry(3.2, 0.55, 1.5, 4, 0.14), mat, 0, 0.62, 0); // 基座
  add(new RoundedBoxGeometry(0.6, 1.15, 1.6, 4, 0.28), mat, -1.55, 0.95, 0); // 左扶手
  add(new RoundedBoxGeometry(0.6, 1.15, 1.6, 4, 0.28), mat, 1.55, 0.95, 0); // 右扶手
  add(new RoundedBoxGeometry(3.2, 1.15, 0.55, 4, 0.24), mat, 0, 1.28, -0.62); // 靠背
  add(new RoundedBoxGeometry(1.32, 0.34, 1.25, 4, 0.15), matLight, -0.7, 1.05, 0.08); // 坐垫
  add(new RoundedBoxGeometry(1.32, 0.34, 1.25, 4, 0.15), matLight, 0.7, 1.05, 0.08);
  add(new RoundedBoxGeometry(0.5, 0.5, 0.5, 4, 0.2), matLight, -0.75, 1.6, -0.45); // 靠枕
  // 搭在右扶手上的毯子
  const blanket = add(new RoundedBoxGeometry(1.5, 0.07, 1.7, 3, 0.03), matLight, 1.35, 1.55, 0.1);
  blanket.rotation.z = -0.28;
  // 腿
  const legGeo = new THREE.CylinderGeometry(0.05, 0.04, 0.35, 8);
  add(legGeo, matLeg, -1.3, 0.18, 0.55);
  add(legGeo, matLeg, 1.3, 0.18, 0.55);
  add(legGeo, matLeg, -1.3, 0.18, -0.55);
  add(legGeo, matLeg, 1.3, 0.18, -0.55);
  return g;
}

function SofaCanvas({ angleRef }: { angleRef: MutableRefObject<number> }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, mount.clientWidth / mount.clientHeight, 0.1, 50);
    camera.position.set(0, 2.4, 6.4);
    camera.lookAt(0, 0.9, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(3, 6, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xfff0f0, 0.5);
    fill.position.set(-4, 3, -2);
    scene.add(fill);

    const sofa = buildSofa();
    scene.add(sofa);

    let raf = 0;
    let cur = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      cur += (angleRef.current - cur) * 0.08;
      sofa.rotation.y = cur * 1.4;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [angleRef]);

  return <div ref={mountRef} className="w-full h-full" />;
}

/* ---------- 主组件 ---------- */
export default function SofaStage({ onEnter }: { onEnter: () => void }) {
  const [cat, setCat] = useState<Category | "ALL">("ALL");
  const [era, setEra] = useState(ERAS - 1); // 默认最新年代
  const [open, setOpen] = useState(true);
  const [opened, setOpened] = useState<Work | null>(null);
  const angleRef = useRef(0.6);
  const lastMovedRef = useRef(0);
  const [, forceRender] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; moved: number } | null>(null);

  /* 按分类过滤 + 按年份排序 + 分桶为 ERAS 个年代 */
  const pool = useMemo(() => {
    const list = works
      .filter((w) => cat === "ALL" || w.cat === cat)
      .map((w) => ({ w, y: parseYear(w.year) }))
      .sort((a, b) => a.y - b.y);
    const buckets: { w: Work; y: number }[][] = Array.from({ length: ERAS }, () => []);
    list.forEach((item, i) => buckets[Math.min(ERAS - 1, Math.floor((i / list.length) * ERAS))].push(item));
    return buckets;
  }, [cat]);

  const eraWorks = pool[era] ?? [];
  const shown = eraWorks.slice(0, 8);
  const yearRange = eraWorks.length
    ? `${eraWorks[0].y}–${eraWorks[eraWorks.length - 1].y}`
    : "—";
  const minY = pool[0]?.[0]?.y ?? 0;
  const maxY = pool[ERAS - 1]?.[pool[ERAS - 1].length - 1]?.y ?? 0;

  /* 拖拽旋转（在整个舞台上） */
  useEffect(() => {
    const stage = stageRef.current!;
    const down = (e: PointerEvent) => {
      dragRef.current = { x: e.clientX, moved: 0 };
    };
    const move = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = e.clientX - d.x;
      d.x = e.clientX;
      d.moved += Math.abs(dx);
      if (d.moved > 4) {
        angleRef.current += dx * 0.006;
        forceRender((n) => n + 1);
      }
    };
    const up = () => {
      if (dragRef.current) lastMovedRef.current = dragRef.current.moved;
      dragRef.current = null;
    };
    stage.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      stage.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  /* 滚轮切换年代（页面本身不可滚动，无需拦截） */
  const onWheel = (e: React.WheelEvent) => {
    setEra((prev) => THREE.MathUtils.clamp(prev + (e.deltaY > 0 ? 1 : -1), 0, ERAS - 1));
  };

  /* 星环位置参数 */
  const a = open ? 36 : 22; // 横向半径 %
  const b = open ? 30 : 15; // 纵向半径 %

  return (
    <div className="absolute inset-0 overflow-hidden" onWheel={onWheel}>
      {/* 舞台（拖拽旋转区域） */}
      <div ref={stageRef} className="absolute inset-0 cursor-grab active:cursor-grabbing select-none">
        {/* 轨道虚线 */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-dashed border-[var(--ink)]/20 pointer-events-none transition-all duration-700"
          style={{ width: `${a * 2}%`, height: `${b * 2}%` }}
        />
        {/* 沙发 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%] w-[46vw] max-w-[560px] min-w-[300px] aspect-[4/3] pointer-events-none">
          <SofaCanvas angleRef={angleRef} />
        </div>
        {/* 沙发铭牌 */}
        <div className="absolute left-1/2 top-[62%] -translate-x-1/2 text-center pointer-events-none">
          <div className="font-mono-arc text-[9px] tracking-[0.3em] text-[var(--ink-soft)]">主体物 01</div>
          <div className="font-serif-sc font-black text-sm md:text-base tracking-widest mt-0.5">MAJOR TOM SOFA</div>
          <div className="text-[10px] text-[var(--ink-soft)] mt-0.5">客厅关系的临时中心</div>
        </div>

        {/* 星环档案卡 */}
        {shown.map(({ w }, i) => {
          const t = (i / shown.length) * Math.PI * 2 + angleRef.current;
          const x = 50 + Math.cos(t) * a;
          const y = 50 + Math.sin(t) * b;
          const front = (Math.sin(t) + 1) / 2; // 0 后 → 1 前
          const scale = 0.68 + front * 0.4;
          const rot = (hashRand(w.id, 11) - 0.5) * 10;
          return (
            <button
              key={w.id}
              className="orbit-card absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                zIndex: Math.round(front * 20) + 1,
                opacity: 0.4 + front * 0.6,
                filter: front < 0.35 ? `blur(${(0.35 - front) * 5}px)` : undefined,
                transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`,
              }}
              onClick={() => lastMovedRef.current <= 4 && setOpened(w)}
              aria-label={`查看 ${w.name}`}
            >
              {w.imgs.length > 0 ? (
                <img src={w.imgs[0]} alt="" draggable={false} />
              ) : (
                <span className="orbit-card-empty font-mono-arc">{w.id}</span>
              )}
              <em>{w.id}</em>
              <b>{w.name}</b>
            </button>
          );
        })}
      </div>

      {/* 左栏：分类检索（保留参考站形式） */}
      <nav className="absolute left-5 md:left-10 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4 md:gap-5" aria-label="档案分类">
        {(
          [
            { key: "ALL", zh: "全部档案", en: "ALL ROOMS" },
            ...(Object.keys(CATEGORY_META) as Category[]).map((c) => ({
              key: c as Category | "ALL",
              zh: CATEGORY_META[c].label,
              en: CATEGORY_META[c].en.toUpperCase(),
            })),
          ] as { key: Category | "ALL"; zh: string; en: string }[]
        ).map((c) => (
          <button
            key={c.key}
            onClick={() => {
              setCat(c.key);
              setEra(ERAS - 1);
            }}
            className={`text-left leading-tight transition-colors ${cat === c.key ? "text-[var(--ink)]" : "text-[var(--ink-soft)]/70 hover:text-[var(--ink)]"}`}
          >
            <span className={`block text-sm md:text-base font-serif-sc font-bold ${cat === c.key ? "underline decoration-[var(--cinnabar)] decoration-2 underline-offset-4" : ""}`}>
              {c.zh}
            </span>
            <small className="block font-mono-arc text-[8px] md:text-[9px] tracking-[0.25em] mt-0.5">{c.en}</small>
          </button>
        ))}
      </nav>

      {/* 右栏：年代滑块（与星环联动） */}
      <div className="absolute right-5 md:right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 h-[46vh]">
        <span className="year-vertical font-mono-arc text-[10px] tracking-[0.2em] text-[var(--cinnabar)]">{maxY || "—"}</span>
        <input
          type="range"
          min={0}
          max={ERAS - 1}
          step={1}
          value={era}
          onChange={(e) => setEra(Number(e.target.value))}
          className="era-slider flex-1"
          aria-label="年代"
        />
        <span className="year-vertical font-mono-arc text-[10px] tracking-[0.2em] text-[var(--ink-soft)]">{minY || "—"}</span>
        <span className="font-mono-arc text-[9px] tracking-[0.2em] text-[var(--ink-soft)] mt-1 [writing-mode:vertical-rl]">{yearRange}</span>
      </div>

      {/* 底栏 */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-5 md:px-10 pb-4">
        <div className="flex items-end justify-between text-xs">
          <div className="font-mono-arc text-[10px] tracking-widest text-[var(--ink-soft)]">
            档案索引 <span className="text-[var(--cinnabar)] font-bold">{works.length}</span> 条
          </div>
          <div className="hidden md:block font-mono-arc text-[10px] tracking-widest text-[var(--ink-soft)]">
            ↕ 滚轮切换年代 · 拖拽旋转 · 点击作品阅读
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => setOpen((o) => !o)}
              className="font-serif-sc font-bold text-sm hover:text-[var(--cinnabar)] transition-colors"
              title="ENCLOSE / OPEN"
            >
              {open ? "围合" : "打开"}
              <span className="block font-mono-arc text-[8px] tracking-[0.25em] font-normal text-[var(--ink-soft)] mt-0.5">
                {open ? "ENCLOSE" : "OPEN"}
              </span>
            </button>
            <button
              onClick={onEnter}
              className="flex items-center gap-2 font-medium text-[var(--ink-soft)] hover:text-[var(--cinnabar)] transition-colors"
            >
              进入楼层图志
              <span className="inline-block animate-pulse">↓</span>
            </button>
          </div>
        </div>
      </div>

      {opened && <WorkModal work={opened} onClose={() => setOpened(null)} />}
    </div>
  );
}
