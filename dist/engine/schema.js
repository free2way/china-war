// 战役沙盘数据校验、主题预设与规范化层
// 支持中国历代名战与世界著名战役（含二战登陆、空降、机动作战）

export const THEME_PRESETS = {
  "red-army-ink": {
    id: "red-army-ink",
    accent: "#c93b2b",
    accentBright: "#e45441",
    accentDark: "#8f241b",
    accentSoft: "rgba(201, 59, 43, 0.17)",
    opposing: "#86a2ab",
    opposingSoft: "rgba(134, 162, 171, 0.2)",
    gold: "#d4b064",
    riverKey: "rgba(176, 102, 82, 0.88)",
    stageBg: "#111411",
    stageBgAlt: "#1a1f1a",
    stageGlow: "rgba(130, 150, 110, 0.15)",
    paper: "#ebe6da",
    paperLight: "#f5f2ea",
    paperMuted: "#dcd6c6",
    ink: "#181a17",
    muted: "#62645c",
    closingBg: "#641c16"
  },
  "han-bronze": {
    id: "han-bronze",
    accent: "#c4923a",
    accentBright: "#e2b154",
    accentDark: "#8a5f1f",
    accentSoft: "rgba(196, 146, 58, 0.18)",
    opposing: "#6e9e96",
    opposingSoft: "rgba(110, 158, 150, 0.22)",
    gold: "#d9a441",
    riverKey: "rgba(184, 146, 78, 0.72)",
    stageBg: "#14100c",
    stageBgAlt: "#201912",
    stageGlow: "rgba(196, 146, 58, 0.14)",
    paper: "#ebe2cc",
    paperLight: "#f4eedf",
    paperMuted: "#ddd1b4",
    ink: "#1d1712",
    muted: "#6b6152",
    closingBg: "#291b11"
  },
  "jin-azure": {
    id: "jin-azure",
    accent: "#4c84a3",
    accentBright: "#6aa4c4",
    accentDark: "#2f5a73",
    accentSoft: "rgba(76, 132, 163, 0.18)",
    opposing: "#b57b5b",
    opposingSoft: "rgba(181, 123, 91, 0.2)",
    gold: "#c8a35a",
    riverKey: "rgba(98, 148, 174, 0.82)",
    stageBg: "#0f1418",
    stageBgAlt: "#172027",
    stageGlow: "rgba(76, 132, 163, 0.14)",
    paper: "#e6eaec",
    paperLight: "#f2f5f6",
    paperMuted: "#d5dde1",
    ink: "#161d22",
    muted: "#5b6770",
    closingBg: "#1b3140"
  },
  "ww2-allied-ops": {
    id: "ww2-allied-ops",
    accent: "#3b8ea5",
    accentBright: "#5eb6cf",
    accentDark: "#245d6e",
    accentSoft: "rgba(59, 142, 165, 0.19)",
    opposing: "#b86b5e",
    opposingSoft: "rgba(184, 107, 94, 0.22)",
    gold: "#d8a84e",
    riverKey: "rgba(86, 146, 176, 0.78)",
    stageBg: "#0d1318",
    stageBgAlt: "#141f27",
    stageGlow: "rgba(59, 142, 165, 0.16)",
    paper: "#e4e7e9",
    paperLight: "#f1f3f4",
    paperMuted: "#d3d9dc",
    ink: "#161c21",
    muted: "#56636d",
    closingBg: "#152a36"
  },
  "ww2-airborne-olive": {
    id: "ww2-airborne-olive",
    accent: "#b5493a",
    accentBright: "#dc6452",
    accentDark: "#7d2d22",
    accentSoft: "rgba(181, 73, 58, 0.19)",
    opposing: "#7c949c",
    opposingSoft: "rgba(124, 148, 156, 0.22)",
    gold: "#c9a452",
    riverKey: "rgba(92, 148, 168, 0.84)",
    stageBg: "#101410",
    stageBgAlt: "#192019",
    stageGlow: "rgba(138, 154, 102, 0.15)",
    paper: "#e7e6de",
    paperLight: "#f3f2ec",
    paperMuted: "#d8d6ca",
    ink: "#191c18",
    muted: "#5f645b",
    closingBg: "#2e1b18"
  },
  "sinai-desert-ochre": {
    id: "sinai-desert-ochre",
    accent: "#d67a2e",
    accentBright: "#f49b46",
    accentDark: "#964d16",
    accentSoft: "rgba(214, 122, 46, 0.18)",
    opposing: "#5ca0b5",
    opposingSoft: "rgba(92, 160, 181, 0.22)",
    gold: "#e0b354",
    riverKey: "rgba(62, 158, 184, 0.86)",
    stageBg: "#14110d",
    stageBgAlt: "#211b14",
    stageGlow: "rgba(214, 138, 62, 0.15)",
    paper: "#ede5d5",
    paperLight: "#f6f1e6",
    paperMuted: "#dfd3bc",
    ink: "#1c1813",
    muted: "#6b6254",
    closingBg: "#2e1d10"
  }
};

const DEFAULT_THEME = THEME_PRESETS["red-army-ink"];

export function validateBattle(raw) {
  const warnings = [];
  if (!raw || typeof raw !== "object") {
    throw new Error("战役数据必须是一个对象");
  }
  if (!raw.id) warnings.push("缺少战役 id");
  if (!raw.title) warnings.push("缺少战役 title");
  if (!Array.isArray(raw.phases) || raw.phases.length === 0) {
    throw new Error(`战役 ${raw.id || "unknown"} 至少需要一个 phase`);
  }
  if (!raw.mapConfig || !raw.mapConfig.terrainSvg) {
    warnings.push(`战役 ${raw.id} 缺少 mapConfig.terrainSvg`);
  }
  if (warnings.length > 0) {
    console.warn("[WarSandtable Schema]", warnings.join("；"));
  }
  return warnings;
}

export function normalizeBattle(raw) {
  validateBattle(raw);

  const preset =
    typeof raw.theme === "string"
      ? THEME_PRESETS[raw.theme] || DEFAULT_THEME
      : THEME_PRESETS[raw.theme?.id] || DEFAULT_THEME;
  const theme =
    typeof raw.theme === "string"
      ? { ...preset }
      : { ...preset, ...(raw.theme || {}) };

  const filterSides = {
    all: "全部番号",
    red: "红方",
    blue: "蓝方",
    ...(raw.mapConfig?.filterSides || {})
  };

  const phases = raw.phases.map((phase, index) => ({
    id: phase.id || `phase-${index + 1}`,
    short: phase.short || `阶段${index + 1}`,
    tag: phase.tag || (phase.goal ? phase.goal.slice(0, 8) : ""),
    name: phase.name || `第 ${index + 1} 阶段`,
    date: phase.date || "",
    intent: phase.intent || "",
    goal: phase.goal || "",
    result: phase.result || "",
    route: phase.route || "",
    enemyRoutes: Array.isArray(phase.enemyRoutes) ? phase.enemyRoutes : null,
    keys: Array.isArray(phase.keys) ? phase.keys : [],
    markers: Array.isArray(phase.markers) ? phase.markers : [],
    detail: Array.isArray(phase.detail) ? phase.detail : [],
    formations: (phase.formations || []).map((unit) => ({
      anchor: "right",
      ...unit
    }))
  }));

  return {
    ...raw,
    seal: raw.seal || "战",
    era: raw.era || "历史战役沙盘",
    theater: raw.theater || "",
    theme,
    mapConfig: {
      viewBox: "0 0 880 720",
      scaleNote: "态势示意 · 非精确测绘",
      terrainSvg: "",
      defaultEnemyRoutes: [],
      futureRoute: "",
      locations: [],
      legends: [
        { colorClass: "legend-red", label: `${filterSides.red}机动` },
        { colorClass: "legend-dark", label: `${filterSides.blue}态势` },
        { colorClass: "legend-river", label: "主要水系" }
      ],
      ...raw.mapConfig,
      filterSides
    },
    commanders: {
      redLabel: raw.commanders?.redLabel || filterSides.red,
      redSub: raw.commanders?.redSub || "核心指挥",
      blueLabel: raw.commanders?.blueLabel || filterSides.blue,
      blueSub: raw.commanders?.blueSub || "对手指挥",
      red: raw.commanders?.red || [],
      blue: raw.commanders?.blue || []
    },
    orderOfBattle: {
      red: raw.orderOfBattle?.red || [],
      blue: raw.orderOfBattle?.blue || []
    },
    phases,
    sources: Array.isArray(raw.sources) ? raw.sources : []
  };
}
