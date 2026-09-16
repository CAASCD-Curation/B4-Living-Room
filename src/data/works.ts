// 客厅结构方案 Demo 数据集
// cat: A 艺术 / B 文学 / C 当代现象 / D 负边界
// band: blue 阴郁带 / gold 暖意带 / gray 伪装带（方案2）
// tags 为方案7网络的"共享标签=边"

export interface Work {
  id: string;
  name: string;
  source: string;
  year: number;
  yearLabel: string;
  cat: "A" | "B" | "C" | "D";
  band?: "blue" | "gold" | "gray";
  desc: string;
  tags: string[];
  emotions: string[];
  img?: string;
  mask?: { surface: string; hidden: string };
}

export const EMOTION_WORDS: { word: string; band: "blue" | "gold" | "gray" }[] = [
  // 正面 12（金）
  { word: "自由", band: "gold" }, { word: "宁静", band: "gold" }, { word: "治愈", band: "gold" },
  { word: "慵懒", band: "gold" }, { word: "温情", band: "gold" }, { word: "浪漫", band: "gold" },
  { word: "庄严", band: "gold" }, { word: "惬意", band: "gold" }, { word: "安然", band: "gold" },
  { word: "柔软", band: "gold" }, { word: "满足", band: "gold" }, { word: "释然", band: "gold" },
  // 中性 7（灰）
  { word: "虚荣", band: "gray" }, { word: "暧昧", band: "gray" }, { word: "荒诞", band: "gray" },
  { word: "尴尬", band: "gray" }, { word: "空洞", band: "gray" }, { word: "伪装", band: "gray" },
  { word: "自嘲", band: "gray" },
  // 负面 13（蓝）
  { word: "压抑", band: "blue" }, { word: "焦虑", band: "blue" }, { word: "悲凉", band: "blue" },
  { word: "虚无", band: "blue" }, { word: "孤寂", band: "blue" }, { word: "疏离", band: "blue" },
  { word: "感伤", band: "blue" }, { word: "迷惘", band: "blue" }, { word: "忧郁", band: "blue" },
  { word: "窒息", band: "blue" }, { word: "冷漠", band: "blue" }, { word: "疲惫", band: "blue" },
  { word: "惶恐", band: "blue" },
];

export const BAND_META = {
  blue: {
    name: "蓝 · 阴郁带",
    en: "BLUE / MELANCHOLY",
    color: "#3d5a99",
    soft: "#e8edf7",
    desc: "负面 13 词：压抑 · 窒息 · 孤寂 · 疏离…… 客厅允许这些情绪存在吗？蓝色是「忧郁」的本义色——空房间、背影、面具化的家族合影。",
  },
  gold: {
    name: "金 · 暖意带",
    en: "AMBER / WARMTH",
    color: "#c07f1a",
    soft: "#faf1de",
    desc: "正面 12 词：宁静 · 治愈 · 温情 · 慵懒…… 琥珀金是炉火、烛光与维米尔窗光的颜色——客厅作为围坐与出神之所。",
  },
  gray: {
    name: "灰 · 伪装带",
    en: "GRAY / MASQUERADE",
    color: "#6b6b6b",
    soft: "#efefed",
    desc: "中性 7 词：虚荣 · 空洞 · 伪装 · 荒诞…… 灰色不是过渡，是一层膜：表面越体面，越需要一层伪装来包住。",
  },
} as const;

export const WORKS: Work[] = [
  // ── A 艺术（22 件经典，有图像）──
  { id: "w2", name: "梅洛德祭坛画（中屏）", source: "罗伯特·康平 · 1427–1432", year: 1427, yearLabel: "1427–1432", cat: "A",
    desc: "圣家庭客厅：壁炉、水盆与未燃的火——神圣日常化的起点", tags: ["壁炉", "圣室", "私密"], emotions: ["宁静", "庄严"], img: "/works/2.jpg" },
  { id: "w15", name: "阿尔诺芬尼夫妇像", source: "扬·凡·艾克 · 1434", year: 1434, yearLabel: "1434", cat: "A", band: "gray",
    desc: "婚姻、契约与镜像：最早的「客厅式」室内叙事", tags: ["镜", "契约", "礼制", "装饰即宣言"], emotions: ["庄严", "虚荣", "空洞"],
    img: "/works/15.jpg", mask: { surface: "一场庄严的神圣婚约", hidden: "一份精算的财产契约：谁出多少，写得明明白白" } },
  { id: "w3", name: "书房中的圣哲罗姆", source: "扬·凡·艾克及作坊 · 1435", year: 1435, yearLabel: "1435", cat: "A",
    desc: "把客厅让给书：靠边式书房的开山之作", tags: ["阅读", "书房", "靠边", "私密"], emotions: ["宁静", "安然"], img: "/works/3.jpg" },
  { id: "w4", name: "读信的女子", source: "维米尔 · 1662–1663", year: 1663, yearLabel: "1662–63", cat: "A", band: "gold",
    desc: "窗光里的静默出神：客厅最私人的一平米", tags: ["窗光", "阅读", "静默", "私密"], emotions: ["宁静", "安然"], img: "/works/4.jpg" },
  { id: "w5", name: "正如老人所唱，年轻人跟着哼", source: "扬·斯滕 · 1665", year: 1665, yearLabel: "1665", cat: "A", band: "gold",
    desc: "三代同堂的喧闹客厅：音乐、酒与天伦", tags: ["围坐", "喧闹", "亲情", "音乐"], emotions: ["温情", "满足", "荒诞"], img: "/works/5.jpg" },
  { id: "w17", name: "绘画的艺术", source: "维米尔 · 约1666–68", year: 1667, yearLabel: "约1666–68", cat: "A",
    desc: "画中之画：客厅里的客厅，观看的套娃结构", tags: ["画中之画", "镜", "静默"], emotions: ["宁静", "暧昧"], img: "/works/17.jpg" },
  { id: "w16", name: "情书", source: "维米尔 · 约1669–70", year: 1669, yearLabel: "约1669–70", cat: "A",
    desc: "未拆的信与 interrupted 的琴课：客厅里暧昧的停顿", tags: ["窗光", "暧昧", "信"], emotions: ["暧昧", "宁静"], img: "/works/16.jpg" },
  { id: "w6", name: "斯特罗德一家", source: "威廉·霍加斯 · 1738", year: 1738, yearLabel: "1738", cat: "A", band: "blue",
    desc: "富贵客厅的家族群像：秩序井然，空气凝固", tags: ["家族", "肖像", "秩序", "疏离"], emotions: ["冷漠", "压抑"], img: "/works/6.jpg" },
  { id: "w7", name: "拿破仑在杜伊勒里宫的书房", source: "雅克-路易·大卫 · 1812", year: 1812, yearLabel: "1812", cat: "A", band: "gray",
    desc: "帝国中枢的客厅化：权力也需要一张舒服的椅子", tags: ["权力", "书房", "轴线", "装饰即宣言"], emotions: ["庄严", "虚荣"],
    img: "/works/7.jpg", mask: { surface: "勤勉治国的君主书房", hidden: "一整套为观看而设计的权力布景" } },
  { id: "w8", name: "窗边的女人", source: "弗里德里希 · 1822", year: 1822, yearLabel: "1822", cat: "A", band: "blue",
    desc: "空客厅只剩窗光与背影：现代客厅的空寂美学起点", tags: ["窗光", "背影", "空寂"], emotions: ["孤寂", "忧郁", "感伤"], img: "/works/8.jpg" },
  { id: "w9", name: "阿尔及尔的女人", source: "德拉克洛瓦 · 1834", year: 1834, yearLabel: "1834", cat: "A",
    desc: "内室即异邦：被观看的私密客厅", tags: ["内室", "暧昧", "私密"], emotions: ["暧昧", "慵懒"], img: "/works/9.jpg" },
  { id: "w10", name: "阳台房间", source: "门采尔 · 1845", year: 1845, yearLabel: "1845", cat: "A",
    desc: "半开放的客厅：推拉门让内外互相渗透", tags: ["半开放", "窗", "光影"], emotions: ["惬意", "宁静"], img: "/works/10.jpg" },
  { id: "w13", name: "波依特家的女儿们", source: "萨金特 · 1882", year: 1882, yearLabel: "1882", cat: "A", band: "blue",
    desc: "华丽客厅里被谈论的四个女儿：优雅即消耗", tags: ["家族", "空寂", "疏离", "性别"], emotions: ["孤寂", "压抑", "感伤"], img: "/works/13.jpg" },
  { id: "w12", name: "意外归来", source: "列宾 · 1884–1888", year: 1886, yearLabel: "1884–88", cat: "A",
    desc: "门开的一瞬：流放者归来，全家客厅凝固成戏剧", tags: ["门", "阈限", "亲情", "出走与归来"], emotions: ["温情", "惶恐"], img: "/works/12.jpg" },
  { id: "w11", name: "弹钢琴的年轻男子", source: "卡耶博特 · 1876", year: 1876, yearLabel: "1876", cat: "A",
    desc: "背对观众的琴者：客厅也是独处的地方", tags: ["音乐", "背影", "静默"], emotions: ["宁静", "忧郁"], img: "/works/11.jpg" },
  { id: "w14", name: "钢琴前的少女", source: "雷诺阿 · 1892", year: 1892, yearLabel: "1892", cat: "A", band: "gold",
    desc: "印象派的客厅午后：柔软光线与毫无防备的少女", tags: ["音乐", "温情", "柔光"], emotions: ["温情", "柔软", "惬意"], img: "/works/14.jpg" },
  { id: "w18", name: "红色的和谐", source: "马蒂斯 · 1908", year: 1908, yearLabel: "1908", cat: "A", band: "gold",
    desc: "墙壁洇成红色的客厅：装饰吞没功能", tags: ["色彩", "装饰", "围坐"], emotions: ["满足", "慵懒", "浪漫"], img: "/works/18.jpg" },
  { id: "w1", name: "圆桌", source: "乔治·布拉克 · 1929", year: 1929, yearLabel: "1929", cat: "A",
    desc: "圆边桌被多视角静物赋予纪念碑式的体量", tags: ["静物", "物", "形式"], emotions: ["安然", "迷惘"], img: "/works/1.jpg" },
  { id: "w19", name: "究竟是什么使今日的家庭如此不同，如此吸引人？", source: "理查德·汉密尔顿 · 1956", year: 1956, yearLabel: "1956", cat: "A", band: "gray",
    desc: "波普客厅宣言：电视机、健美先生与罐头广告拼成的理想家", tags: ["电视", "媒介", "波普", "家庭"], emotions: ["满足", "虚荣", "荒诞"],
    img: "/works/19.jpg", mask: { surface: "一个无比幸福的现代家庭客厅", hidden: "消费主义样板房：每一件物品都在被推销" } },
  { id: "w20", name: "克拉克夫妇与珀西", source: "大卫·霍克尼 · 1970–1971", year: 1971, yearLabel: "1970–71", cat: "A", band: "gold",
    desc: "双人沙发与狗的对角线：现代婚姻的松弛样本", tags: ["松弛", "去界", "亲密", "宠物"], emotions: ["慵懒", "惬意", "释然"], img: "/works/20.jpg" },
  { id: "w21", name: "血缘：大家庭（系列）", source: "张晓刚 · 1990年代", year: 1995, yearLabel: "1990s", cat: "A", band: "blue",
    desc: "面具式全家福：每张脸都在直视你，每张脸都不属于自己", tags: ["家族", "面具", "凝视", "压抑"], emotions: ["压抑", "疏离", "冷漠"], img: "/works/21.jpg" },
  { id: "w22", name: "物尽其用", source: "宋冬 · 2005", year: 2005, yearLabel: "2005", cat: "A", band: "blue",
    desc: "母亲一生的日用品铺满展厅：家庭空间的总体档案", tags: ["物", "档案", "记忆"], emotions: ["悲凉", "感伤", "疲惫"], img: "/works/22.jpg" },

  // ── B 文学中的客厅（无图像，档案卡）──
  { id: "b1", name: "荣国府正厅", source: "曹雪芹《红楼梦》 · 18世纪", year: 1754, yearLabel: "18世纪", cat: "B",
    desc: "黛玉进府的厅堂动线：宗法秩序的空间说明书", tags: ["礼制", "座次", "门槛"], emotions: ["庄严", "惶恐"] },
  { id: "b5", name: "马尼洛夫家客厅", source: "果戈理《死魂灵》 · 1842", year: 1842, yearLabel: "1842", cat: "B", band: "gray",
    desc: "永远只绷着麻袋布的扶手椅：主客在门口过度谦让", tags: ["虚荣", "空洞", "客套", "门"], emotions: ["空洞", "尴尬", "自嘲"],
    mask: { surface: "殷勤好客的体面客厅", hidden: "一场谁也不打算兑现的空洞客套" } },
  { id: "b2", name: "海尔茂家起居室", source: "易卜生《玩偶之家》 · 1879", year: 1879, yearLabel: "1879", cat: "B", band: "gray",
    desc: "三幕剧唯一场景：表面温馨的玩偶柜，娜拉出走前的边界", tags: ["阈限", "出走与归来", "伪装", "温馨"], emotions: ["伪装", "压抑", "宁静"],
    mask: { surface: "一个温馨体面的中产阶级客厅", hidden: "一座精致的玩偶柜：女主人只是展品之一" } },
  { id: "b3", name: "鲁四老爷家堂屋", source: "鲁迅《祝福》 · 1924", year: 1924, yearLabel: "1924", cat: "B", band: "blue",
    desc: "供桌前的门槛即生死线：祥林嫂被一句「你放着罢」逐出堂屋", tags: ["门槛", "礼制", "驱逐", "压抑"], emotions: ["悲凉", "惶恐", "压抑"] },
  { id: "b4", name: "吴公馆客厅", source: "茅盾《子夜》 · 1933", year: 1933, yearLabel: "1933", cat: "B", band: "gray",
    desc: "资本博弈的中枢：吴荪甫的野心与王朝的崩塌在同一屋檐下交割", tags: ["资本", "权力", "表演"], emotions: ["焦虑", "虚荣", "荒诞"],
    mask: { surface: "一场摩登的都市社交沙龙", hidden: "一台资本交割的机器：每声寒暄都在报价" } },

  // ── C 当代现象（无图像，档案卡）──
  { id: "c2", name: "合租屋客厅的走廊化", source: "当代城市居住现象 · 2019", year: 2019, yearLabel: "2019", cat: "C", band: "blue",
    desc: "客厅被隔断与行李压缩成过道：公共空间的彻底靠边", tags: ["消融", "靠边", "疏离"], emotions: ["疏离", "疲惫", "冷漠"] },
  { id: "c5", name: "梦核空置客厅", source: "梦核/后室美学 · 2019", year: 2019, yearLabel: "2019", cat: "D", band: "blue",
    desc: "抽走家具与人后的客厅：只剩米黄墙纸与日光灯的熟悉又陌生", tags: ["空置", "梦核", "虚无"], emotions: ["虚无", "迷惘", "惶恐"] },
  { id: "c1", name: "数字界面切割下的客厅", source: "移动互联网时代 · 2020", year: 2020, yearLabel: "2020", cat: "C",
    desc: "多屏各看：客厅从「单屏共看」退化为碎片化原子空间", tags: ["多屏", "疏离", "媒介"], emotions: ["疏离", "冷漠", "疲惫"] },
  { id: "c4", name: "去茶几去电视墙的年轻客厅", source: "95后/00后居住趋势 · 2021", year: 2021, yearLabel: "2021", cat: "C",
    desc: "茶几被弃、投影替电视：厅变成放松角而非排场间", tags: ["去界", "松弛", "媒介"], emotions: ["自由", "释然", "慵懒"] },
  { id: "c6", name: "围炉煮茶进客厅", source: "生活方式回潮 · 2023", year: 2023, yearLabel: "2023", cat: "C", band: "gold",
    desc: "客厅支起炭炉：从看电视回到围炉社交（连一氧化碳风险都成了热议）", tags: ["火塘", "围坐", "复古"], emotions: ["温情", "惬意"] },
  { id: "c3", name: "除夕夜的客厅", source: "媒介仪式观察 · 2024", year: 2024, yearLabel: "2024", cat: "C",
    desc: "电视开机率持续走低：春晚从全家围看的仪式退化为背景噪音", tags: ["电视", "仪式", "衰落"], emotions: ["感伤", "温情", "自嘲"] },

  // ── D 负边界（无图像，档案卡）──
  { id: "d1", name: "猫的纸箱", source: "跨物种类比 · 边界原型", year: 2020, yearLabel: "不详", cat: "D",
    desc: "四壁围出的安全区即客厅原型：动物不需要墙，只需要边界", tags: ["边界", "安全感", "极简"], emotions: ["安然", "柔软"] },
  { id: "d2", name: "蜂巢中央巢脾", source: "跨物种类比 · 信息中枢", year: 2020, yearLabel: "不详", cat: "D",
    desc: "王室即蚁群的客厅：所有工蚁在此交汇信息——围坐交谈的原型", tags: ["火塘", "围坐", "信息"], emotions: ["满足", "宁静"] },
  { id: "d3", name: "丹麦 hygge 壁炉", source: "生活哲学 · 丹麦", year: 2020, yearLabel: "不详", cat: "D", band: "gold",
    desc: "火光即社交核心：极简边界内的温暖聚集", tags: ["壁炉", "围坐", "治愈"], emotions: ["治愈", "温情", "慵懒"] },
  { id: "d4", name: "机场贵宾休息室", source: "会员制空间 · 当代", year: 2021, yearLabel: "2021", cat: "D", band: "gray",
    desc: "从协和厅到环亚贵宾厅：一张会员卡过滤出的人工客厅", tags: ["会员", "表演", "阈限"], emotions: ["虚荣", "空洞", "惬意"],
    mask: { surface: "宾至如归的贵宾礼遇", hidden: "一道会员制的过滤门：门外的人不配看见门里的舒适" } },
  { id: "d5", name: "茶寮与亭", source: "东方无墙客厅 · 传统", year: 2020, yearLabel: "不详", cat: "D", band: "gold",
    desc: "无墙也无门的客厅：以天为顶，以地为毯，边界即风景", tags: ["无墙", "消融", "悠然"], emotions: ["自由", "释然", "惬意"] },
];

export const CAT_META = {
  A: { name: "艺术", color: "#b3452e", desc: "绘画中的客厅" },
  B: { name: "文学", color: "#3d5a99", desc: "小说与戏剧中的客厅" },
  C: { name: "当代", color: "#3e7a52", desc: "社会现象中的客厅" },
  D: { name: "负边界", color: "#a07d18", desc: "客厅被推到极致之后" },
} as const;
