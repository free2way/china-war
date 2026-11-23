// 新战役沙盘模板文件
// 使用方法：
// 1. 复制本文件为 dist/data/<battle-id>.js（如 feishui-383.js）
// 2. 替换下方字段内容与 SVG 地形坐标（默认画布 viewBox 为 0 0 880 720）
// 3. 在 dist/data/battles.js 的 battleRegistry 中登记该战役，将 status 设为 "available" 并配置 loader
// 4. 访问 ?battle=<battle-id> 即可自动渲染完整沙盘与专题页

export default {
  id: "battle-id",
  title: "战役名称",
  subtitle: "一句话战役定位",
  period: "年代 · 日期范围",
  theater: "地理战区",
  era: "所属历史时期",
  opponents: "甲军 VS 乙军",
  seal: "战",

  // 战役专属视觉主题（不填则使用框架默认主题）
  theme: {
    id: "custom-theme", // 可在 styles.css 中针对 body[data-theme="..."] 定制底纹
    accent: "#c93b2b",
    accentBright: "#e2513f",
    accentDark: "#8f241b",
    accentSoft: "rgba(201, 59, 43, 0.16)",
    opposing: "#7d99a3",
    opposingSoft: "rgba(125, 153, 163, 0.2)",
    gold: "#c9a45c",
    stageBg: "#121512",
    stageBgAlt: "#1b201b",
    stageGlow: "rgba(140, 145, 118, 0.14)",
    paper: "#ebe6da",
    paperLight: "#f5f2ea",
    paperMuted: "#dcd6c6",
    ink: "#181a17",
    muted: "#62645c",
    closingBg: "#5d1c16"
  },

  meta: {
    heroTitle: ["战役", "名称"], // 两行错位展示的大标题
    eyebrow: ["交互战役沙盘", "年代"],
    deck: "核心战略概括，控制在 20-45 字以内。",
    facts: [
      ["时间", "公元XXX年"],
      ["战场", "主要地域"],
      ["兵力", "约X万 : 约Y万"]
    ],
    quote: "“一句能够代表本场战役精髓的历史原话。”",
    quoteAuthor: "出处或人物",
    quoteMark: "策",
    quoteDesc: "对战役历史意义或制胜关键的一句话总结。"
  },

  mapConfig: {
    viewBox: "0 0 880 720",
    scaleNote: "战区 · 态势示意",
    filterSides: { all: "全部番号", red: "主视角方", blue: "对手方" },
    legends: [
      { colorClass: "legend-red", label: "主视角机动路线" },
      { colorClass: "legend-dark", label: "对手进逼/围堵" },
      { colorClass: "legend-river", label: "主要水系" }
    ],
    // 地形底图 SVG：推荐使用 .terrain-region / .terrain-grid / .region-labels / .mountains / .river / .river-key / .river-labels 类名
    terrainSvg: `
      <path class="terrain-region" d="M60 40 L820 40 L820 680 L60 680 Z" />
      <g class="region-labels" aria-hidden="true">
        <text x="340" y="380">战区</text>
      </g>
      <path class="river river-key" d="M80 340 C260 320 520 380 800 330" />
      <g class="river-labels" aria-hidden="true">
        <text x="410" y="348">主要河流</text>
      </g>
    `,
    defaultEnemyRoutes: [],
    futureRoute: "", // 可选：最后阶段显示的战后走向虚线 SVG path d
    locations: [
      // kind 支持: "capital" | "fortress" | "city" | "ford"（不填则为普通圆点）
      { name: "关键城池", x: 320, y: 360, r: 6, kind: "fortress", labelX: 12, labelY: -8, sub: "悬停提示说明" }
    ]
  },

  commanders: {
    redLabel: "主视角方",
    redSub: "指挥中枢",
    blueLabel: "对手方",
    blueSub: "对手指挥",
    red: [{ name: "主帅名", role: "职务与核心决策" }],
    blue: [{ name: "对手主帅", role: "职务与核心行动" }]
  },

  orderOfBattle: {
    red: [["部队/单位名称", "指挥员", "主要任务与定位"]],
    blue: [["部队/单位名称", "指挥员", "主要任务与定位"]]
  },

  situation: {
    eyebrow: "战前背景",
    title: "第一行标题，<br />第二行标题。",
    narrative: "战前战略态势与双方处境概述。",
    forceComparison: {
      red: { label: "主视角方兵力", count: "约X万", width: "25%", desc: "部队构成与特点说明。" },
      blue: { label: "对手方兵力", count: "约Y万", width: "100%", desc: "部队构成与特点说明。" },
      note: "注：兵力数字来源与统计口径说明。"
    },
    deployments: {
      red: { title: "我方部署", subtitle: "关键词 · 关键词", items: [["方向/部队", "任务说明"]] },
      blue: { title: "敌方部署", subtitle: "关键词 · 关键词", items: [["方向/部队", "任务说明"]] }
    }
  },

  logic: {
    eyebrow: "制胜法则",
    title: "提炼战役的<br />核心胜负逻辑。",
    steps: [
      { roman: "I", title: "第一步策略", desc: "详细阐释。", keyword: "示形" },
      { roman: "II", title: "第二步策略", desc: "详细阐释。", keyword: "相持" },
      { roman: "III", title: "第三步策略", desc: "详细阐释。", keyword: "决胜" }
    ],
    decisionLoop: {
      eyebrow: "决策要点",
      title: "指挥决断的核心闭环。",
      items: [
        ["01", "要点一", "简要说明"],
        ["02", "要点二", "简要说明"],
        ["03", "要点三", "简要说明"],
        ["04", "要点四", "简要说明"]
      ]
    }
  },

  chronicle: {
    eyebrow: "时间跨度",
    title: "战役全程，<br />关键转折。",
    deck: "点击节点可将上方沙盘切换到对应阶段。",
    events: [
      { date: "时间", stage: "阶段", title: "事件标题", desc: "事件简述。", tag: "标签", phaseIndex: 0 },
      { date: "战后", stage: "余响", title: "历史影响", desc: "战役结果与后续格局。", tag: "大势已定", phaseIndex: 0, isOutcome: true }
    ]
  },

  // 推演阶段（数量不限，UI 自动适配 3~6+ 阶段）
  phases: [
    {
      id: "phase-1",
      short: "序幕",
      tag: "四字概括",
      name: "第一阶段名称",
      date: "日期范围",
      intent: "本阶段为什么这样行动（详细战况叙述）。",
      goal: "本阶段行动目的",
      result: "本阶段行动结果",
      route: "M220 420 C300 380 420 360 540 320",
      enemyRoutes: ["M620 200 C560 250 500 290 450 320"],
      keys: ["关键城池"],
      // 可选：本阶段关键战术事件徽章，type 支持 "clash" | "fire" | "turning" | "victory"
      markers: [
        { x: 320, y: 360, type: "clash", label: "关键交锋", desc: "悬停或点击徽章时显示的战事详情。" }
      ],
      detail: [["日期", "行动标题", "详细经过与史料解释。"]],
      formations: [
        // 跨阶段复用相同 id 时，部队会在地图上平滑移动；引擎自动防重叠，亦可用 anchor / dx / dy 微调
        { id: "unit-red-1", side: "red", label: "主力前锋", sub: "指挥员 · 任务", x: 320, y: 360, anchor: "right" },
        { id: "unit-blue-1", side: "blue", label: "敌军主力", sub: "指挥员 · 任务", x: 540, y: 260, anchor: "left" }
      ]
    }
  ],

  sources: [{ title: "史料来源标题", url: "https://example.com" }]
};
