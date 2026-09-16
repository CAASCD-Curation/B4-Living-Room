import { useEffect, useRef } from "react";
import * as THREE from "three";


const mat = (color: number, roughness = 0.85, metalness = 0.02) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });

function box(w: number, h: number, d: number, color: number, x = 0, y = 0, z = 0, ry = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
  m.position.set(x, y, z);
  m.rotation.y = ry;
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function cyl(rt: number, rb: number, h: number, color: number, x = 0, y = 0, z = 0, seg = 24) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color));
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/* ================= 现代客厅 ================= */
function buildLounge(): THREE.Group {
  const g = new THREE.Group();
  const W = 10, D = 8;

  // 地板（无墙 —— 客厅敞开）
  g.add(box(W, 0.12, D, 0xd9cfbc, 0, -0.06, 0)); // 地板

  // 地毯
  g.add(box(4.6, 0.04, 3.2, 0xb66a45, 0.4, 0.03, 0.4));

  // 三人沙发（面向 +z）
  const sofa = new THREE.Group();
  const sofaC = 0x7d8b6a;
  sofa.add(box(3.4, 0.5, 1.3, sofaC, 0, 0.35, 0)); // 座
  sofa.add(box(3.4, 0.9, 0.32, sofaC, 0, 0.95, -0.5)); // 背
  sofa.add(box(0.32, 0.75, 1.3, sofaC, -1.55, 0.62, 0)); // 扶手
  sofa.add(box(0.32, 0.75, 1.3, sofaC, 1.55, 0.62, 0));
  sofa.add(box(1.0, 0.22, 1.0, 0x94a179, -0.75, 0.7, 0.05)); // 靠垫
  sofa.add(box(1.0, 0.22, 1.0, 0xc9b48a, 0.4, 0.7, 0.05));
  sofa.position.set(-0.6, 0, 1.6);
  sofa.rotation.y = Math.PI;
  g.add(sofa);

  // 茶几 + 茶杯
  g.add(box(1.7, 0.08, 0.9, 0x6b4f35, -0.6, 0.42, 0.2));
  g.add(box(0.08, 0.42, 0.08, 0x6b4f35, -1.35, 0.21, -0.1));
  g.add(box(0.08, 0.42, 0.08, 0x6b4f35, 0.15, 0.21, -0.1));
  g.add(box(0.08, 0.42, 0.08, 0x6b4f35, -1.35, 0.21, 0.5));
  g.add(box(0.08, 0.42, 0.08, 0x6b4f35, 0.15, 0.21, 0.5));
  g.add(cyl(0.09, 0.07, 0.12, 0xf2ede3, -0.9, 0.52, 0.2));

  // 落地电视（发光屏，立于地台之上）
  g.add(box(3.0, 0.35, 0.45, 0x8a6f4d, -0.6, 0.18, -D / 2 + 0.35)); // 电视柜
  g.add(box(0.5, 0.5, 0.1, 0x1b1712, -0.6, 0.6, -D / 2 + 0.14)); // 支架
  g.add(box(2.6, 1.5, 0.08, 0x1b1712, -0.6, 1.6, -D / 2 + 0.12)); // 机身
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.35, 1.28),
    new THREE.MeshStandardMaterial({
      color: 0x2b3c5e,
      emissive: 0x39557f,
      emissiveIntensity: 0.9,
      roughness: 0.4,
    })
  );
  screen.position.set(-0.6, 1.6, -D / 2 + 0.17);
  g.add(screen);

  // 落地灯（暖光）
  const lampX = 2.6, lampZ = -2.6;
  g.add(cyl(0.22, 0.26, 0.05, 0x3a332b, lampX, 0.03, lampZ));
  g.add(cyl(0.03, 0.03, 2.1, 0x3a332b, lampX, 1.05, lampZ));
  const shade = cyl(0.42, 0.3, 0.55, 0xe8c98f, lampX, 2.35, lampZ);
  (shade.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0xffca7a);
  (shade.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.55;
  g.add(shade);
  const lampLight = new THREE.PointLight(0xffc06a, 12, 8, 1.8);
  lampLight.position.set(lampX, 2.2, lampZ);
  g.add(lampLight);

  // 单人椅 + 边几
  const chair = new THREE.Group();
  chair.add(box(0.95, 0.42, 0.9, 0xb0492c, 0, 0.32, 0));
  chair.add(box(0.95, 0.8, 0.25, 0xb0492c, 0, 0.8, -0.33));
  chair.position.set(2.2, 0, 0.9);
  chair.rotation.y = -0.7;
  g.add(chair);
  g.add(cyl(0.32, 0.32, 0.5, 0x6b4f35, 3.3, 0.25, 0.2));

  // 书架
  const shelf = new THREE.Group();
  shelf.add(box(0.35, 3.2, 1.6, 0x8a6f4d, 0, 1.6, 0));
  for (let i = 0; i < 4; i++) shelf.add(box(0.4, 0.05, 1.5, 0x6b4f35, 0, 0.55 + i * 0.75, 0));
  const bookColors = [0xc0432b, 0x2f4b8f, 0xb8860b, 0x71805c, 0x8a5a2e];
  for (let i = 0; i < 12; i++) {
    shelf.add(
      box(0.22, 0.42, 0.1, bookColors[i % 5], 0, 0.82 + Math.floor(i / 3) * 0.75, -0.55 + (i % 3) * 0.5, (i % 2) * 0.06)
    );
  }
  shelf.position.set(-3.9, 0, -D / 2 + 0.45);
  shelf.rotation.y = Math.PI / 2;
  g.add(shelf);

  // 落地窗架（独立立框，自地面而起）
  g.add(box(2.4, 2.2, 0.06, 0xfdf9ef, 3.2, 1.16, -D / 2 + 0.1)); // 玻璃光面
  g.add(box(2.6, 0.08, 0.14, 0x8a6f4d, 3.2, 2.28, -D / 2 + 0.12)); // 上框
  g.add(box(2.6, 0.08, 0.14, 0x8a6f4d, 3.2, 0.04, -D / 2 + 0.12)); // 下框
  g.add(box(0.08, 2.32, 0.14, 0x8a6f4d, 2.0, 1.16, -D / 2 + 0.12)); // 左右框
  g.add(box(0.08, 2.32, 0.14, 0x8a6f4d, 4.4, 1.16, -D / 2 + 0.12));
  g.add(box(0.05, 2.2, 0.12, 0x8a6f4d, 3.2, 1.16, -D / 2 + 0.12)); // 中梃

  // 绿植
  g.add(cyl(0.22, 0.16, 0.4, 0xa8432a, -3.6, 0.2, -2.8));
  const leaves = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 1), mat(0x71805c, 0.9));
  leaves.position.set(-3.6, 1.0, -2.8);
  leaves.castShadow = true;
  g.add(leaves);

  // 立画（无墙，画框直接立于地板）
  g.add(box(1.1, 1.4, 0.06, 0x1b1712, -3.2, 0.72, -D / 2 + 0.2, 0.12));
  g.add(box(0.94, 1.24, 0.07, 0xd8b04a, -3.2, 0.72, -D / 2 + 0.22, 0.12));

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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xfff3e0, 0.85));
    const sun = new THREE.DirectionalLight(0xffe8c4, 1.7);
    sun.position.set(6, 9, 5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -9;
    sun.shadow.camera.right = 9;
    sun.shadow.camera.top = 9;
    sun.shadow.camera.bottom = -9;
    scene.add(sun);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(11, 48),
      new THREE.MeshStandardMaterial({ color: 0xf2ede3, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.12;
    ground.receiveShadow = true;
    scene.add(ground);

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
      // 限制在开放角附近往复摆动，始终看向房间内部
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
        if (o instanceof THREE.Mesh) {
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
