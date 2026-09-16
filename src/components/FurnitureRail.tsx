import { useNavigate } from "react-router";
import FurnitureIcon, { FURNITURE_ITEMS, FURNITURE_LINKS } from "./FurnitureIcons";

/* 左侧分类入口栏：与首页 3D 场景里的家具点击共用同一份映射 */
export default function FurnitureRail() {
  const navigate = useNavigate();

  return (
    <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center">
      <span className="rail-vertical font-mono-arc text-[9px] tracking-[0.35em] text-[var(--ink-soft)] mb-3">
        分类 · BROWSE
      </span>
      {FURNITURE_LINKS.map((l) => {
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
