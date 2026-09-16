import { useEffect, useRef, useState } from "react";

/** 全局双环光标：圆点即时跟随 + 外环缓动；通过 window 事件改变强调状态 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [accent, setAccent] = useState<string | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    document.documentElement.classList.add("has-cursor");

    const pos = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    };
    const loop = () => {
      ring.x += (pos.x - ring.x) * 0.16;
      ring.y += (pos.y - ring.y) * 0.16;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`;
      raf = requestAnimationFrame(loop);
    };
    const onAccent = (e: Event) => {
      const d = (e as CustomEvent).detail as { color: string | null };
      setAccent(d?.color ?? null);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("atlas-cursor", onAccent);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("atlas-cursor", onAccent);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div
        ref={ringRef}
        aria-hidden
        className={`cursor-ring ${accent ? "cursor-ring--accent" : ""}`}
        style={accent ? { borderColor: accent, backgroundColor: `${accent}14` } : undefined}
      />
    </>
  );
}
