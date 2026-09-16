import { useNavigate } from "react-router";
import FurnitureIcon, { FURNITURE_ITEMS, type FurnitureKey } from "./FurnitureIcons";

/* 每件家具 = 一个分类入口：点击跳转到全部图志，并自动套用对应分类轴标签 */
const LINKS: { key: FurnitureKey; tag: string; axis: "a1" | "a2" | "a3" | "a4" | "a5" }[] = [
  { key: "sofa", tag: "座次秩序", axis: "a3" }, // 沙发 → 谁坐主位
  { key: "table", tag: "火塘", axis: "a2" }, // 茶几 → 围坐中心
  { key: "lamp", tag: "慵懒", axis: "a4" }, // 落地灯 → 慵懒情绪
  { key: "chair", tag: "消融型", axis: "a1" }, // 单椅 → 随处可坐
  { key: "shelf", tag: "功能置换", axis: "a5" }, // 书架 → 客厅=书房
  { key: "window", tag: "渗透型", axis: "a1" }, // 窗 → 半透明边界
  { key: "tv", tag: "电视", axis: "a2" }, // 电视 → 面向屏幕
];

export default function FurnitureRail() {
  const navigate = useNavigate();

  return (
    <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center">
      <span className="rail-vertical font-mono-arc text-[9px] tracking-[0.35em] text-[var(--ink-soft)] mb-3">
        分类 · BROWSE
      </span>
      {LINKS.map((l) => {
        const item = FURNITURE_ITEMS.find((f) => f.key === l.key)!;
        return (
          <button
            key={l.key}
            onClick={() => navigate(`/atlas?axis=${l.axis}&tag=${encodeURIComponent(l.tag)}`)}
            title={`${item.label} → ${l.tag}`}
            aria-label={`按${l.tag}检索`}
            className="rail-btn"
          >
            <FurnitureIcon name={l.key} className="w-7 h-7" />
            <span className="rail-label">{l.tag}</span>
          </button>
        );
      })}
    </div>
  );
}
