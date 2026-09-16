export type Category = "A" | "B" | "C" | "D";

export interface Work {
  id: string;
  cat: Category;
  name: string;
  source: string | null;
  desc: string | null;
  link: string | null;
  year: string | null;
  country: string | null;
  a1: string[]; // 边界与阈限
  a2: string[]; // 媒介与光源
  a3: string[]; // 礼制与阶级
  a4: string[]; // 情绪语法
  a5: string[]; // 去界与归真
  imgs: string[]; // 图像（可多张，空数组 = 待补）
}

export const CATEGORY_META: Record<Category, { label: string; en: string }> = {
  A: { label: "经典艺术", en: "Classic Art" },
  B: { label: "文学想象", en: "Literary" },
  C: { label: "社会素材", en: "Social" },
  D: { label: "形式联想", en: "Formal" },
};
