import { useEffect, useState, type CSSProperties } from "react";
import FurnitureIcon, { STACK_ICONS, PlantIcon } from "./FurnitureIcons";

/* 首屏预加载：品牌字逐字浮现 + 家具线稿图标「叠加加载」+ 细进度条 + 百分比，
 * 完成后图标散开、面板上滑退出
 * （参考 thisplaceofmine 的叠加式加载与旧版档案馆的进度条） */
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
      <div className="preloader-stack">
        {STACK_ICONS.map((ic, i) => {
          const style = {
            "--d": `${0.2 + i * 0.14}s`,
            "--rot": `${ic.rot}deg`,
          } as CSSProperties;
          return ic.name === "plant" ? (
            <PlantIcon key={i} style={style} />
          ) : (
            <FurnitureIcon key={i} name={ic.name} style={style} />
          );
        })}
      </div>
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
