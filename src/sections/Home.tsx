import { useGo } from '../App'
import { WORKS, BAND_META } from '../data/works'

export default function Home() {
  const go = useGo()
  const bandCount = (b: 'blue' | 'gold' | 'gray') => WORKS.filter(w => w.band === b).length
  return (
    <div>
      {/* 序章标题 */}
      <section className="pt-8 pb-2">
        <p className="kicker">LIVING ROOM ARCHIVE · 策展结构试验场</p>
        <h1 className="display">七个切角，<br />一间客厅。</h1>
        <div className="hairline" />
        <p className="hint max-w-2xl">
          同一个语料库（22 件经典作品 + 文学 / 当代 / 负边界条目），用 7 种结构切角穷举——
          一分为二 · 一分为三 · 一分为四 · 一分为五 · 一分为六 · 多元九宫格 · 多元网络。
          此处提供其中两套的交互章节，体验资料如何被结构组织、又如何跳转互联。
        </p>
      </section>

      {/* 章节选择 */}
      <section className="chapter-grid">
        <button className="chapter-card" onClick={() => go('/intro2')}>
          <span className="ch-num">02</span>
          <p className="kicker mt-4">CHAPTER 02 · 一分为三 · TRIANGLE</p>
          <h2 className="ch-title">情绪语法三色带</h2>
          <p className="ch-desc">
            🔵 蓝（阴郁 13 词）⇄ 🟠 琥珀金（暖意 12 词），⚪ 灰（伪装 7 词）居间。
            32 个情绪词在三角里漂移——点击顶点进入一条情绪带，沿边滑动揭开「伪装层」：
            展品的标签会翻转，露出与第一印象相反的判词。进入时先经过一段 3D 引入。
          </p>
          <div className="ch-go">
            <span style={{ color: BAND_META.blue.color }}>● {bandCount('blue')}　</span>
            <span style={{ color: BAND_META.gold.color }}>● {bandCount('gold')}　</span>
            <span style={{ color: BAND_META.gray.color }}>● {bandCount('gray')}</span>
            <span className="ml-4">进入章节 →</span>
          </div>
        </button>

        <button className="chapter-card" onClick={() => go('/demo7')}>
          <span className="ch-num">07</span>
          <p className="kicker mt-4">CHAPTER 07 · 多元 · NETWORK</p>
          <h2 className="ch-title">六百年时空网络</h2>
          <p className="ch-desc">
            1427–2005 一条时间横轴，艺术 / 文学 / 当代 / 负边界四条泳道。
            点击任意节点，与它共享标签的跨时代「伙伴」会被点亮并以弧线相连——
            一条六百年客厅对话路径就此浮现。拖动时间滑块，让未来暗下去。
          </p>
          <div className="ch-go"><span className="mr-4">◉ 36 节点 · 共享标签即边</span>进入章节 →</div>
        </button>
      </section>

      <p className="hint mt-8">
        LOGIC — 首页 → 选章节 → 结构视图（三角 / 网络）→ 点击节点 → 详情 + 跨模块跳转（情绪带 ⇄ 标签伙伴）→ 返回结构视图。两套章节共用同一批展品数据，可互相对照。
      </p>
    </div>
  )
}
