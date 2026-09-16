import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import Scene3D from "@/components/Scene3D";
import Nav from "@/components/Nav";
import { works } from "@/data/works";

/* 散落字符入场 */
function ScatterTitle({ text, className }: { text: string; className?: string }) {
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSettled(true), 80);
    return () => clearTimeout(t);
  }, []);

  const chars = useMemo(() => {
    return Array.from(text).map((ch, i) => {
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
  }, [text]);

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
  const navigate = useNavigate();
  const imgCount = works.reduce((s, w) => s + w.imgs.length, 0);

  return (
    <div className="relative h-screen w-full overflow-hidden blueprint-bg">
      <Nav />

      {/* 3D 客厅 */}
      <div className="absolute inset-0 top-10">
        <Scene3D />
      </div>

      {/* 中央大标题 */}
      <div className="absolute inset-x-0 top-[16%] flex flex-col items-center pointer-events-none z-10">
        <ScatterTitle
          text="客厅图志"
          className="font-serif-sc font-black text-[15vw] md:text-[10.5vw] leading-none text-[var(--ink)]/90 mix-blend-multiply select-none"
        />
        <ScatterTitle
          text="LIVING ROOM ATLAS"
          className="font-grotesk tracking-[0.5em] text-xs md:text-sm text-[var(--ink-soft)] mt-4 select-none"
        />
      </div>

      {/* 底部信息栏 */}
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
            onClick={() => navigate("/atlas")}
            className="group flex items-center gap-2 font-medium hover:text-[var(--cinnabar)] transition-colors"
          >
            进入图志
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
        <div className="mt-3 pt-3 border-t border-[var(--ink)]/15 flex justify-between font-mono-arc text-[10px] tracking-widest text-[var(--ink-soft)]">
          <span>客厅图志 · LIVING ROOM ATLAS</span>
          <span>© 2026</span>
        </div>
      </div>
    </div>
  );
}
