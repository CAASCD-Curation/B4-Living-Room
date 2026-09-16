import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Atlas from "./pages/Atlas";
import System from "./pages/System";

export default function App() {
  return (
    <div className="grain">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/atlas" element={<Atlas />} />
        <Route path="/system" element={<System />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}
