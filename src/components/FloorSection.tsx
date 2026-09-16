import { useEffect, useRef } from "react";
import type { Floor } from "@/data/floors";
import RoomCell from "@/components/RoomCell";
import { useDragScroll } from "@/hooks/useDragScroll";

/** 一层楼：左侧电梯井 + 横向长廊（自动缓移 + 拖拽惯性），纵向吸附由父级控制 */
export default function FloorSection({ floor, inset = 0 }: { floor: Floor; inset?: number }) {
  const hallRef = useDragScroll<HTMLDivElement>();

  /* 长廊自动缓慢横移；悬停/拖拽时暂停（按时间步进，低帧率下也保持匀速） */
  useEffect(() => {
    const el = hallRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let paused = false;
    let lastT = performance.now();
    const SPEED = 0.028; // px / ms ≈ 28px/s
    const step = (t: number) => {
      const dt = Math.min(t - lastT, 100); // 帧间隔封顶，避免后台切回时猛跳
      lastT = t;
      if (!paused && !el.classList.contains("dragging")) {
        el.scrollLeft += SPEED * dt;
        // 到底后回卷，形成循环
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) el.scrollLeft = 0;
      }
      raf = requestAnimationFrame(step);
    };
    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(step);    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [hallRef]);

  const plateRef = useRef<HTMLDivElement>(null);

  /* 记录楼面实际半宽差（电梯井宽度 + 塔身收窄），供楼缝阴影跟随 */
  useEffect(() => {
    const plate = plateRef.current;
    const section = plate?.closest<HTMLElement>(".floor-section");
    if (!plate || !section) return;
    const measure = () => {
      const gap = Math.max(0, (section.clientWidth - plate.clientWidth) / 2);
      section.style.setProperty("--gap", `${gap.toFixed(1)}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      className="floor-section"
      data-floor={floor.id}
      style={{ ["--floor-bg" as string]: floor.bg }}
    >
      <div
        ref={plateRef}
        className="floor-plate"
        style={{
          ["--inset" as string]: `${inset}px`,
          ["--plate-bg" as string]: floor.bg,
        }}
      >
      {/* 电梯井 */}
      <aside className="floor-shaft">
        <div className="floor-shaft-num" style={{ color: floor.color }}>{floor.id}</div>
        <div className="floor-shaft-name">{floor.name}</div>
        <div className="floor-shaft-en font-mono-arc">{floor.en}</div>
        <div className="floor-shaft-count font-mono-arc">{floor.works.length} 间</div>
        <div className="floor-shaft-line" style={{ backgroundColor: floor.color }} />
      </aside>

      {/* 横向长廊 */}
      <div ref={hallRef} className="floor-hall">
        <div className="floor-hall-inner">
          <div className="floor-intro">
            <p>{floor.desc}</p>
            <span className="floor-intro-hint font-mono-arc">拖动长廊 →</span>
          </div>
          {floor.works.map((w) => (
            <RoomCell key={w.id} work={w} accent={floor.color} />
          ))}
          <div className="floor-hall-end font-mono-arc">END OF {floor.id}</div>
        </div>
      </div>
      </div>
    </section>
  );
}
