export interface Axis {
  no: string;
  key: "a1" | "a2" | "a3" | "a4" | "a5";
  name: string;
  question: string;
  color: string;
  tags: { label: string; note?: string }[];
}

export const AXES: Axis[] = [
  {
    no: "①",
    key: "a1",
    name: "边界与阈限",
    question: "这还算不算一个「客厅」？边界多透？",
    color: "var(--ax1)",
    tags: [
      { label: "封闭型", note: "四墙一门，内外二分" },
      { label: "半开放型", note: "垭口/推拉门，可开可合" },
      { label: "渗透型", note: "材质/家具暗示分区" },
      { label: "消融型", note: "功能弥散，随处可坐" },
    ],
  },
  {
    no: "②",
    key: "a2",
    name: "媒介与光源",
    question: "聚在一起的人，身体朝向谁/什么？",
    color: "var(--ax2)",
    tags: [
      { label: "火塘", note: "围坐 · 平等" },
      { label: "壁炉", note: "家主坐侧 · hygge" },
      { label: "窗光", note: "侧坐出神 · 维米尔" },
      { label: "电视", note: "庄严面向屏幕" },
      { label: "多屏", note: "各看各 · 去中心化" },
      { label: "AI · 投影", note: "白墙即界面" },
    ],
  },
  {
    no: "③",
    key: "a3",
    name: "礼制与阶级",
    question: "谁坐主位、谁立于门槛外、谁根本进不来？",
    color: "var(--ax3)",
    tags: [
      { label: "座次秩序", note: "位置 = 等级，正对门为尊" },
      { label: "权力过滤", note: "双门 · 玄关 · 影壁" },
      { label: "性别/主仆界限", note: "女人客厅 · 《玩偶之家》" },
      { label: "阶级表演", note: "Salon · 展示性待客" },
      { label: "装饰即宣言", note: "族徽 · 祖先像 · 书法" },
    ],
  },
  {
    no: "④",
    key: "a4",
    name: "情绪语法",
    question: "什么情绪被允许在这个空间发生？",
    color: "var(--ax4)",
    tags: [
      { label: "正面 ×12", note: "自由 宁静 治愈 慵懒 温情 浪漫 庄严 惬意 安然 柔软 满足 释然" },
      { label: "中性 ×7", note: "虚荣 暧昧 荒诞 尴尬 空洞 伪装 自嘲" },
      { label: "负面 ×13", note: "压抑 焦虑 悲凉 虚无 孤寂 疏离 感伤 迷惘 忧郁 窒息 冷漠 疲惫 惶恐" },
    ],
  },
  {
    no: "⑤",
    key: "a5",
    name: "去界与归真",
    question: "客厅被打破、推到极限之后变成了什么？",
    color: "var(--ax5)",
    tags: [
      { label: "布局拆解", note: "无固定 C 位，沙发不朝电视" },
      { label: "功能置换", note: "客厅 = 书房 · 健身房" },
      { label: "边界消融", note: "客厅 → LDK → 全屋" },
      { label: "拒绝表演", note: "不为「客来用」而布置" },
      { label: "负边界 · 非住宅", note: "走廊 · 后室 · 村口大树" },
    ],
  },
];

export const MATRIX_DIM1 = [
  { label: "封闭型", note: "四墙一门，内外二分" },
  { label: "半开放型", note: "垭口/推拉门，可开可合" },
  { label: "渗透型", note: "材质/家具暗示分区" },
  { label: "消融型", note: "功能弥散，随处可坐" },
];

export const MATRIX_DIM2 = [
  { label: "向心式", note: "家具朝向一个中心" },
  { label: "轴线式", note: "沿中轴展开，有正背面" },
  { label: "漫游式", note: "无固定焦点，自由停留" },
  { label: "靠边式", note: "活动沿墙，中间留空" },
];

export const MATRIX_CELLS: string[][] = [
  ["堂屋 · 正厅", "堂屋 · 会客厅", "现代画室", "靠墙沙发 + 书墙"],
  ["Loft 夹层", "和室 + 缘侧", "咖啡馆 · 样板房", "走廊式客厅 · 飘窗"],
  ["LDK 沙发围合区", "开放户型的轴线客厅", "全开放生活区", "学习型客厅"],
  ["城市广场 · 火塘", "房车 · 邮轮中庭", "虚拟客厅", "走廊化合租屋"],
];

export const EMOTIONS = [
  {
    polarity: "正面",
    count: 12,
    words: ["自由", "宁静", "治愈", "慵懒", "温情", "浪漫", "庄严", "惬意", "安然", "柔软", "满足", "释然"],
  },
  {
    polarity: "中性",
    count: 7,
    words: ["虚荣", "暧昧", "荒诞", "尴尬", "空洞", "伪装", "自嘲"],
  },
  {
    polarity: "负面",
    count: 13,
    words: ["压抑", "焦虑", "悲凉", "虚无", "孤寂", "疏离", "感伤", "迷惘", "忧郁", "窒息", "冷漠", "疲惫", "惶恐"],
  },
];

export const PIPELINE = [
  {
    step: "STEP 1 · 元数据",
    desc: "名称 · 类型 · 时间 · 作者/来源 · 国家（民族）＋ 出处证据。五项必填，是检索骨架；时间用区间，不详须注明。",
  },
  {
    step: "STEP 2 · 本体判定",
    desc: "场域 ＋ 聚集 ＋ 在住宅内 ⇒ 进本体库，先定 ①。负边界 / 非住宅 ⇒ 移交 ⑤ 承接，检索中保留。",
  },
  {
    step: "STEP 3 · 分类标签",
    desc: "①–⑤ 能挂才挂 · 可多选 · 允许同轴重复挂。空轴 ≠ 错误；每条素材同时挂多条轴。",
  },
];
