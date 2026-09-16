import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { FurnitureKey } from "./FurnitureIcons";

/* ================= 纯线稿客厅 =================
 * 只保留墨线棱边、不加任何颜色填充；唯独地板保留一块浅纸面色，
 * 让空间有落点。家具做成「可点展品」：focusKey 命中时棱线染朱砂、
 * 相机短暂聚焦。 */
const INK = 0x1b1712;
const PAPER_DEEP = 0xe6ddcb;
const CINNABAR = 0xc0432b;

const edgeMat = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.92 });
const hotMat = new THREE.LineBasicMaterial({ color: CINNABAR, transparent: true, opacity: 1 });
const floorMat = new THREE.MeshBasicMaterial({ color: PAPER_DEEP });

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

function cyl(rt: number, rb: number, h: number, x = 0, y = 0, z = 0, seg = 18) {
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

function named(name: FurnitureKey, ...children: THREE.Object3D[]) {
  const g = new THREE.Group();
  g.name = name;
  children.forEach((c) => g.add(c));
  return g;
}

/* ================= 线稿客厅（家具全部为线框） ================= */
function buildLounge(parts: Partial<Record<FurnitureKey, THREE.Group>>) {
  const g = new THREE.Group();
  const W = 10, D = 8;

  // 地板（唯一保留颜色的面：浅纸色 + 墨线收边）
  const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(W, 0.12, D), floorMat);
  floorMesh.position.y = -0.06;
  g.add(floorMesh);
  g.add(box(W, 0.12, D, 0, -0.06, 0));

  // 空间骨架：半抽象的两面墙线 + 墙顶线，暗示空间而不封闭
  g.add(plane(W, 3.4, 0, 1.7, -D / 2));
  const leftWall = plane(D, 3.4, -W / 2, 1.7, 0, Math.PI / 2);
  g.add(leftWall);

  // 三人沙发
  const sofa = named(
    "sofa",
    box(3.4, 0.5, 1.3, 0, 0.35, 0), // 座
    box(3.4, 0.9, 0.32, 0, 0.95, -0.5), // 背
    box(0.32, 0.75, 1.3, -1.55, 0.62, 0), // 扶手
    box(0.32, 0.75, 1.3, 1.55, 0.62, 0),
    box(1.0, 0.22, 1.0, -0.75, 0.7, 0.05), // 靠垫
    box(1.0, 0.22, 1.0, 0.4, 0.7, 0.05),
    box(0.1, 0.25, 0.1, -1.5, 0.12, 0.5), // 腿
    box(0.1, 0.25, 0.1, 1.5, 0.12, 0.5),
    box(0.1, 0.25, 0.1, -1.5, 0.12, -0.5),
    box(0.1, 0.25, 0.1, 1.5, 0.12, -0.5)
  );
  sofa.position.set(-0.6, 0, 1.6);
  sofa.rotation.y = Math.PI;
  parts.sofa = sofa;
  g.add(sofa);

  // 茶几 + 茶杯
  const table = named(
    "table",
    box(1.7, 0.08, 0.9, 0, 0.42, 0),
    box(0.08, 0.42, 0.08, -0.75, 0.21, -0.32),
    box(0.08, 0.42, 0.08, 0.75, 0.21, -0.32),
    box(0.08, 0.42, 0.08, -0.75, 0.21, 0.32),
    box(0.08, 0.42, 0.08, 0.75, 0.21, 0.32),
    cyl(0.09, 0.07, 0.12, -0.35, 0.52, 0)
  );
  table.position.set(-0.6, 0, 0.2);
  parts.table = table;
  g.add(table);

  // 电视柜 + 电视（屏幕只是一道线框）
  const tv = named(
    "tv",
    box(3.0, 0.35, 0.45, 0, 0.18, 0),
    box(0.5, 0.5, 0.1, 0, 0.6, 0),
    box(2.6, 1.5, 0.08, 0, 1.6, 0),
    plane(2.35, 1.28, 0, 1.6, 0.06)
  );
  tv.position.set(-0.6, 0, -D / 2 + 0.35);
  parts.tv = tv;
  g.add(tv);

  // 落地灯
  const lamp = named(
    "lamp",
    cyl(0.22, 0.26, 0.05, 0, 0.03, 0),
    cyl(0.03, 0.03, 2.1, 0, 1.05, 0),
    cyl(0.42, 0.3, 0.55, 0, 2.35, 0)
  );
  lamp.position.set(2.6, 0, -2.6);
  parts.lamp = lamp;
  g.add(lamp);

  // 单人椅 + 边几
  const chair = named(
    "chair",
    box(0.95, 0.42, 0.9, 0, 0.32, 0),
    box(0.95, 0.8, 0.25, 0, 0.8, -0.33),
    box(0.08, 0.14, 0.08, -0.4, 0.07, 0.35),
    box(0.08, 0.14, 0.08, 0.4, 0.07, 0.35),
    cyl(0.32, 0.32, 0.5, 1.2, 0.25, -0.7)
  );
  chair.position.set(2.2, 0, 0.9);
  chair.rotation.y = -0.7;
  parts.chair = chair;
  g.add(chair);

  // 书架（书脊只剩竖线）
  const shelf = named(
    "shelf",
    box(0.35, 3.2, 1.6, 0, 1.6, 0),
    box(0.4, 0.05, 1.5, 0, 0.55, 0),
    box(0.4, 0.05, 1.5, 0, 1.3, 0),
    box(0.4, 0.05, 1.5, 0, 2.05, 0),
    box(0.4, 0.05, 1.5, 0, 2.8, 0),
    box(0.22, 0.42, 0.1, 0, 0.82, -0.5),
    box(0.22, 0.5, 0.1, 0, 0.86, -0.15),
    box(0.22, 0.38, 0.1, 0, 0.8, 0.25),
    box(0.22, 0.46, 0.1, 0, 1.57, 0.45),
    box(0.22, 0.4, 0.1, 0, 2.28, -0.35),
    box(0.22, 0.52, 0.1, 0, 2.34, 0.1)
  );
  shelf.position.set(-3.9, 0, -D / 2 + 0.45);
  shelf.rotation.y = Math.PI / 2;
  parts.shelf = shelf;
  g.add(shelf);

  // 落地窗（玻璃 = 线框平面）
  const win = named(
    "window",
    plane(2.4, 2.2, 0, 1.16, 0),
    box(2.6, 0.08, 0.14, 0, 2.28, 0),
    box(2.6, 0.08, 0.14, 0, 0.04, 0),
    box(0.08, 2.32, 0.14, -1.2, 1.16, 0),
    box(0.08, 2.32, 0.14, 1.2, 1.16, 0),
    box(0.05, 2.2, 0.12, 0, 1.16, 0)
  );
  win.position.set(3.2, 0, -D / 2 + 0.1);
  parts.window = win;
  g.add(win);

  // 绿植
  const plant = named("plant" as FurnitureKey, cyl(0.22, 0.16, 0.4, 0, 0.2, 0));
  const leaves = lines(new THREE.IcosahedronGeometry(0.55, 1));
  leaves.position.set(0, 1.0, 0);
  plant.add(leaves);
  plant.position.set(-3.6, 0, -2.8);
  g.add(plant);

  return g;
}

/* ================= 组件 ================= */
export default function Scene3D({ focusKey }: { focusKey?: FurnitureKey | null }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const partsRef = useRef<Partial<Record<FurnitureKey, THREE.Group>>>({});
  const lookTargetRef = useRef(new THREE.Vector3(0, 1.0, 0));
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(9.4, 7.0, 11.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const parts: Partial<Record<FurnitureKey, THREE.Group>> = {};
    const roomRoot = new THREE.Group();
    roomRoot.scale.setScalar(0.82);
    const room = new THREE.Group();
    room.add(buildLounge(parts));
    roomRoot.add(room);
    scene.add(roomRoot);
    partsRef.current = parts;

    const lookCur = new THREE.Vector3(0, 1.0, 0);

    let raf = 0;
    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    const clock = new THREE.Clock();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      // 线稿模型慢速往复摆动
      if (!reduced) room.rotation.y = Math.sin(t * 0.16) * 0.55 + mx * 0.22;
      camera.position.y = 7.0 - my * 0.6;
      lookCur.lerp(lookTargetRef.current, 0.06);
      camera.lookAt(lookCur);
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
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.LineSegments) o.geometry.dispose();
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  /* 点击展品：棱线染朱砂 + 相机短暂聚焦，随后缓缓回到全景 */
  useEffect(() => {
    const parts = partsRef.current;
    (Object.keys(parts) as FurnitureKey[]).forEach((k) => {
      const g = parts[k];
      if (!g) return;
      const hot = k === focusKey;
      g.traverse((o) => {
        if (o instanceof THREE.LineSegments) o.material = hot ? hotMat : edgeMat;
      });
    });
    if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
    const p = focusKey ? parts[focusKey] : null;
    if (p) {
      const c = new THREE.Vector3();
      new THREE.Box3().setFromObject(p).getCenter(c);
      lookTargetRef.current.set(c.x * 0.55, Math.max(0.7, c.y * 0.75), c.z * 0.55);
      focusTimerRef.current = setTimeout(() => lookTargetRef.current.set(0, 1.0, 0), 2800);
    } else {
      lookTargetRef.current.set(0, 1.0, 0);
    }
  }, [focusKey]);

  return <div ref={mountRef} className="w-full h-full" />;
}
