import { useEffect, useRef, useState } from "react";
import SofaStage from "@/components/SofaStage";
import Nav from "@/components/Nav";
import Building from "@/components/Building";
import Preloader from "@/components/Preloader";

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [coverGone, setCoverGone] = useState(false);
  const [booted, setBooted] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  /* entered 状态同步到 body（独立 effect，避免被清理函数误删） */
  useEffect(() => {
    document.body.classList.toggle("entered", entered);
    return () => document.body.classList.remove("entered");
  }, [entered]);

  /* 过渡动画结束后卸载封面场景，释放性能 */
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

      {/* 封面：沙发星环档案（滚轮切换年代 · 拖拽旋转 · 点击阅读） */}
      {!coverGone && (
        <div className="cover">
          <SofaStage onEnter={enter} />
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
