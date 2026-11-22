# 战史沙盘 · 中国历史著名战役交互推演框架

一个数据驱动的中国战争史交互沙盘框架，支持以统一引擎推演不同历史时期的著名战役，并按时代特色自动切换视觉主题、底图纹理、阵营配色与地图图层。

目前内置可推演战役：
- **四渡赤水（1935）** — 近现代 · 长征（朱砂墨绿等高线主题）
- **官渡之战（公元 200 年）** — 东汉末年 · 三国前夜（青铜鎏金汉纹主题）

筹备中档案（可直接按规范接入）：淝水之战（383）、赤壁之战（208）等。

## 本地运行

项目零构建依赖（原生 ES Modules + SVG + CSS Variables），直接托管 `dist/` 即可：

```bash
python3 -m http.server 43119 --directory dist
```

然后访问 `http://127.0.0.1:43119`（档案馆首页），或通过 `?battle=chishui-1935`、`?battle=guandu-200` 直达指定战役。

## Vercel 部署

仓库根目录的 `vercel.json` 已将静态输出目录声明为 `dist`。将仓库导入 Vercel 后无需填写构建命令，直接发布即可。

## 目录结构

```text
dist/
├── index.html                 # 档案馆首页与战役沙盘共享骨架
├── styles.css                 # 主题变量驱动的视觉系统与历史纹理
├── app.js                     # 路由、档案馆筛选、章节渲染与推演控制器
├── engine/
│   ├── schema.js              # 战役数据校验、时代主题预设与规范化层
│   └── mapRenderer.js         # 通用 SVG 沙盘引擎（动态底图/战点标记/防重叠番号牌）
└── data/
    ├── battles.js             # 战役注册表（按需动态加载）
    ├── chishui-1935.js        # 四渡赤水战役数据
    └── guandu-200.js          # 官渡之战战役数据
```

## 添加一场新战役（2 步接入）

### 第 1 步：创建战役数据文件

在 `dist/data/` 下新建 `<battle-id>.js`，导出一个默认对象（参考 `chishui-1935.js` 或 `guandu-200.js`）：

- `theme`：可直接写内置预设名（`"red-army-ink"` / `"han-bronze"` / `"jin-azure"`），或传入对象覆写 `accent`、`opposing`、`riverKey`、`stageBg`、`paper` 等配色变量。
- `meta`：首屏标题 `heroTitle`、导语 `deck`、核心事实 `facts`、结语引文 `quote`。
- `mapConfig`：
  - `terrainSvg`：该战役专属地形、水系、山脉与区域标注 SVG 片段
  - `locations`：地理关键点（支持 `kind: "capital" | "fortress" | "city" | "ford"`）
  - `filterSides` / `legends`：阵营名称与图例
- `commanders` & `orderOfBattle`：双方核心指挥与战斗序列。
- `situation` / `logic` / `chronicle`：战役态势、制胜逻辑与事件全览。
- `phases`：阶段推演数据数组：

```js
{
  id: "phase-id",
  short: "短标签",
  tag: "四字概括",
  name: "阶段全称",
  date: "时间范围",
  intent: "战场背景与行动意图",
  goal: "行动目的",
  result: "行动结果",
  route: "SVG path d（主机动路线）",
  enemyRoutes: ["SVG path d（对手态势动向）"],
  keys: ["本阶段高亮的关键地名"],
  markers: [
    { x: 498, y: 410, type: "fire", label: "夜袭乌巢焚粮", desc: "悬停/点击详情" }
  ],
  detail: [["时间", "事件", "说明"]],
  formations: [
    {
      id: "跨阶段稳定的部队 ID",
      side: "red | blue",
      label: "地图番号",
      sub: "指挥员或当前任务",
      x: 372,
      y: 470,
      anchor: "right" // 可选 left | right | top | bottom，引擎也会自动避让重叠
    }
  ]
}
```

> 跨阶段复用同一个 `formation.id`，引擎会将该番号平滑过渡到新坐标，并自动计算防重叠的番号牌布局；`markers` 支持 `clash`（战）、`fire`（火）、`turning`（转）、`victory`（胜）四种战术事件标记。

### 第 2 步：在注册表中登记

在 `dist/data/battles.js` 的 `battleRegistry` 中添加一条记录（设置 `status: "available"` 与 `loader: () => import("./<battle-id>.js")`），即可自动出现在档案馆首页、时代筛选与顶部战役切换菜单中。

## 史料原则

- 战役地图用于展示方向、相对位置和指挥关系，不作为精确测绘地图。
- 兵力、日期、番号和指挥关系依据正史或权威公开资料概括，存在不同记载处以“约”等限定语标注。
