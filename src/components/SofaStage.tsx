import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { works } from "@/data/works";
import type { Work } from "@/types/work";
import WorkModal from "@/components/WorkModal";
import FurnitureRail from "@/components/FurnitureRail";

/* ================= 首页 · 沙发星环档案 =================
 * 中间为 Major Tom Sofa 原始 FBX 建模（Maison Dada），
 * 档案卡沿椭圆轨道环绕；左侧家具图标分类栏；右侧年代滑块联动；
 * 滚轮切换年代，滑到最新后继续下滚 → 进入楼层图志。 */

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

/* ---------- Major Tom Sofa 原建模（FBX） ---------- */
function SofaCanvas({ angleRef }: { angleRef: MutableRefObject<number> }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, mount.clientWidth / mount.clientHeight, 0.1, 50);
    camera.position.set(0, 2.6, 7.2);
    camera.lookAt(0, 1.0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(3, 6, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xfff2f2, 0.6);
    fill.position.set(-4, 3, -3);
    scene.add(fill);

    const group = new THREE.Group();
    scene.add(group);

    /* FBX 内嵌的作者机器贴图路径会 404，统一重定向到我们的贴图 */
    const manager = new THREE.LoadingManager();
    manager.setURLModifier((url) =>
      /\.(jpe?g|png|tga|tif)$/i.test(url) ? "/sofa/major-tom-sofa-textile-01.jpg" : url
    );
    const texLoader = new THREE.TextureLoader();
    const bodyTex = texLoader.load("/sofa/major-tom-sofa-textile-01.jpg");
    bodyTex.colorSpace = THREE.SRGBColorSpace;
    bodyTex.wrapS = bodyTex.wrapT = THREE.RepeatWrapping;
    const throwTex = texLoader.load("/sofa/major-tom-sofa-throw-textile.jpg");
    throwTex.colorSpace = THREE.SRGBColorSpace;

    new FBXLoader(manager).load("/sofa/sofa.fbx", (fbx) => {
      const box = new THREE.Box3().setFromObject(fbx);
      const size = box.getSize(new THREE.Vector3());
      const s = 4.4 / Math.max(size.x, size.z);
      fbx.scale.setScalar(s);
      const box2 = new THREE.Box3().setFromObject(fbx);
      const c = box2.getCenter(new THREE.Vector3());
      fbx.position.set(-c.x, -box2.min.y, -c.z);
      // 毯子网格换搭毯贴图；其余统一用主体布料贴图（FBX 内多为纯色材质，无贴图引用）
      fbx.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          const mapped = mats.map((m) => {
            const nm = `${m?.name ?? ""} ${o.name ?? ""}`.toLowerCase();
            const out = new THREE.MeshStandardMaterial({
              map: nm.includes("throw") || nm.includes("blanket") ? throwTex : bodyTex,
              color: 0xffffff,
              roughness: 0.95,
              metalness: 0,
            });
            out.map!.colorSpace = THREE.SRGBColorSpace;
            return out;
          });
          o.material = Array.isArray(o.material) ? mapped : mapped[0];
        }
      });
      group.add(fbx);
    });

    let raf = 0;
    let cur = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      cur += (angleRef.current - cur) * 0.08;
      group.rotation.y = cur * 1.4;
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
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
            m.map?.dispose();
            m.dispose();
          });
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
  const [era, setEra] = useState(ERAS - 1); // 默认最新年代
  const [open, setOpen] = useState(true);
  const [opened, setOpened] = useState<Work | null>(null);
  const angleRef = useRef(0.6);
  const lastMovedRef = useRef(0);
  const [, forceRender] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; moved: number } | null>(null);
  const limitAcc = useRef(0); // 滑到最新年代后继续下滚的累计量
  const enteredRef = useRef(false);

  /* 按年份排序 + 分桶为 ERAS 个年代（分类检索走左侧图标栏跳转 Atlas） */
  const pool = useMemo(() => {
    const list = works
      .map((w) => ({ w, y: parseYear(w.year) }))
      .sort((a, b) => a.y - b.y);
    const buckets: { w: Work; y: number }[][] = Array.from({ length: ERAS }, () => []);
    list.forEach((item, i) => buckets[Math.min(ERAS - 1, Math.floor((i / list.length) * ERAS))].push(item));
    return buckets;
  }, []);

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

  /* 滚轮切换年代；滑到最新年代后继续下滚 → 进入楼层图志 */
  const onWheel = (e: React.WheelEvent) => {
    if (enteredRef.current) return;
    setEra((prev) => {
      const next = THREE.MathUtils.clamp(prev + (e.deltaY > 0 ? 1 : -1), 0, ERAS - 1);
      if (next === ERAS - 1 && prev === ERAS - 1 && e.deltaY > 0) {
        limitAcc.current += e.deltaY;
        if (limitAcc.current > 260) {
          enteredRef.current = true;
          onEnter();
        }
      } else if (next < ERAS - 1) {
        limitAcc.current = 0;
      }
      return next;
    });
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

      {/* 左栏：家具图标分类检索 */}
      <FurnitureRail />

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
            ↕ 滚轮切换年代 · 滑到最新再往下入楼层 · 拖拽旋转
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
