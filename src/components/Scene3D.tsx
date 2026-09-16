import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ================= 纯线稿客厅 =================
 * 只保留墨线棱边、不加任何颜色填充；唯独地板保留一块浅纸面色，
 * 让空间有落点。不做墙面，保持轻盈。 */
const INK = 0x1b1712;
const PAPER_DEEP = 0xe6ddcb;

const edgeMat = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.92 });
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

/* ================= 线稿客厅 ================= */
function buildLounge(): THREE.Group {
  const g = new THREE.Group();
  const W = 10, D = 8;

  // 地板（唯一保留颜色的面：浅纸色 + 墨线收边）
  const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(W, 0.12, D), floorMat);
  floorMesh.position.y = -0.06;
  g.add(floorMesh);
  g.add(box(W, 0.12, D, 0, -0.06, 0));

  // 三人沙发
  const sofa = new THREE.Group();
  sofa.add(box(3.4, 0.5, 1.3, 0, 0.35, 0)); // 座
  sofa.add(box(3.4, 0.9, 0.32, 0, 0.95, -0.5)); // 背
  sofa.add(box(0.32, 0.75, 1.3, -1.55, 0.62, 0)); // 扶手
  sofa.add(box(0.32, 0.75, 1.3, 1.55, 0.62, 0));
  sofa.add(box(1.0, 0.22, 1.0, -0.75, 0.7, 0.05)); // 靠垫
  sofa.add(box(1.0, 0.22, 1.0, 0.4, 0.7, 0.05));
  sofa.position.set(-0.6, 0, 1.6);
  sofa.rotation.y = Math.PI;
  g.add(sofa);

  // 茶几 + 茶杯
  const table = new THREE.Group();
  table.add(box(1.7, 0.08, 0.9, 0, 0.42, 0));
  table.add(box(0.08, 0.42, 0.08, -0.75, 0.21, -0.32));
  table.add(box(0.08, 0.42, 0.08, 0.75, 0.21, -0.32));
  table.add(box(0.08, 0.42, 0.08, -0.75, 0.21, 0.32));
  table.add(box(0.08, 0.42, 0.08, 0.75, 0.21, 0.32));
  table.add(cyl(0.09, 0.07, 0.12, -0.35, 0.52, 0));
  table.position.set(-0.6, 0, 0.2);
  g.add(table);

  // 电视柜 + 电视（屏幕只是一道线框）
  const tv = new THREE.Group();
  tv.add(box(3.0, 0.35, 0.45, 0, 0.18, 0));
  tv.add(box(0.5, 0.5, 0.1, 0, 0.6, 0));
  tv.add(box(2.6, 1.5, 0.08, 0, 1.6, 0));
  tv.add(plane(2.35, 1.28, 0, 1.6, 0.06));
  tv.position.set(-0.6, 0, -D / 2 + 0.35);
  g.add(tv);

  // 落地灯
  const lamp = new THREE.Group();
  lamp.add(cyl(0.22, 0.26, 0.05, 0, 0.03, 0));
  lamp.add(cyl(0.03, 0.03, 2.1, 0, 1.05, 0));
  lamp.add(cyl(0.42, 0.3, 0.55, 0, 2.35, 0));
  lamp.position.set(2.6, 0, -2.6);
  g.add(lamp);

  // 单人椅 + 边几
  const chair = new THREE.Group();
  chair.add(box(0.95, 0.42, 0.9, 0, 0.32, 0));
  chair.add(box(0.95, 0.8, 0.25, 0, 0.8, -0.33));
  chair.add(cyl(0.32, 0.32, 0.5, 1.2, 0.25, -0.7));
  chair.position.set(2.2, 0, 0.9);
  chair.rotation.y = -0.7;
  g.add(chair);

  // 书架（书脊只剩竖线）
  const shelf = new THREE.Group();
  shelf.add(box(0.35, 3.2, 1.6, 0, 1.6, 0));
  shelf.add(box(0.4, 0.05, 1.5, 0, 0.55, 0));
  shelf.add(box(0.4, 0.05, 1.5, 0, 1.3, 0));
  shelf.add(box(0.4, 0.05, 1.5, 0, 2.05, 0));
  shelf.add(box(0.4, 0.05, 1.5, 0, 2.8, 0));
  shelf.add(box(0.22, 0.42, 0.1, 0, 0.82, -0.5));
  shelf.add(box(0.22, 0.5, 0.1, 0, 0.86, -0.15));
  shelf.add(box(0.22, 0.38, 0.1, 0, 0.8, 0.25));
  shelf.add(box(0.22, 0.46, 0.1, 0, 1.57, 0.45));
  shelf.add(box(0.22, 0.4, 0.1, 0, 2.28, -0.35));
  shelf.add(box(0.22, 0.52, 0.1, 0, 2.34, 0.1));
  shelf.position.set(-3.9, 0, -D / 2 + 0.45);
  shelf.rotation.y = Math.PI / 2;
  g.add(shelf);

  // 落地窗（玻璃 = 线框平面）
  const win = new THREE.Group();
  win.add(plane(2.4, 2.2, 0, 1.16, 0));
  win.add(box(2.6, 0.08, 0.14, 0, 2.28, 0));
  win.add(box(2.6, 0.08, 0.14, 0, 0.04, 0));
  win.add(box(0.08, 2.32, 0.14, -1.2, 1.16, 0));
  win.add(box(0.08, 2.32, 0.14, 1.2, 1.16, 0));
  win.add(box(0.05, 2.2, 0.12, 0, 1.16, 0));
  win.position.set(3.2, 0, -D / 2 + 0.1);
  g.add(win);

  // 绿植
  const plant = new THREE.Group();
  plant.add(cyl(0.22, 0.16, 0.4, 0, 0.2, 0));
  const leaves = lines(new THREE.IcosahedronGeometry(0.55, 1));
  leaves.position.set(0, 1.0, 0);
  plant.add(leaves);
  plant.position.set(-3.6, 0, -2.8);
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
    camera.position.set(9.4, 7.0, 11.4);

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
      camera.position.y = 7.0 - my * 0.6;
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
