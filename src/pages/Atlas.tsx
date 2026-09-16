import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import Nav from "@/components/Nav";
import WorkModal from "@/components/WorkModal";
import ImgSlider from "@/components/ImgSlider";
import { works } from "@/data/works";
import type { Work } from "@/types/work";
import { AXES } from "@/data/system";

type ViewMode = "grid" | "list";

/* 由 id 生成确定性伪随机数 */
function hashRand(id: string, salt: number) {
  let h = salt;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffff;
  return (h % 1000) / 1000;
}

/* 散落卡片 */
function WorkCard({ work, onOpen, salt }: { work: Work; onOpen: (w: Work) => void; salt: number }) {
  const rot = (hashRand(work.id, salt) - 0.5) * 10; // -5° ~ 5°
  const jx = (hashRand(work.id, salt * 2 + 1) - 0.5) * 26;
  const jy = (hashRand(work.id, salt * 3 + 7) - 0.5) * 18;
  const z = Math.round(hashRand(work.id, salt * 5 + 3) * 20);

  const chips = [
    ...work.a1.map((t): [string, string] => [t, "var(--ax1)"]),
    ...work.a2.map((t): [string, string] => [t, "var(--ax2)"]),
    ...work.a3.map((t): [string, string] => [t, "var(--ax3)"]),
    ...work.a4.map((t): [string, string] => [t, "var(--ax4)"]),
    ...work.a5.map((t): [string, string] => [t, "var(--ax5)"]),
  ].slice(0, 3);

  return (
    <div
      className="work-card group relative bg-[#faf7ef] p-2 pb-3 border border-[var(--ink)]/15 shadow-md"
      style={{ transform: `rotate(${rot}deg) translate(${jx}px, ${jy}px)`, zIndex: z }}
      onClick={() => onOpen(work)}
    >
      {/* 档案角标 */}
      <span className="absolute -top-2 -right-1 z-10 bg-[var(--cinnabar)] text-[var(--paper)] font-mono-arc text-[9px] px-1.5 py-0.5 rotate-3 shadow-sm">
        {work.id}
      </span>
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--paper-deep)]">
        {work.imgs.length > 0 ? (
          <ImgSlider imgs={work.imgs} alt={work.name} />
        ) : (
          <div className="placeholder-tile w-full h-full flex flex-col items-center justify-center">
            <span className="font-mono-arc text-xl font-bold text-[var(--ink)]/25">{work.id}</span>
            <span className="font-mono-arc text-[9px] tracking-[0.25em] text-[var(--ink)]/35 mt-1.5">IMAGE TBD</span>
          </div>
        )}
        {/* 悬停滑出：分类轴标签 */}
        {chips.length > 0 && (
          <div className="card-chips">
            {chips.map(([t, c]) => (
              <span key={t} className="card-chip" style={{ color: c }}>
                <i />{t}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="mt-2 px-0.5 flex items-baseline justify-between gap-2">
        <span className="font-serif-sc font-bold text-[13px] leading-tight line-clamp-1">{work.name}</span>
        <span className="font-mono-arc text-[10px] text-[var(--ink-soft)] shrink-0">{work.year ?? "—"}</span>
      </div>
    </div>
  );
}

/* 轴筛选下拉 */
function AxisFilter({
  axisIndex,
  selected,
  onToggle,
}: {
  axisIndex: number;
  selected: string[];
  onToggle: (axisKey: string, tag: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ax = AXES[axisIndex];

  const tags = useMemo(() => {
    const counter = new Map<string, number>();
    works.forEach((w) => {
      const arr = [w.a1, w.a2, w.a3, w.a4, w.a5][axisIndex];
      arr.forEach((t) => counter.set(t, (counter.get(t) ?? 0) + 1));
    });
    return [...counter.entries()].sort((a, b) => b[1] - a[1]);
  }, [axisIndex]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs rounded-full transition-colors ${
          selected.length
            ? "border-current font-medium"
            : "border-[var(--ink)]/25 text-[var(--ink-soft)] hover:border-[var(--ink)]/60"
        }`}
        style={selected.length ? { color: ax.color } : undefined}
      >
        {ax.no} {ax.name}
        {selected.length > 0 && <span className="font-mono-arc">({selected.length})</span>}
        <span className={`text-[9px] transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute z-40 top-full mt-2 left-0 w-64 max-h-72 overflow-y-auto bg-[var(--paper)] border border-[var(--ink)]/20 shadow-xl p-2">
            <p className="px-2 py-1.5 text-[10px] text-[var(--ink-soft)] font-mono-arc tracking-widest border-b border-[var(--ink)]/10 mb-1">
              {ax.question}
            </p>
            {tags.map(([tag, count]) => {
              const on = selected.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => onToggle(ax.key, tag)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-sm text-left transition-colors ${
                    on ? "font-medium" : "hover:bg-[var(--ink)]/5"
                  }`}
                  style={on ? { color: ax.color, background: "rgba(27,23,18,0.05)" } : undefined}
                >
                  <span>
                    {on && "● "}
                    {tag}
                  </span>
                  <span className="font-mono-arc text-[10px] text-[var(--ink-soft)]">{count}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default function Atlas() {
  const [view, setView] = useState<ViewMode>("grid");
  const [axisFilter, setAxisFilter] = useState<Record<string, string[]>>({});
  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState<Work | null>(null);
  const [salt, setSalt] = useState(7);
  const [searchParams, setSearchParams] = useSearchParams();
  /* 密度滑块：卡片最小宽度 120(最密) ~ 320px(最大) */
  const [cardMin, setCardMin] = useState(190);

  /* 从首页分类入口跳入：?axis=a3&tag=座次秩序 → 自动套用该标签筛选 */
  useEffect(() => {
    const axis = searchParams.get("axis");
    const tag = searchParams.get("tag");
    if (tag && axis && ["a1", "a2", "a3", "a4", "a5"].includes(axis)) {
      setAxisFilter({ [axis]: [tag] });
    }
    if (axis || tag) setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  /* 掷签：从当前筛选结果中随机打开一件 */
  const drawOne = () => {
    if (!filtered.length) return;
    setOpened(filtered[Math.floor(Math.random() * filtered.length)]);
  };

  const toggleAxisTag = (axisKey: string, tag: string) => {
    setAxisFilter((prev) => {
      const cur = prev[axisKey] ?? [];
      const next = cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag];
      const out = { ...prev, [axisKey]: next };
      if (!next.length) delete out[axisKey];
      return out;
    });
  };

  const filtered = useMemo(() => {
    return works.filter((w) => {
      for (const [axisKey, tags] of Object.entries(axisFilter)) {
        const arr = w[axisKey as "a1" | "a2" | "a3" | "a4" | "a5"];
        if (!tags.some((t) => arr.includes(t))) return false;
      }
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const hay = `${w.name} ${w.source ?? ""} ${w.country ?? ""} ${w.year ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [axisFilter, query]);

  const activeTags = Object.entries(axisFilter).flatMap(([k, ts]) => ts.map((t) => ({ axisKey: k, tag: t })));

  return (
    <div className="min-h-screen blueprint-bg">
      <Nav />

      <div className="pt-24 px-5 md:px-10 pb-24 max-w-[1500px] mx-auto">
        {/* 标题行 */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[var(--ink)] pb-4">
          <div>
            <h1 className="font-serif-sc font-black text-4xl md:text-6xl leading-none">全部图志</h1>
            <p className="font-mono-arc text-[10px] tracking-[0.35em] text-[var(--ink-soft)] mt-2">
              ALL ENTRIES · {filtered.length} / {works.length}
            </p>
          </div>

          {/* 网格 / 列表切换 + 掷签 + 重新散落 */}
          <div className="flex items-center gap-2">
            <button
              onClick={drawOne}
              disabled={!filtered.length}
              title="从当前结果中随机打开一件"
              className="px-4 py-1.5 border border-[var(--cinnabar)] text-[var(--cinnabar)] text-xs tracking-widest font-medium rounded-full hover:bg-[var(--cinnabar)] hover:text-[var(--paper)] transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              掷签 ↻
            </button>
            {view === "grid" && (
              <button
                onClick={() => setSalt((s) => s + 1)}
                title="重新随机散落卡片"
                className="px-4 py-1.5 border border-[var(--ink)]/30 text-[var(--ink-soft)] text-xs tracking-widest rounded-full hover:border-[var(--ink)] hover:text-[var(--ink)] transition-all"
              >
                重新散落
              </button>
            )}
            {/* 密度滑块：左右滑动控制卡片大小与资料密度 */}
            {view === "grid" && (
              <div className="flex items-center gap-2 px-1" title="资料密度 / 卡片大小">
                <span className="text-[10px] font-mono-arc tracking-widest text-[var(--ink-soft)]">密</span>
                <input
                  type="range"
                  min={120}
                  max={320}
                  step={10}
                  value={cardMin}
                  onChange={(e) => setCardMin(Number(e.target.value))}
                  className="atlas-slider w-28 md:w-36"
                  aria-label="资料密度"
                />
                <span className="text-[10px] font-mono-arc tracking-widest text-[var(--ink-soft)]">大</span>
              </div>
            )}
            <div className="flex items-center gap-1 border border-[var(--ink)]/25 rounded-full p-1">
              {(
                [
                  { k: "grid", label: "网格" },
                  { k: "list", label: "列表" },
                ] as { k: ViewMode; label: string }[]
              ).map((v) => (
                <button
                  key={v.k}
                  onClick={() => setView(v.k)}
                  className={`px-4 py-1.5 rounded-full text-xs tracking-widest font-medium transition-all ${
                    view === v.k ? "bg-[var(--ink)] text-[var(--paper)]" : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 筛选区：按 5 条分类轴检索（不再按 A/B/C/D 分类） */}
        <div className="mt-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono-arc tracking-widest text-[var(--ink-soft)] mr-1">分类轴 →</span>
            {AXES.map((ax, i) => (
              <AxisFilter key={ax.key} axisIndex={i} selected={axisFilter[ax.key] ?? []} onToggle={toggleAxisTag} />
            ))}
            {activeTags.length > 0 && (
              <button
                onClick={() => setAxisFilter({})}
                className="text-xs text-[var(--cinnabar)] underline underline-offset-4 ml-2"
              >
                清空筛选
              </button>
            )}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="检索名称 / 出处 / 地区…"
              className="ml-auto bg-transparent border-b border-[var(--ink)]/30 focus:border-[var(--cinnabar)] outline-none text-sm px-1 py-1.5 w-52 placeholder:text-[var(--ink-soft)]/60"
            />
          </div>

          {activeTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {activeTags.map(({ axisKey, tag }) => {
                const ax = AXES.find((a) => a.key === axisKey)!;
                return (
                  <button
                    key={axisKey + tag}
                    onClick={() => toggleAxisTag(axisKey, tag)}
                    className="axis-tag"
                    style={{ color: ax.color }}
                  >
                    {tag} ×
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 内容区 */}
        {filtered.length === 0 ? (
          <div className="py-32 text-center text-[var(--ink-soft)]">
            <p className="font-serif-sc text-2xl">没有匹配的条目</p>
            <p className="text-sm mt-2">试试清空筛选或换个关键词</p>
          </div>
        ) : view === "grid" ? (
          <div
            className="mt-12 grid gap-x-6 gap-y-12"
            style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${cardMin}px, 1fr))` }}
          >
            {filtered.map((w) => (
              <WorkCard key={w.id} work={w} onOpen={setOpened} salt={salt} />
            ))}
          </div>
        ) : (
          <div className="mt-8 border-t border-[var(--ink)]/20">
            <div className="hidden md:grid grid-cols-[90px_1.4fr_1.6fr_90px_120px_60px] gap-4 px-3 py-2.5 font-mono-arc text-[10px] tracking-widest text-[var(--ink-soft)] border-b border-[var(--ink)]/20">
              <span>编号</span>
              <span>名称</span>
              <span>出处</span>
              <span>时间</span>
              <span>国家（民族）</span>
              <span>图像</span>
            </div>
            {filtered.map((w) => (
              <button
                key={w.id}
                onClick={() => setOpened(w)}
                className="archive-row w-full grid grid-cols-[70px_1fr_50px] md:grid-cols-[90px_1.4fr_1.6fr_90px_120px_60px] gap-4 px-3 py-3 text-left border-b border-[var(--ink)]/10 items-baseline"
              >
                <span className="font-mono-arc text-[11px] text-[var(--ink-soft)]">{w.id}</span>
                <span className="font-serif-sc font-bold text-[15px]">{w.name}</span>
                <span className="hidden md:block text-xs text-[var(--ink-soft)] line-clamp-1">{w.source ?? "—"}</span>
                <span className="hidden md:block font-mono-arc text-[11px]">{w.year ?? "—"}</span>
                <span className="hidden md:block text-xs">{w.country ?? "—"}</span>
                <span
                  className={`font-mono-arc text-[10px] text-right md:text-left ${
                    w.imgs.length > 0 ? "text-[var(--ax4)]" : "text-[var(--ink)]/30"
                  }`}
                >
                  {w.imgs.length > 0 ? `●${w.imgs.length > 1 ? `×${w.imgs.length}` : ""}` : "○"}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {opened && <WorkModal work={opened} onClose={() => setOpened(null)} />}
    </div>
  );
}
