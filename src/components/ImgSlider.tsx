import { useRef, useState } from "react";

interface Props {
  imgs: string[];
  alt: string;
  className?: string; // 容器类（控制比例/高度）
  imgClassName?: string; // img 类（object-cover / contain）
  eager?: boolean;
}

/** 多图滑动翻看：悬停箭头 + 圆点 + 触摸滑动；单图时纯展示 */
export default function ImgSlider({ imgs, alt, className = "", imgClassName = "object-cover", eager = false }: Props) {
  const [i, setI] = useState(0);
  const touchX = useRef<number | null>(null);
  const n = imgs.length;
  const go = (k: number) => setI(((k % n) + n) % n);

  if (n === 0) return null;

  if (n === 1) {
    return (
      <img
        src={imgs[0]}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        className={`w-full h-full ${imgClassName} ${className}`}
      />
    );
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden group/slider ${className}`}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 36) go(dx < 0 ? i + 1 : i - 1);
        touchX.current = null;
      }}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {imgs.map((src, k) => (
          <img
            key={src}
            src={src}
            alt={`${alt} ${k + 1}`}
            loading={eager || k === 0 ? "eager" : "lazy"}
            draggable={false}
            className={`w-full h-full shrink-0 ${imgClassName}`}
          />
        ))}
      </div>

      {/* 左右箭头 */}
      <button
        aria-label="上一张"
        onClick={(e) => { e.stopPropagation(); go(i - 1); }}
        className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center bg-[var(--paper)]/90 border border-[var(--ink)]/25 text-[var(--ink)] text-sm opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-[var(--paper)]"
      >
        ←
      </button>
      <button
        aria-label="下一张"
        onClick={(e) => { e.stopPropagation(); go(i + 1); }}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center bg-[var(--paper)]/90 border border-[var(--ink)]/25 text-[var(--ink)] text-sm opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-[var(--paper)]"
      >
        →
      </button>

      {/* 圆点 + 计数（图多时只保留计数，避免圆点溢出） */}
      {n <= 10 && (
        <div
          className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-[var(--ink)]/45 px-1.5 py-1"
          onClick={(e) => e.stopPropagation()}
        >
          {imgs.map((_, k) => (
            <button
              key={k}
              aria-label={`第 ${k + 1} 张`}
              onClick={(e) => { e.stopPropagation(); go(k); }}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${k === i ? "bg-[var(--paper)]" : "bg-[var(--paper)]/40"}`}
            />
          ))}
        </div>
      )}
      <div className="absolute top-1.5 right-1.5 z-10 font-mono-arc text-[10px] tracking-widest bg-[var(--ink)]/45 text-[var(--paper)] px-1.5 py-0.5">
        {i + 1}/{n}
      </div>
    </div>
  );
}
