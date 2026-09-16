import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Routes, Route, useLocation } from "react-router";
import Home from "./pages/Home";
import Atlas from "./pages/Atlas";
import System from "./pages/System";
import Cursor from "./components/Cursor";
import FurnitureIcon from "./components/FurnitureIcons";

/* 路由转场：墨色幕布自下而上扫过，三件家具线稿叠加浮现再退场 */
function RouteVeil() {
  const { pathname } = useLocation();
  const [phase, setPhase] = useState<"in" | "out" | "off">("off");
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setPhase("in");
    const t1 = setTimeout(() => setPhase("out"), 420);
    const t2 = setTimeout(() => setPhase("off"), 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  if (phase === "off") return null;
  return (
    <div className={`route-veil ${phase}`} aria-hidden>
      <div className="route-veil-panel">
        <div className="route-veil-icons">
          <FurnitureIcon name="sofa" style={{ "--d": "0.08s" } as CSSProperties} />
          <FurnitureIcon name="lamp" style={{ "--d": "0.18s" } as CSSProperties} />
          <FurnitureIcon name="window" style={{ "--d": "0.28s" } as CSSProperties} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="grain">
      <Cursor />
      <RouteVeil />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/atlas" element={<Atlas />} />
        <Route path="/system" element={<System />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}
