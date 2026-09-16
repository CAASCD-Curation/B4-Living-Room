import FurnitureIcon, { FURNITURE_ITEMS, type FurnitureKey } from "./FurnitureIcons";

/* 封面右侧「展品」小模型栏：线稿家具图标，点击 → 主场景对应家具描红聚焦 */
export default function FurnitureRail({
  active,
  onPick,
}: {
  active: FurnitureKey | null;
  onPick: (k: FurnitureKey) => void;
}) {
  return (
    <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center">
      <span className="rail-vertical font-mono-arc text-[9px] tracking-[0.35em] text-[var(--ink-soft)] mb-3">
        展品 · INDEX
      </span>
      {FURNITURE_ITEMS.map((it) => (
        <button
          key={it.key}
          onClick={() => onPick(it.key)}
          title={it.label}
          aria-label={`聚焦${it.label}`}
          className={`rail-btn ${active === it.key ? "is-active" : ""}`}
        >
          <FurnitureIcon name={it.key} className="w-7 h-7" />
          <span className="rail-label">{it.label}</span>
        </button>
      ))}
    </div>
  );
}
