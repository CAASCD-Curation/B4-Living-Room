import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import * as THREE from "three";
import { FURNITURE_ITEMS, FURNITURE_LINKS, type FurnitureKey } from "./FurnitureIcons";

/* ================= 网格旷野 · 可探索的线稿客厅 =================
 * 全屏铺满的方格地面；家具等大、等距散布（参考 thisplaceofmine 首页）。
 * 交互：滚轮缩放 / 拖拽平移 / 双指捏合 / 悬停高亮 / 点击家具跳转对应分类。 */
const INK = 0x1b1712;
const CINNABAR = 0xc0432b;

const edgeMat = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.92 });
const hotMat = new THREE.LineBasicMaterial({ color: CINNABAR, transparent: true, opacity: 1 });

const PITCH = (55 * Math.PI) / 180; // 相机俯角：大到画面全是地面、没有空白
const SCALE = 1.5; // 家具放大倍数
const LINK_BY_KEY = new Map(FURNITURE_LINKS.map((l) => [l.key, l]));

/* 只留棱线 */
function lines(geo: THREE.BufferGeometry): THREE.LineSegments {
  return new THREE.LineSegments(new THREE.EdgesGeometry(geo, 20), edgeMat);
}

function box(w: number, h: number, d: number, x = 0, y = 0, z = 0, ry = 0) {
  const l = lines(new THREE.BoxGeometry(w, h, d));
  l.position.set(x, y, z);
  l.rotation.y = ry;
  return l;
}

function cyl(rt: number, rb: number, h: number, x = 0, y = 0, z = 0, seg = 14) {
  const l = lines(new THREE.CylinderGeometry(rt, rb, h, seg));
  l.position.set(x, y, z);
  return l;
}

function plane(w: number, h: number, x = 0, y = 0, z = 0, ry = 0) {
  const l = lines(new THREE.PlaneGeometry(w, h));
  l.position.set(x, y, z);
  l.rotation.y = ry;
  return l;
}

/* ================= 家具（线稿，等距散布） ================= */
function buildFurniture(): { root: THREE.Group; clickables: THREE.Group[] } {
  const root = new THREE.Group();
  const clickables: THREE.Group[] = [];

  const put = (key: FurnitureKey | null, g: THREE.Group, x: number, z: number, ry = 0) => {
    const wrap = new THREE.Group();
    wrap.add(g);
    wrap.scale.setScalar(SCALE);
    wrap.position.set(x, 0, z);
    wrap.rotation.y = ry;
    if (key) {
      wrap.name = key;
      clickables.push(wrap);
    }
    root.add(wrap);
  };

  // 三人沙发：座 + 背 + 扶手
  const sofa = new THREE.Group();
  sofa.add(box(3.4, 0.5, 1.3, 0, 0.35, 0));
  sofa.add(box(3.4, 0.9, 0.32, 0, 0.95, -0.5));
  sofa.add(box(0.32, 0.75, 1.3, -1.55, 0.62, 0));
  sofa.add(box(0.32, 0.75, 1.3, 1.55, 0.62, 0));
  put("sofa", sofa, -8.5, 6.5, Math.PI);

  // 茶几：桌面 + 四条腿
  const table = new THREE.Group();
  table.add(box(1.7, 0.08, 0.9, 0, 0.42, 0));
  table.add(box(0.08, 0.42, 0.08, -0.75, 0.21, -0.32));
  table.add(box(0.08, 0.42, 0.08, 0.75, 0.21, -0.32));
  table.add(box(0.08, 0.42, 0.08, -0.75, 0.21, 0.32));
  table.add(box(0.08, 0.42, 0.08, 0.75, 0.21, 0.32));
  put("table", table, -4, 1.5, 0.3);

  // 电视：机身 + 屏幕线
  const tv = new THREE.Group();
  tv.add(box(2.6, 1.5, 0.08, 0, 1.6, 0));
  tv.add(plane(2.35, 1.28, 0, 1.6, 0.06));
  put("tv", tv, 1.5, -6.5);

  // 落地灯：底座 + 灯杆 + 灯罩
  const lamp = new THREE.Group();
  lamp.add(cyl(0.22, 0.26, 0.05, 0, 0.03, 0));
  lamp.add(cyl(0.03, 0.03, 2.1, 0, 1.05, 0));
  lamp.add(cyl(0.42, 0.3, 0.55, 0, 2.35, 0));
  put("lamp", lamp, 8.5, -4);

  // 单人椅 + 边几
  const chair = new THREE.Group();
  chair.add(box(0.95, 0.42, 0.9, 0, 0.32, 0));
  chair.add(box(0.95, 0.8, 0.25, 0, 0.8, -0.33));
  chair.add(cyl(0.32, 0.32, 0.5, 1.4, 0.25, -0.8));
  put("chair", chair, 4.5, 3.5, -0.7);

  // 书架：外框 + 两层隔板 + 三本书
  const shelf = new THREE.Group();
  shelf.add(box(0.35, 3.2, 1.6, 0, 1.6, 0));
  shelf.add(box(0.4, 0.05, 1.5, 0, 1.15, 0));
  shelf.add(box(0.4, 0.05, 1.5, 0, 2.1, 0));
  shelf.add(box(0.22, 0.46, 0.1, 0, 1.43, -0.4));
  shelf.add(box(0.22, 0.38, 0.1, 0, 1.39, -0.1));
  shelf.add(box(0.22, 0.52, 0.1, 0, 2.39, 0.3));
  put("shelf", shelf, -10, -6.5, Math.PI / 2);

  // 落地窗：只有玻璃轮廓
  const win = new THREE.Group();
  win.add(plane(2.4, 2.2, 0, 1.16, 0));
  put("window", win, 10.5, 4.5, -0.5);

  // 绿植：盆 + 一颗多面体（不可点击）
  const plant = new THREE.Group();
  plant.add(cyl(0.22, 0.16, 0.4, 0, 0.2, 0));
  const leaves = lines(new THREE.IcosahedronGeometry(0.55, 0));
  leaves.position.set(0, 1.0, 0);
  plant.add(leaves);
  put(null, plant, 0, 9);

  return { root, clickables };
}

/* ================= 组件 ================= */
export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [tip, setTip] = useState<{ x: number; y: number; label: string } | null>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, mount.clientWidth / mount.clientHeight, 0.1, 300);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";
    mount.appendChild(renderer.domElement);

    // 铺满的方格地面
    const grid = new THREE.GridHelper(240, 120, INK, INK);
    const gridMats = Array.isArray(grid.material) ? grid.material : [grid.material];
    gridMats.forEach((m) => {
      m.transparent = true;
      m.opacity = 0.15;
    });
    scene.add(grid);

    const { root, clickables } = buildFurniture();
    scene.add(root);

    /* ---- 相机：目标点 + 距离，俯角固定（画面无空白） ---- */
    const target = new THREE.Vector3(0, 0, 0.5);
    let distance = 26;
    const camDir = new THREE.Vector3(0, Math.sin(PITCH), Math.cos(PITCH));
    const updateCamera = () => {
      camera.position.set(
        target.x + camDir.x * distance,
        camDir.y * distance,
        target.z + camDir.z * distance
      );
      camera.lookAt(target.x, 0.8, target.z);
    };
    updateCamera();

    /* ---- 悬停 / 点击 ---- */
    const raycaster = new THREE.Raycaster();
    raycaster.params.Line.threshold = 0.5;
    const ndc = new THREE.Vector2();
    let hovered: THREE.Group | null = null;

    const setHot = (g: THREE.Group | null) => {
      if (hovered === g) return;
      hovered?.traverse((o) => {
        if (o instanceof THREE.LineSegments) o.material = edgeMat;
      });
      hovered = g;
      hovered?.traverse((o) => {
        if (o instanceof THREE.LineSegments) o.material = hotMat;
      });
      renderer.domElement.style.cursor = g ? "pointer" : "grab";
    };

    const pick = (e: PointerEvent): THREE.Group | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(clickables, true);
      if (!hits.length) return null;
      let o: THREE.Object3D | null = hits[0].object;
      while (o && !o.name) o = o.parent;
      return o ? (o as THREE.Group) : null;
    };

    const showTip = (e: PointerEvent, g: THREE.Group | null) => {
      if (!g) return setTip(null);
      const link = LINK_BY_KEY.get(g.name as FurnitureKey);
      const item = FURNITURE_ITEMS.find((f) => f.key === g.name);
      if (!link || !item) return setTip(null);
      const rect = renderer.domElement.getBoundingClientRect();
      setTip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        label: `${item.label} → ${link.tag}`,
      });
    };

    /* ---- 点击弹跳 ---- */
    const bounces: { g: THREE.Group; t0: number }[] = [];
    const bounce = (g: THREE.Group) => bounces.push({ g, t0: performance.now() });

    /* ---- 指针：拖拽平移 / 捏合缩放 / 点击 ---- */
    const pointers = new Map<number, { x: number; y: number }>();
    let downPos: { x: number; y: number } | null = null;
    let moved = 0;
    let pinchDist = 0;

    const panBy = (dx: number, dy: number) => {
      // 像素 → 地面单位（随距离线性缩放）
      const k = distance * 0.0016;
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0);
      right.y = 0;
      right.normalize();
      const fwd = new THREE.Vector3();
      camera.getWorldDirection(fwd);
      fwd.y = 0;
      fwd.normalize();
      target.addScaledVector(right, -dx * k);
      target.addScaledVector(fwd, dy * k);
      target.x = THREE.MathUtils.clamp(target.x, -45, 45);
      target.z = THREE.MathUtils.clamp(target.z, -45, 45);
      updateCamera();
    };

    const onPointerDown = (e: PointerEvent) => {
      renderer.domElement.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) {
        downPos = { x: e.clientX, y: e.clientY };
        moved = 0;
        renderer.domElement.style.cursor = "grabbing";
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
        downPos = null;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const prev = pointers.get(e.pointerId);
      if (prev) {
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pointers.size === 1 && downPos) {
          const dx = e.clientX - prev.x;
          const dy = e.clientY - prev.y;
          moved += Math.abs(dx) + Math.abs(dy);
          if (moved > 4) panBy(dx, dy);
        } else if (pointers.size === 2) {
          const [a, b] = [...pointers.values()];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (pinchDist > 0) {
            distance = THREE.MathUtils.clamp((distance * pinchDist) / d, 10, 55);
            updateCamera();
          }
          pinchDist = d;
        }
        return;
      }
      // 悬停
      const g = pick(e);
      setHot(g);
      showTip(e, g);
    };

    const onPointerUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size === 0) {
        renderer.domElement.style.cursor = hovered ? "pointer" : "grab";
        if (downPos && moved <= 4) {
          const g = pick(e);
          if (g) {
            bounce(g);
            const link = LINK_BY_KEY.get(g.name as FurnitureKey);
            if (link) {
              setTimeout(
                () => navigate(`/atlas?axis=${link.axis}&tag=${encodeURIComponent(link.tag)}`),
                260
              );
            }
          }
        }
        downPos = null;
      }
      pinchDist = 0;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      distance = THREE.MathUtils.clamp(distance * Math.exp(e.deltaY * 0.0011), 10, 55);
      updateCamera();
    };

    const el = renderer.domElement;
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    /* ---- 渲染循环：只负责点击弹跳 ---- */
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const now = performance.now();
      for (let i = bounces.length - 1; i >= 0; i--) {
        const b = bounces[i];
        const p = (now - b.t0) / 380;
        if (p >= 1) {
          b.g.scale.setScalar(SCALE);
          bounces.splice(i, 1);
        } else {
          b.g.scale.setScalar(SCALE * (1 + 0.16 * Math.sin(p * Math.PI)));
        }
      }
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
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.LineSegments) o.geometry.dispose();
      });
      renderer.dispose();
      mount.removeChild(el);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={mountRef} className="relative w-full h-full overflow-hidden">
      {tip && (
        <div
          className="absolute z-10 pointer-events-none bg-[var(--ink)]/90 text-[var(--paper)] font-mono-arc text-[10px] tracking-[0.2em] px-2 py-1 whitespace-nowrap"
          style={{ left: tip.x + 16, top: tip.y + 14 }}
        >
          {tip.label}
        </div>
      )}
    </div>
  );
}
