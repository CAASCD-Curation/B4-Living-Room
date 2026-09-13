import Nav from "@/components/Nav";
import { AXES, MATRIX_DIM1, MATRIX_DIM2, MATRIX_CELLS, EMOTIONS, PIPELINE } from "@/data/system";

export default function System() {
  return (
    <div className="min-h-screen blueprint-bg">
      <Nav />

      {/* 超大标题区 */}
      <section className="pt-28 md:pt-36 px-5 md:px-10">
        <h1 className="font-serif-sc font-black text-[22vw] md:text-[15vw] leading-[0.95] tracking-tight">
          分类体系
        </h1>
        <div className="mt-6 flex flex-wrap justify-between gap-4 border-t-2 border-[var(--ink)] pt-4 pb-10">
          <p className="font-mono-arc text-[10px] md:text-xs tracking-[0.3em] text-[var(--ink-soft)]">
            CONCEPT MAP · 4×4 MATRIX · 32 EMOTIONS
          </p>
          <p className="font-mono-arc text-[10px] md:text-xs tracking-[0.3em] text-[var(--ink-soft)]">
            概念地图 · 双维判定 · 情绪极性
          </p>
        </div>
      </section>

      {/* 概念核心 */}
      <section className="px-5 md:px-10 pb-20 max-w-[1500px] mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="border border-[var(--ink)]/20 bg-[var(--paper-deep)] p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-36 h-36 rounded-full bg-[var(--ink)] text-[var(--paper)]">
              <div>
                <div className="font-serif-sc font-black text-3xl">客厅</div>
                <div className="font-mono-arc text-[9px] tracking-widest mt-1 opacity-70">LIVING ROOM</div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {["场域", "聚集", "软功能", "社交", "归真", "去界"].map((t) => (
                <span key={t} className="axis-tag text-[var(--ink)]">{t}</span>
              ))}
            </div>
            <p className="mt-6 text-xs text-[var(--ink-soft)] font-mono-arc tracking-wider">
              半围合 · 非必要 —— 校验：卧室 / 厨房 / 咖啡馆 / 村口大树
            </p>
          </div>
          <div className="space-y-6">
            <p className="font-serif-sc text-xl md:text-2xl leading-relaxed">
              「客厅」不是一个房间，而是一组关系：<span className="text-[var(--cinnabar)]">边界</span>如何围合、
              <span className="text-[var(--cinnabar)]">身体</span>朝向谁、<span className="text-[var(--cinnabar)]">谁</span>
              被允许坐在哪里、<span className="text-[var(--cinnabar)]">什么情绪</span>可以发生，以及——当它被
              <span className="text-[var(--cinnabar)]">打破</span>之后，还剩下什么。
            </p>
            <p className="text-sm leading-loose text-[var(--ink-soft)]">
              本体系以五条分类轴为骨架，为 200 条素材（经典艺术 / 文学想象 / 社会素材 / 形式联想，各 50 条）建立多维坐标。每条素材先经本体判定，再在各轴上「能挂才挂、可多选」，空轴不等于错误。
            </p>
            <div className="border border-[var(--ink)]/20 p-5">
              <p className="font-medium text-sm text-[var(--cinnabar)]">挂标规则</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                ①–⑤ 能挂才挂 · 可多选；允许同轴重复挂 · 空轴 ≠ 错误；负边界 / 非住宅 → ⑤ 承接。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 五条分类轴 */}
      <section className="px-5 md:px-10 pb-24 max-w-[1500px] mx-auto">
        <h2 className="font-mono-arc text-xs tracking-[0.35em] text-[var(--ink-soft)] mb-8">
          AXES IN DETAIL · 分类轴展开
        </h2>
        <div className="space-y-0 border-t-2 border-[var(--ink)]">
          {AXES.map((ax) => (
            <div key={ax.key} className="grid md:grid-cols-[120px_1fr_1.2fr] gap-4 md:gap-8 py-8 border-b border-[var(--ink)]/15">
              <div className="font-serif-sc font-black text-4xl md:text-5xl" style={{ color: ax.color }}>
                {ax.no}
              </div>
              <div>
                <h3 className="font-serif-sc font-black text-2xl md:text-3xl">{ax.name}</h3>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">{ax.question}</p>
              </div>
              <div className="flex flex-wrap gap-2 content-start">
                {ax.tags.map((t) => (
                  <div key={t.label} className="axis-tag !py-2 !px-3" style={{ color: ax.color }} title={t.note}>
                    <span className="text-xs font-medium">{t.label}</span>
                    {t.note && <span className="block mt-1 opacity-70 text-[10px] font-normal">{t.note}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4×4 矩阵 */}
      <section className="px-5 md:px-10 pb-24 max-w-[1500px] mx-auto">
        <h2 className="font-mono-arc text-xs tracking-[0.35em] text-[var(--ink-soft)] mb-2">
          4 × 4 MATRIX · 边界与阈限判定矩阵
        </h2>
        <p className="text-sm text-[var(--ink-soft)] mb-8">
          二级标签 = 第一维（边界封闭程度）× 第二维（空间组织逻辑），记法为「第一维-第二维」
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[760px]">
            <thead>
              <tr>
                <th className="border border-[var(--ink)]/20 p-3 text-left text-xs font-mono-arc tracking-wider text-[var(--ink-soft)] bg-[var(--paper-deep)]">
                  封闭程度 ↓ / 组织逻辑 →
                </th>
                {MATRIX_DIM2.map((d) => (
                  <th key={d.label} className="border border-[var(--ink)]/20 p-3 text-center bg-[var(--paper-deep)]">
                    <div className="font-serif-sc font-bold">{d.label}</div>
                    <div className="text-[10px] text-[var(--ink-soft)] mt-0.5">{d.note}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX_DIM1.map((d, i) => (
                <tr key={d.label}>
                  <th className="border border-[var(--ink)]/20 p-3 text-left bg-[var(--paper-deep)]">
                    <div className="font-serif-sc font-bold text-[var(--ax1)]">{d.label}</div>
                    <div className="text-[10px] text-[var(--ink-soft)] mt-0.5 font-normal">{d.note}</div>
                  </th>
                  {MATRIX_CELLS[i].map((cell, j) => (
                    <td key={j} className="border border-[var(--ink)]/20 p-3 text-sm text-center align-middle">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 32 情绪 */}
      <section className="px-5 md:px-10 pb-24 max-w-[1500px] mx-auto">
        <h2 className="font-mono-arc text-xs tracking-[0.35em] text-[var(--ink-soft)] mb-8">
          32 EMOTIONS · 情绪语法（按极性归档）
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {EMOTIONS.map((g, gi) => (
            <div
              key={g.polarity}
              className="border border-[var(--ink)]/20 p-6"
              style={{ background: gi === 0 ? "#e9ecdf" : gi === 1 ? "#e7e2d5" : "#ecdfd7" }}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-serif-sc font-black text-xl">{g.polarity}</span>
                <span className="font-mono-arc text-xs text-[var(--ink-soft)]">×{g.count}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {g.words.map((w) => (
                  <span key={w} className="axis-tag text-[var(--ink)]">{w}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 标注流程 */}
      <section className="px-5 md:px-10 pb-24 max-w-[1500px] mx-auto">
        <h2 className="font-mono-arc text-xs tracking-[0.35em] text-[var(--ink-soft)] mb-8">
          TAGGING PIPELINE · 标注流程
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {PIPELINE.map((p, i) => (
            <div key={p.step} className="relative border border-[var(--ink)]/20 p-6">
              <span className="font-mono-arc text-[10px] tracking-widest text-[var(--cinnabar)]">{p.step}</span>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">{p.desc}</p>
              {i < 2 && (
                <span className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 text-[var(--ink-soft)]">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 页脚 */}
      <footer className="px-5 md:px-10 pb-8 max-w-[1500px] mx-auto">
        <div className="border-t border-[var(--ink)]/15 pt-4 flex flex-wrap justify-between gap-2 font-mono-arc text-[10px] tracking-widest text-[var(--ink-soft)]">
          <span>客厅图志 LIVING ROOM ATLAS · 标签体系 v2</span>
          <span>数据库：200 条 = 50 母题 × 4 形态（A 经典艺术 / B 文学想象 / C 社会素材 / D 形式联想）</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}
