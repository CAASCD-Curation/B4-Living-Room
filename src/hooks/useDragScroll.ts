import { useEffect, useRef } from "react";

/** 横向长廊：鼠标/触摸拖拽 + 惯性滚动（速度物理衰减） */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let down = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let lastT = 0;
    let vel = 0;
    let raf = 0;

    const stopMomentum = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };
    const momentum = () => {
      vel *= 0.94; // 物理衰减
      if (Math.abs(vel) < 0.4) { raf = 0; return; }
      el.scrollLeft += vel;
      raf = requestAnimationFrame(momentum);
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      down = true; moved = false;
      stopMomentum();
      startX = e.clientX;
      startScroll = el.scrollLeft;
      lastX = e.clientX;
      lastT = performance.now();
      vel = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 6) {
        moved = true;
        el.classList.add("dragging");
      }
      if (moved) {
        el.scrollLeft = startScroll - dx;
        const now = performance.now();
        const dt = now - lastT;
        if (dt > 0) {
          vel = ((lastX - e.clientX) / dt) * 16; // px / frame
          lastX = e.clientX;
          lastT = now;
        }
      }
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      el.classList.remove("dragging");
      if (moved && Math.abs(vel) > 1) momentum();
      // 允许 click 事件先读 moved 标记，再复位
      setTimeout(() => { moved = false; }, 0);
    };
    // 拖拽后阻止意外触发的点击
    const onClick = (e: MouseEvent) => {
      if (moved) { e.preventDefault(); e.stopPropagation(); }
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      stopMomentum();
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, []);

  return ref;
}
