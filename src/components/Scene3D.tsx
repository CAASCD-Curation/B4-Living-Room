import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ================= 线条感档案馆配色 =================
 * 参考风格：米色纸底 + 墨线勾边 + 平涂色块（黄 / 蓝 / 砖红） */
const INK = 0x1b1712;
const PAPER = 0xf2ede3;
const PAPER_DEEP = 0xe6ddcb;
const YELLOW = 0xd8b04a;
const BLUE = 0x93a7c9;
const BLUE_DEEP = 0x39557f;
const BRICK = 0xb0492c;
const WOOD = 0x6b4f35;
const WOOD_LIGHT = 0x8a6f4d;
const GREEN = 0x71805c;

const edgeMat = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.9 });

/* 平涂材质（无光照，插画感） */
const flat = (color: number) => new THREE.MeshBasicMaterial({ color });

/* 给网格加墨线勾边 */
function outlined(mesh: THREE.Mesh): THREE.Mesh {
  mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), edgeMat));
  return mesh;
}

function box(w: number, h: number, d: number, color: number, x = 0, y = 0, z = 0, ry = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), flat(color));
  m.position.set(x, y, z);
  m.rotation.y = ry;
  return outlined(m);
}

function cyl(rt: number, rb: number, h: number, color: number, x = 0, y = 0, z = 0, seg = 20) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), flat(color));
  m.position.set(x, y, z);
  return outlined(m);
}

/* ================= 线条客厅 ================= */
function buildLounge(): THREE.Group {
  const g = new THREE.Group();
  const W = 10, D = 8;

  // 地板（纸面色，墨线收边）
  g.add(box(W, 0.12, D, PAPER_DEEP, 0, -0.06, 0));

  // 地毯（砖红色块）
  g.add(box(4.6, 0.04, 3.2, BRICK, 0.4, 0.03, 0.4));

  // 三人沙发（明黄块，参考图主色）
  const sofa = new THREE.Group();
  sofa.add(box(3.4, 0.5, 1.3, YELLOW, 0, 0.35, 0)); // 座
  sofa.add(box(3.4, 0.9, 0.32, YELLOW, 0, 0.95, -0.5)); // 背
  sofa.add(box(0.32, 0.75, 1.3, YELLOW, -1.55, 0.62, 0)); // 扶手
  sofa.add(box(0.32, 0.75, 1.3, YELLOW, 1.55, 0.62, 0));
  sofa.add(box(1.0, 0.22, 1.0, PAPER, -0.75, 0.7, 0.05)); // 靠垫
  sofa.add(box(1.0, 0.22, 1.0, BLUE, 0.4, 0.7, 0.05));
  sofa.position.set(-0.6, 0, 1.6);
  sofa.rotation.y = Math.PI;
  g.add(sofa);

  // 茶几 + 茶杯
  g.add(box(1.7, 0.08, 0.9, WOOD, -0.6, 0.42, 0.2));
  g.add(box(0.08, 0.42, 0.08, WOOD, -1.35, 0.21, -0.1));
  g.add(box(0.08, 0.42, 0.08, WOOD, 0.15, 0.21, -0.1));
  g.add(box(0.08, 0.42, 0.08, WOOD, -1.35, 0.21, 0.5));
  g.add(box(0.08, 0.42, 0.08, WOOD, 0.15, 0.21, 0.5));
  g.add(cyl(0.09, 0.07, 0.12, PAPER, -0.9, 0.52, 0.2));

  // 电视（墨线机身 + 靛蓝屏幕色块）
  g.add(box(3.0, 0.35, 0.45, WOOD_LIGHT, -0.6, 0.18, -D / 2 + 0.35)); // 电视柜
  g.add(box(0.5, 0.5, 0.1, INK, -0.6, 0.6, -D / 2 + 0.14)); // 支架
  g.add(box(2.6, 1.5, 0.08, INK, -0.6, 1.6, -D / 2 + 0.12)); // 机身
  g.add(outlined(new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1.28), flat(BLUE_DEEP))));
  const screen = g.children[g.children.length - 1] as THREE.Mesh;
  screen.position.set(-0.6, 1.6, -D / 2 + 0.17);

  // 落地灯（砖红柱 + 黄色灯罩，参考图配色）
  const lampX = 2.6, lampZ = -2.6;
  g.add(cyl(0.22, 0.26, 0.05, INK, lampX, 0.03, lampZ));
  g.add(cyl(0.03, 0.03, 2.1, BRICK, lampX, 1.05, lampZ));
  g.add(cyl(0.42, 0.3, 0.55, YELLOW, lampX, 2.35, lampZ));

  // 单人椅（浅蓝色块）+ 边几
  const chair = new THREE.Group();
  chair.add(box(0.95, 0.42, 0.9, BLUE, 0, 0.32, 0));
  chair.add(box(0.95, 0.8, 0.25, BLUE, 0, 0.8, -0.33));
  chair.position.set(2.2, 0, 0.9);
  chair.rotation.y = -0.7;
  g.add(chair);
  g.add(cyl(0.32, 0.32, 0.5, WOOD, 3.3, 0.25, 0.2));

  // 书架（木色骨架 + 彩色书脊）
  const shelf = new THREE.Group();
  shelf.add(box(0.35, 3.2, 1.6, WOOD_LIGHT, 0, 1.6, 0));
  for (let i = 0; i < 4; i++) shelf.add(box(0.4, 0.05, 1.5, WOOD, 0, 0.55 + i * 0.75, 0));
  const bookColors = [0xc0432b, 0x2f4b8f, 0xb8860b, 0x71805c, 0x8a5a2e];
  for (let i = 0; i < 12; i++) {
    shelf.add(
      box(0.22, 0.42, 0.1, bookColors[i % 5], 0, 0.82 + Math.floor(i / 3) * 0.75, -0.55 + (i % 3) * 0.5, (i % 2) * 0.06)
    );
  }
  shelf.position.set(-3.9, 0, -D / 2 + 0.45);
  shelf.rotation.y = Math.PI / 2;
  g.add(shelf);

  // 落地窗（浅蓝玻璃色块 + 木框）
  g.add(box(2.4, 2.2, 0.06, BLUE, 3.2, 1.16, -D / 2 + 0.1)); // 玻璃
  g.add(box(2.6, 0.08, 0.14, WOOD, 3.2, 2.28, -D / 2 + 0.12)); // 上框
  g.add(box(2.6, 0.08, 0.14, WOOD, 3.2, 0.04, -D / 2 + 0.12)); // 下框
  g.add(box(0.08, 2.32, 0.14, WOOD, 2.0, 1.16, -D / 2 + 0.12)); // 左右框
  g.add(box(0.08, 2.32, 0.14, WOOD, 4.4, 1.16, -D / 2 + 0.12));
  g.add(box(0.05, 2.2, 0.12, WOOD, 3.2, 1.16, -D / 2 + 0.12)); // 中梃

  // 绿植
  g.add(cyl(0.22, 0.16, 0.4, 0xa8432a, -3.6, 0.2, -2.8));
  const leaves = outlined(new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 1), flat(GREEN)));
  leaves.position.set(-3.6, 1.0, -2.8);
  g.add(leaves);

  // 立画（墨框 + 黄芯）
  g.add(box(1.1, 1.4, 0.06, INK, -3.2, 0.72, -D / 2 + 0.2, 0.12));
  g.add(box(0.94, 1.24, 0.07, YELLOW, -3.2, 0.72, -D / 2 + 0.22, 0.12));

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
      // 线条模型慢速往复摆动，始终看向房间内部
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
        if (o instanceof THREE.Mesh || o instanceof THREE.LineSegments) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
