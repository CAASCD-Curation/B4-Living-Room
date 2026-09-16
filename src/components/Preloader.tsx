import { useEffect, useState } from "react";

/* 首屏预加载：品牌字逐字浮现 + 细进度条 + 百分比，完成后整体上滑退出
 * （参考旧版档案馆站点 https://4m1weakhk903e.aiforce.cloud/app/app_17e3crpkd5j 的加载方式） */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // #skip-pre：跳过预加载（测试/低性能设备可用）
    if (window.location.hash.includes("skip-pre")) {
      onDone();
      return;
    }
    let raf = 0;
    let cur = 0;
    let loaded = document.readyState === "complete";
    const onLoad = () => {
      loaded = true;
    };
    if (!loaded) window.addEventListener("load", onLoad);

    const t0 = performance.now();
    const MIN = 1500; // 最少展示时长，避免一闪而过
    const tick = () => {
      const el = performance.now() - t0;
      const target = loaded && el >= MIN ? 100 : Math.min(88, (el / MIN) * 88);
      cur += (target - cur) * 0.1;
      if (cur > 99.3) cur = 100;
      setPct(Math.floor(cur));
      if (cur >= 100) {
        setDone(true);
        setTimeout(onDone, 1000); // 等上滑动画播完再卸载
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, [onDone]);

  return (
    <div className={`preloader ${done ? "is-done" : ""}`} aria-hidden>
      <div className="preloader-brand font-serif-sc">
        {Array.from("客厅图志").map((ch, i) => (
          <span key={i} style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
            {ch}
          </span>
        ))}
      </div>
      <div className="preloader-en font-mono-arc">LIVING ROOM ATLAS</div>
      <div className="preloader-bar-wrap">
        <div className="preloader-bar" style={{ width: `${pct}%` }} />
      </div>
      <div className="preloader-pct font-mono-arc">{String(pct).padStart(3, "0")}%</div>
    </div>
  );
}
