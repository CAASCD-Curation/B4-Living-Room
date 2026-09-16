import { useEffect, useState } from "react";
import type { Work } from "@/types/work";
import { CATEGORY_META } from "@/types/work";
import ImgSlider from "@/components/ImgSlider";

interface Props {
  work: Work;
  accent: string; // 当前楼层强调色
}

/** 剖面房间：带窗框/玻璃反光/厚墙阴影；点击触发 3D 翻转卡片 */
export default function RoomCell({ work, accent }: Props) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    return () => {
      window.dispatchEvent(new CustomEvent("atlas-cursor", { detail: { color: null } }));
    };
  }, []);

  const meta = CATEGORY_META[work.cat];
  const axes: Array<[string, string[]]> = [
    ["边界", work.a1],
    ["媒介", work.a2],
    ["礼制", work.a3],
    ["情绪", work.a4],
  ];

  return (
    <div className="room-scene shrink-0 select-none" onClick={() => setFlipped((f) => !f)}>
      <div className={`room-card ${flipped ? "is-flipped" : ""}`}>
        {/* 正面：剖面窗户 */}
        <div
          className="room-face room-front"
          onPointerEnter={() => window.dispatchEvent(new CustomEvent("atlas-cursor", { detail: { color: accent } }))}
          onPointerLeave={() => window.dispatchEvent(new CustomEvent("atlas-cursor", { detail: { color: null } }))}
        >
          <div className="room-wall">
            <div className="room-window">
              {work.imgs.length > 0 ? (
                <img src={work.imgs[0]} alt={work.name} loading="lazy" draggable={false} className="room-view" />
              ) : (
                <div className="room-view room-view--empty">
                  <span className="font-mono-arc text-[10px] tracking-widest">{work.id}</span>
                </div>
              )}
              <div className="room-glass" />
              <div className="room-frame-h" />
              <div className="room-frame-v" />
              <div className="room-sill" />
            </div>
            <div className="room-caption">
              <span className="room-name">{work.name}</span>
              <span className="room-meta">
                {meta?.label} · {work.year}
              </span>
            </div>
          </div>
        </div>

        {/* 背面：作品信息 */}
        <div className="room-face room-back" style={{ borderColor: accent }}>
          <div className="room-back-head" style={{ color: accent }}>
            <span className="font-mono-arc text-[10px] tracking-widest">{work.id} · {meta?.label}</span>
            <h3 className="room-back-title">{work.name}</h3>
            <div className="room-back-sub">{work.year} · {work.country}</div>
          </div>
          <p className="room-back-desc">{work.desc}</p>
          <div className="room-back-axes">
            {axes.filter(([, v]) => v.length > 0).map(([label, vals]) => (
              <div key={label} className="room-back-axis">
                <span className="room-back-axis-label">{label}</span>
                <span className="room-back-axis-vals">{vals.join(" / ")}</span>
              </div>
            ))}
          </div>
          {work.imgs.length > 1 && (
            <div className="room-back-imgs" onClick={(e) => e.stopPropagation()}>
              <ImgSlider imgs={work.imgs} alt={work.name} eager imgClassName="object-cover" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
