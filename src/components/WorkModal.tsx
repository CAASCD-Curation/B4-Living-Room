import { useEffect } from "react";
import type { Work } from "@/types/work";
import { CATEGORY_META } from "@/types/work";
import { AXES } from "@/data/system";
import ImgSlider from "@/components/ImgSlider";

export default function WorkModal({ work, onClose }: { work: Work; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const axisValues = [work.a1, work.a2, work.a3, work.a4, work.a5];

  return (
    <div className="fixed inset-0 z-[70] modal-mask" onClick={onClose}>
      <div className="absolute inset-0 bg-[var(--ink)]/55 backdrop-blur-[2px]" />
      <div
        className="modal-panel absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(1060px,94vw)] max-h-[88vh] overflow-y-auto bg-[var(--paper)] border border-[var(--ink)]/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-5 md:px-8 h-14 border-b border-[var(--ink)]/15 sticky top-0 bg-[var(--paper)] z-10">
          <span className="font-mono-arc text-xs tracking-widest text-[var(--ink-soft)]">
            {work.id} · {CATEGORY_META[work.cat].label}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-xl hover:text-[var(--cinnabar)] transition-colors"
            aria-label="关闭"
          >
            ×
          </button>
        </div>

        <div className="grid md:grid-cols-2">
          {/* 图像（多图可滑动翻看） */}
          <div className="bg-[var(--paper-deep)] flex items-center justify-center p-5 md:p-8 min-h-[280px]">
            {work.imgs.length > 0 ? (
              <div className="w-full aspect-[4/3] max-h-[56vh] border border-[var(--ink)]/15 shadow-lg bg-[var(--paper)]">
                <ImgSlider imgs={work.imgs} alt={work.name} eager imgClassName="object-contain" />
              </div>
            ) : (
              <div className="placeholder-tile w-full aspect-[4/3] flex flex-col items-center justify-center border border-[var(--ink)]/15">
                <span className="font-mono-arc text-3xl font-bold text-[var(--ink)]/30">{work.id}</span>
                <span className="font-mono-arc text-[10px] tracking-[0.3em] text-[var(--ink)]/40 mt-3">
                  图像待补 · IMAGE TBD
                </span>
              </div>
            )}
          </div>

          {/* 信息 */}
          <div className="p-5 md:p-8">
            <h2 className="font-serif-sc font-black text-2xl md:text-3xl leading-snug">{work.name}</h2>
            {work.source && <p className="mt-2 text-sm text-[var(--ink-soft)]">{work.source}</p>}

            <div className="mt-4 flex gap-6 font-mono-arc text-[11px] tracking-widest text-[var(--ink-soft)]">
              {work.year && <span>时间 {work.year}</span>}
              {work.country && <span>地区 {work.country}</span>}
            </div>

            {work.desc && (
              <p className="mt-5 text-[15px] leading-relaxed border-l-2 border-[var(--cinnabar)] pl-4">
                {work.desc}
              </p>
            )}

            {/* 五轴标签 */}
            <div className="mt-6 space-y-3">
              {AXES.map((ax, i) => {
                const vals = axisValues[i];
                if (!vals.length) return null;
                return (
                  <div key={ax.key} className="flex items-start gap-3">
                    <span
                      className="shrink-0 w-16 text-[11px] pt-1 font-medium"
                      style={{ color: ax.color }}
                    >
                      {ax.no} {ax.name}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {vals.map((t) => (
                        <span key={t} className="axis-tag" style={{ color: ax.color }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {work.link && (
              <a
                href={work.link}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center gap-2 text-sm font-medium border border-[var(--ink)] px-4 py-2 hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
              >
                查看出处证据 ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
