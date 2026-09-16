import { useNavigate, useLocation } from "react-router";

const LINKS = [
  { to: "/", zh: "首页", en: "HOME" },
  { to: "/atlas", zh: "全部图志", en: "ATLAS" },
  { to: "/system", zh: "分类体系", en: "SYSTEM" },
];

export default function Nav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-5 md:px-10 h-16">
        <button
          onClick={() => navigate("/")}
          className="flex items-baseline gap-2 group"
          aria-label="客厅图志"
        >
          <span className="font-serif-sc font-black text-xl tracking-tight group-hover:text-[var(--cinnabar)] transition-colors">
            客厅图志
          </span>
          <span className="font-mono-arc text-[10px] tracking-widest text-[var(--ink-soft)] hidden sm:inline">
            LIVING ROOM ATLAS
          </span>
        </button>

        <nav className="flex items-center gap-5 md:gap-9">
          {LINKS.map((l) => {
            const active = pathname === l.to;
            return (
              <button
                key={l.to}
                onClick={() => navigate(l.to)}
                className="flex items-center gap-1.5 text-[13px] md:text-sm font-medium tracking-wide"
              >
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full bg-[var(--cinnabar)] transition-opacity ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
                <span className={active ? "" : "text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"}>
                  {l.zh}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
