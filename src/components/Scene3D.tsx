import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ================= 纯线稿客厅 =================
 * 无地板、无墙面：方格网格打底，家具只留能认出轮廓的最少棱线，
 * 布局向四周散开，中间留空。 */
const INK = 0x1b1712;

const edgeMat = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.92 });

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

/* 方格网底 */
function buildGrid(): THREE.Group {
  const g = new THREE.Group();
  const grid = new THREE.GridHelper(16, 16, INK, INK);
  grid.scale.z = 0.75; // 网格 16×16 压成 16×12，与外框一致
  const mats = Array.isArray(grid.material) ? grid.material : [grid.material];
  mats.forEach((m) => {
    m.transparent = true;
    m.opacity = 0.18;
  });
  g.add(grid);
  // 外框一圈稍深的边线，界定空间
  const W = 16, D = 12;
  const frame = new THREE.Group();
  frame.add(box(W, 0.02, 0.02, 0, 0, -D / 2));
  frame.add(box(W, 0.02, 0.02, 0, 0, D / 2));
  frame.add(box(0.02, 0.02, D, -W / 2, 0, 0));
  frame.add(box(0.02, 0.02, D, W / 2, 0, 0));
  g.add(frame);
  return g;
}

/* ================= 线稿客厅（家具极度精简、向四周散开） ================= */
function buildLounge(): THREE.Group {
  const g = new THREE.Group();
  const D = 12; // 深度（网格 16 × 12）

  g.add(buildGrid());

  // 三人沙发：座 + 背 + 扶手
  const sofa = new THREE.Group();
  sofa.add(box(3.4, 0.5, 1.3, 0, 0.35, 0));
  sofa.add(box(3.4, 0.9, 0.32, 0, 0.95, -0.5));
  sofa.add(box(0.32, 0.75, 1.3, -1.55, 0.62, 0));
  sofa.add(box(0.32, 0.75, 1.3, 1.55, 0.62, 0));
  sofa.position.set(-2.2, 0, 3.2);
  sofa.rotation.y = Math.PI;
  g.add(sofa);

  // 茶几：桌面 + 四条腿
  const table = new THREE.Group();
  table.add(box(1.7, 0.08, 0.9, 0, 0.42, 0));
  table.add(box(0.08, 0.42, 0.08, -0.75, 0.21, -0.32));
  table.add(box(0.08, 0.42, 0.08, 0.75, 0.21, -0.32));
  table.add(box(0.08, 0.42, 0.08, -0.75, 0.21, 0.32));
  table.add(box(0.08, 0.42, 0.08, 0.75, 0.21, 0.32));
  table.position.set(-1.6, 0, 0.9);
  g.add(table);

  // 电视：机身 + 屏幕线
  const tv = new THREE.Group();
  tv.add(box(2.6, 1.5, 0.08, 0, 1.6, 0));
  tv.add(plane(2.35, 1.28, 0, 1.6, 0.06));
  tv.position.set(-1.4, 0, -D / 2 + 0.9);
  g.add(tv);

  // 落地灯：底座 + 灯杆 + 灯罩
  const lamp = new THREE.Group();
  lamp.add(cyl(0.22, 0.26, 0.05, 0, 0.03, 0));
  lamp.add(cyl(0.03, 0.03, 2.1, 0, 1.05, 0));
  lamp.add(cyl(0.42, 0.3, 0.55, 0, 2.35, 0));
  lamp.position.set(5.0, 0, -1.0);
  g.add(lamp);

  // 单人椅 + 边几
  const chair = new THREE.Group();
  chair.add(box(0.95, 0.42, 0.9, 0, 0.32, 0));
  chair.add(box(0.95, 0.8, 0.25, 0, 0.8, -0.33));
  chair.add(cyl(0.32, 0.32, 0.5, 1.4, 0.25, -0.8));
  chair.position.set(3.6, 0, 1.8);
  chair.rotation.y = -0.7;
  g.add(chair);

  // 书架：外框 + 两层隔板 + 三本书
  const shelf = new THREE.Group();
  shelf.add(box(0.35, 3.2, 1.6, 0, 1.6, 0));
  shelf.add(box(0.4, 0.05, 1.5, 0, 1.15, 0));
  shelf.add(box(0.4, 0.05, 1.5, 0, 2.1, 0));
  shelf.add(box(0.22, 0.46, 0.1, 0, 1.43, -0.4));
  shelf.add(box(0.22, 0.38, 0.1, 0, 1.39, -0.1));
  shelf.add(box(0.22, 0.52, 0.1, 0, 2.39, 0.3));
  shelf.position.set(-5.6, 0, -D / 2 + 1.0);
  shelf.rotation.y = Math.PI / 2;
  g.add(shelf);

  // 落地窗：玻璃线 + 十字棂
  const win = new THREE.Group();
  win.add(plane(2.4, 2.2, 0, 1.16, 0));
  win.add(box(0.05, 2.2, 0.1, 0, 1.16, 0));
  win.add(box(2.4, 0.05, 0.1, 0, 1.16, 0));
  win.position.set(4.6, 0, -D / 2 + 0.35);
  g.add(win);

  // 绿植：盆 + 一颗多面体
  const plant = new THREE.Group();
  plant.add(cyl(0.22, 0.16, 0.4, 0, 0.2, 0));
  const leaves = lines(new THREE.IcosahedronGeometry(0.55, 0));
  leaves.position.set(0, 1.0, 0);
  plant.add(leaves);
  plant.position.set(-4.6, 0, -2.2);
  g.add(plant);

  return g;
}

/* ================= 组件 ================= */
export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(10.8, 7.4, 13.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const roomRoot = new THREE.Group();
    roomRoot.scale.setScalar(0.82);
    const room = new THREE.Group();
    room.add(buildLounge());
    roomRoot.add(room);
    scene.add(roomRoot);

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
      camera.position.y = 7.4 - my * 0.6;
      camera.lookAt(0, 1.0, 0);
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
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.LineSegments) o.geometry.dispose();
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
