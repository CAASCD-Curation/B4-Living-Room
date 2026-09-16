import type { ReactElement, SVGProps } from "react";

/* 家具线稿图标：全站共用的「线框语言」
 * 用于：首页展品小模型栏 / 预加载叠加图标 / 路由转场 */
export const FURNITURE_ITEMS = [
  { key: "sofa", label: "沙发" },
  { key: "table", label: "茶几" },
  { key: "lamp", label: "落地灯" },
  { key: "chair", label: "单椅" },
  { key: "shelf", label: "书架" },
  { key: "window", label: "窗" },
  { key: "tv", label: "电视" },
] as const;

export type FurnitureKey = (typeof FURNITURE_ITEMS)[number]["key"];

const PATHS: Record<FurnitureKey, ReactElement> = {
  sofa: (
    <>
      <path d="M10 23v-5a3 3 0 0 1 3-3h22a3 3 0 0 1 3 3v5" />
      <path d="M7 23h34a3 3 0 0 1 3 3v8H4v-8a3 3 0 0 1 3-3z" />
      <path d="M18 23v8M30 23v8" />
      <path d="M11 34v4M37 34v4" />
    </>
  ),
  table: (
    <>
      <path d="M6 20a18 5.5 0 0 0 36 0" />
      <path d="M12 24v14M36 24v14" />
      <path d="M15 32h18" />
    </>
  ),
  lamp: (
    <>
      <path d="M17 21l4-11h6l4 11z" />
      <path d="M24 21v17" />
      <path d="M17 40h14" />
    </>
  ),
  chair: (
    <>
      <path d="M15 9h4v16" />
      <path d="M15 25h19" />
      <path d="M19 25v15M34 25v15" />
    </>
  ),
  shelf: (
    <>
      <path d="M9 7h30v34H9z" />
      <path d="M9 18h30M9 29h30" />
      <path d="M13 29v-6M17 29v-8M21 29v-5" />
    </>
  ),
  window: (
    <>
      <path d="M9 7h30v34H9z" />
      <path d="M24 7v34M9 24h30" />
    </>
  ),
  tv: (
    <>
      <path d="M8 9h32v21H8z" />
      <path d="M24 30v6" />
      <path d="M16 40h16" />
    </>
  ),
};

export default function FurnitureIcon({
  name,
  ...props
}: { name: FurnitureKey } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {PATHS[name]}
    </svg>
  );
}

/* 供转场/预加载使用的小组合（含植物） */
export const STACK_ICONS: { name: FurnitureKey | "plant"; rot: number; tx: number; ty: number }[] = [
  { name: "sofa", rot: -6, tx: -5, ty: 3 },
  { name: "lamp", rot: 4, tx: 5, ty: -3 },
  { name: "window", rot: -3, tx: -3, ty: -5 },
  { name: "plant", rot: 7, tx: 4, ty: 4 },
  { name: "chair", rot: -5, tx: 0, ty: 0 },
];

export function PlantIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M17 33h14l-2.5 9h-9z" />
      <path d="M24 33v-10" />
      <path d="M24 23q-9-1-11-13" />
      <path d="M24 23q9-1 11-13" />
      <path d="M24 23q1-8 3-12" />
    </svg>
  );
}
