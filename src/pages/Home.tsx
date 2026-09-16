import { useEffect, useRef, useState } from "react";
import Scene3D from "@/components/Scene3D";
import Nav from "@/components/Nav";
import Building from "@/components/Building";
import Preloader from "@/components/Preloader";
import { works } from "@/data/works";

/* 散落字符入场 */
function ScatterTitle({ text, className }: { text: string; className?: string }) {
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSettled(true), 80);
    return () => clearTimeout(t);
  }, []);

  const chars = Array.from(text).map((ch, i) => {
    const seed = (i * 137 + 41) % 360;
    const dist = 90 + ((i * 97 + 13) % 320);
    const angle = (seed * Math.PI) / 180;
    return {
      ch,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      r: ((i * 53 + 29) % 180) - 90,
    };
  });

  return (
    <span className={className} aria-label={text}>
      {chars.map((c, i) => (
        <span
          key={i}
          className="scatter-char"
          style={{
            transform: settled ? "translate(0,0) rotate(0deg)" : `translate(${c.x}px, ${c.y}px) rotate(${c.r}deg)`,
            opacity: settled ? 1 : 0,
            transitionDelay: `${i * 90}ms`,
          }}
        >
          {c.ch === " " ? "\u00A0" : c.ch}
        </span>
      ))}
    </span>
  );
}

export default function Home() {
  const imgCount = works.reduce((s, w) => s + w.imgs.length, 0);
  const [entered, setEntered] = useState(false);
  const [coverGone, setCoverGone] = useState(false);
  const [booted, setBooted] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  /* entered 状态同步到 body（独立 effect，避免被清理函数误删） */
  useEffect(() => {
    document.body.classList.toggle("entered", entered);
    return () => document.body.classList.remove("entered");
  }, [entered]);

  /* 过渡动画结束后卸载封面 3D 场景，释放性能 */
  useEffect(() => {
    if (!entered) return;
    const t = setTimeout(() => setCoverGone(true), 1800);
    return () => clearTimeout(t);
  }, [entered]);

  /* 滚轮向下 / 触摸下滑 → 客厅缩小上移淡出，建筑升起 */
  useEffect(() => {
    let acc = 0;
    let last = 0;
    let lock = false;
    const enter = () => {
      if (lock) return;
      lock = true;
      setEntered(true);
      // 进入后让浏览器回到页面顶部，保证从 6F 开始
      requestAnimationFrame(() => window.scrollTo(0, 0));
    };
    const onWheel = (e: WheelEvent) => {
      if (entered) return;
      const now = Date.now();
      if (now - last > 320) acc = 0;
      last = now;
      if (e.deltaY > 0) {
        acc += e.deltaY;
        if (acc > 120) enter();
      } else acc = 0;
    };
    let touchY: number | null = null;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      if (entered || touchY === null) return;
      if (touchY - e.changedTouches[0].clientY > 70) enter();
      touchY = null;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [entered]);

  return (
    <div ref={wrapRef} className={`home-wrap ${entered ? "is-entered" : ""}`}>
      {!booted && <Preloader onDone={() => setBooted(true)} />}
      <Nav />

      {/* 封面：3D 客厅 */}
      {!coverGone && (
      <div className="cover">
        <div className="absolute inset-0 top-10">
          <Scene3D />
        </div>
        <div className="absolute inset-x-0 top-[6%] flex flex-col items-center pointer-events-none z-10">
          <ScatterTitle
            text="客厅图志"
            className="font-serif-sc font-black text-[15vw] md:text-[10.5vw] leading-none text-[var(--ink)]/90 mix-blend-multiply select-none"
          />
          <ScatterTitle
            text="LIVING ROOM ATLAS"
            className="font-grotesk tracking-[0.5em] text-xs md:text-sm text-[var(--ink-soft)] mt-4 select-none"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 px-5 md:px-10 pb-5">
          <div className="flex items-end justify-between text-xs md:text-sm">
            <div className="font-medium text-[var(--ink-soft)]">
              <div>一座关于「客厅」的概念档案</div>
              <div className="font-mono-arc text-[10px] tracking-widest mt-1 opacity-70">4 形态 × 5 分类轴 × 32 情绪</div>
            </div>
            <div className="text-center font-mono-arc text-[11px] tracking-widest">
              <span className="text-[var(--cinnabar)] font-bold">{works.length}</span> 条目
              <span className="mx-2 opacity-40">/</span>
              {imgCount} 图像
            </div>
            <button
              onClick={() => setEntered(true)}
              className="flex items-center gap-2 font-medium text-[var(--ink-soft)] hover:text-[var(--cinnabar)] transition-colors"
            >
              向前滚动进入图志
              <span className="inline-block animate-pulse">↓</span>
            </button>
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--ink)]/15 flex justify-between font-mono-arc text-[10px] tracking-widest text-[var(--ink-soft)]">
            <span>客厅图志 · LIVING ROOM ATLAS</span>
            <span>© 2026</span>
          </div>
        </div>
      </div>
      )}

      {/* 建筑剖面（从下方升起） */}
      {entered && (
        <div className="building-wrap">
          <Building />
        </div>
      )}
    </div>
  );
}
