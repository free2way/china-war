# 战史沙盘 · 世界历史著名战役交互推演框架

一个数据驱动的世界战争史交互沙盘框架，支持以统一引擎推演古今中外不同历史时期的著名战役，并按时代与战场特色自动切换视觉主题、底图纹理、阵营配色与地图图层。

目前内置可推演战役：
- **四渡赤水（1935）** — 中国近现代 · 长征（朱砂墨绿等高线主题）
- **官渡之战（公元 200 年）** — 中国古代 · 东汉末年（青铜鎏金汉纹主题）
- **诺曼底登陆（1944.06—07）** — 第二次世界大战 · 西欧战场（盟军海图经纬主题）
- **市场花园行动（1944.09）** — 第二次世界大战 · 荷兰走廊（空降作战坐标网主题）

筹备中档案（可直接按规范接入）：斯大林格勒战役（1942）、淝水之战（383）、赤壁之战（208）等。

## 本地运行

项目零构建依赖（原生 ES Modules + SVG + CSS Variables），直接托管 `dist/` 即可：

```bash
python3 -m http.server 43119 --directory dist
```

然后访问 `http://127.0.0.1:43119`（战史档案馆首页），或通过 `?battle=<id>` 直达指定战役：
- `?battle=chishui-1935`（四渡赤水）
- `?battle=guandu-200`（官渡之战）
- `?battle=normandy-1944`（诺曼底登陆）
- `?battle=market-garden-1944`（市场花园行动）

## Vercel 部署

仓库根目录的 `vercel.json` 已将静态输出目录声明为 `dist`。将仓库导入 Vercel 后无需填写构建命令，直接发布即可。

## 目录结构

```text
dist/
├── index.html                 # 战史档案馆首页与战役沙盘共享骨架
├── styles.css                 # 主题变量驱动的视觉系统与时代纹理
├── app.js                     # 路由、战史筛选、章节渲染与推演控制器
├── engine/
│   ├── schema.js              # 战役数据校验、时代主题预设与规范化层
│   └── mapRenderer.js         # 通用 SVG 沙盘引擎（动态底图/战点标记/防重叠番号牌）
└── data/
    ├── battles.js             # 中外战役注册表（按需动态加载）
    ├── chishui-1935.js        # 四渡赤水战役数据
    ├── guandu-200.js          # 官渡之战战役数据
    ├── normandy-1944.js       # 诺曼底登陆（霸王行动）战役数据
    └── market-garden-1944.js  # 市场花园行动战役数据
```

## 添加一场新战役（2 步接入）

### 第 1 步：创建战役数据文件

在 `dist/data/` 下新建 `<battle-id>.js`，导出一个默认对象（参考已有战役文件）：

- `theme`：可直接写内置预设名：
  - `"red-army-ink"`（近现代山地等高线）
  - `"han-bronze"`（中国古代青铜汉纹）
  - `"jin-azure"`（古代水战苍青）
  - `"ww2-allied-ops"`（二战海陆登陆海图经纬）
  - `"ww2-airborne-olive"`（二战空降与陆战作战坐标网）
  - 也可传入对象覆写 `accent`、`opposing`、`riverKey`、`stageBg`、`paper` 等任意变量。
- `mapConfig`：提供专属 `terrainSvg`（支持 `.sea-zone`、`.coastline`、`.beach-sector`、`.drop-zone`、`.highway`、`.fort-line`、`.river` 等图层样式）、`locations`、`filterSides`、`legends`。
- `phases`：每阶段包含路线 `route`、对手态势 `enemyRoutes`、关键地名 `keys`、战术事件标记 `markers`（支持 `clash` 战 / `fire` 火 / `turning` 转 / `victory` 胜 / `airborne` 伞 / `amphibious` 登 / `bridge` 桥）与部队部署 `formations`（跨阶段复用 `id` 自动平滑移动并防重叠布局）。

### 第 2 步：在注册表中登记

在 `dist/data/battles.js` 的 `battleRegistry` 中添加一条记录（设置 `region: "china" | "world"`、`category`、`status: "available"` 与 `loader`），即可自动出现在档案馆首页、战区/时代筛选栏与顶部切换菜单中。

## 史料原则

- 战役地图用于展示方向、相对位置与指挥关系，不作为精确地理测绘地图。
- 兵力、日期、番号与指挥关系依据正史或权威军事史公开资料概括，存在口径差异处以“约”等限定语标注。
