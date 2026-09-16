import { useEffect, useState } from "react";
import { floors } from "@/data/floors";
import FloorSection from "@/components/FloorSection";

/** 多层建筑剖面：纵向滚动吸附楼层，当前楼层指示 */
export default function Building() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".floor-section"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = sections.indexOf(e.target as HTMLElement);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { threshold: 0.55 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div className="building">
      {/* 楼层指示条 */}
      <nav className="building-rail">
        {floors.map((f, i) => (
          <button
            key={f.id}
            className={`building-rail-dot ${i === active ? "is-active" : ""}`}
            style={i === active ? { backgroundColor: f.color, borderColor: f.color } : undefined}
            onClick={() => document.querySelectorAll(".floor-section")[i]?.scrollIntoView({ behavior: "smooth" })}
            aria-label={f.id}
          >
            <span className="building-rail-label" style={i === active ? { color: f.color } : undefined}>{f.id}</span>
          </button>
        ))}
      </nav>
      {floors.map((f, i) => (
        <FloorSection key={f.id} floor={f} inset={i * 26} />
      ))}
    </div>
  );
}
