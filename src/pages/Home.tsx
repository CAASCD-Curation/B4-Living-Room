import { useEffect, useRef, useState } from "react";
import Scene3D from "@/components/Scene3D";
import Nav from "@/components/Nav";
import Building from "@/components/Building";
import Preloader from "@/components/Preloader";
import FurnitureRail from "@/components/FurnitureRail";
import { works } from "@/data/works";

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

  const enter = () => {
    setEntered(true);
    // 进入后让浏览器回到页面顶部，保证从 6F 开始
    requestAnimationFrame(() => window.scrollTo(0, 0));
  };

  return (
    <div ref={wrapRef} className={`home-wrap ${entered ? "is-entered" : ""}`}>
      {!booted && <Preloader onDone={() => setBooted(true)} />}
      <Nav />

      {/* 封面：可探索的网格旷野（滚轮缩放 / 拖拽平移 / 点击家具进分类） */}
      {!coverGone && (
      <div className="cover">
        <div className="absolute inset-0">
          <Scene3D onEnter={enter} />
        </div>
        <FurnitureRail />
        <div className="absolute bottom-0 left-0 right-0 z-10 px-5 md:px-10 pb-5">
          <div className="flex items-end justify-between text-xs md:text-sm">
            <div className="font-medium text-[var(--ink-soft)]">
              <div>一座关于「客厅」的概念档案</div>
              <div className="font-mono-arc text-[10px] tracking-widest mt-1 opacity-70">滚轮缩放 · 放到最大再往下滚进入楼层 · 点击家具进分类</div>
            </div>
            <div className="text-center font-mono-arc text-[11px] tracking-widest">
              <span className="text-[var(--cinnabar)] font-bold">{works.length}</span> 条目
              <span className="mx-2 opacity-40">/</span>
              {imgCount} 图像
            </div>
            <button
              onClick={enter}
              className="flex items-center gap-2 font-medium text-[var(--ink-soft)] hover:text-[var(--cinnabar)] transition-colors"
            >
              进入楼层图志
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
