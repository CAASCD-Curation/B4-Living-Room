import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Atlas from "./pages/Atlas";
import System from "./pages/System";
import Cursor from "./components/Cursor";

export default function App() {
  return (
    <div className="grain">
      <Cursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/atlas" element={<Atlas />} />
        <Route path="/system" element={<System />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}
