// 战史沙盘 · 国际化与双语数据叠加引擎（中文 / English）
// 支持 URL (?lang=en|zh) 与 localStorage 记忆，并在切换语言时无刷新即时重绘全站与 3D 沙盘。

const STORAGE_KEY = "war-sandtable-lang";

const DICT = {
  zh: {
    // Brand & Nav
    siteTitle: "战史沙盘",
    siteFullTitle: "战史沙盘｜世界历史著名战役三维交互推演",
    battleTitleSuffix: "｜战史沙盘",
    siteSeal: "史",
    navSandtable: "沙盘",
    navCommand: "指挥序列",
    navSituation: "战役态势",
    navLogic: "胜负逻辑",
    navChronicle: "事件全览",
    switcherKickerHome: "战役档案",
    switcherNameHome: "选择战役",
    switcherArchivePrefix: "战役档案",
    menuHeader: "战役档案 · ARCHIVES",
    menuOverview: "档案馆总览",
    badgeCurrent: "当前",
    badgePlanned: "筹备中",

    // Home Hero & Archive
    homeEyebrow: "世界战争史 · 中外经典战役交互沙盘",
    homeTitleHtml: '观<span class="accent">兵</span>形之变，<br />读胜负之机。',
    homeDeck: "跨越古今中外，每一场著名战役都是一盘在时间与地理中展开的沙盘。选择一份战役档案，按阶段推演双方部署、机动路线与决策逻辑。",
    statPlayable: "可推演战役",
    statSplit: "中国战史 / 世界战史",
    statSpan: "时间跨度（年）",
    archiveEyebrow: "GLOBAL ARCHIVES · 战史档案馆",
    archiveTitle: "选择一场战役",
    filterAll: "全部档案",
    filterChina: "中国战史",
    filterWorld: "世界战史",
    filterWw2: "第二次世界大战",
    cardArchivePrefix: "档案",
    cardPlayable: "可推演",
    cardPlanned: "筹备中",
    cardTime: "时间",
    cardTheater: "战场",
    cardOpponents: "对阵",
    cardEnter: "进入沙盘 →",
    cardComingSoon: "敬请期待",
    cardAriaEnter: "进入",
    cardAriaPlanned: "筹备中：",
    cardAriaSuffix: "沙盘",

    // Brief & Sandtable Toolbar
    briefGoal: "目的",
    briefResult: "结果",
    btn3d: "3D 沙盘",
    btn3dTitle: "三维立体起伏地形",
    btnLowFly: "低空",
    btnLowFlyTitle: "低空临境观察山势与3D士兵",
    btnAutoCam: "运镜",
    btnAutoCamTitle: "切换阶段时电影运镜自动聚焦战区",
    btnStyleGame: "游戏风",
    btnStyleRealistic: "写实风",
    btnStyleTitle: "切换策略游戏地图风 / 写实纪录片风",
    btn2d: "2D 平面",
    btn2dTitle: "二维平面地图",
    btnZoomOut: "缩小",
    btnZoomIn: "放大",
    btnReset: "重置视角",
    btnBriefHide: "⛶ 大屏",
    btnBriefShow: "✕ 退出大屏",
    btnBriefTitle: "展开/收起全屏沙盘",

    // Turn-by-Turn Batch Sequencer
    turnPrev: "上一回合",
    turnNext: "下一回合",
    turnPlay: "分步演进",
    turnPause: "暂停演进",
    turnOverview: "全览",
    turnStepMode: "分步",
    turnOverviewTitle: "切换：分步回合推演 / 本阶段路线全览",
    turnOverviewLabel: "本阶段态势全览",
    turnActorRed: "我方行动",
    turnActorBlue: "敌方动向",
    turnActorClash: "双方交锋",
    turnLabelPrefix: "第",
    turnLabelSuffix: "回合",
    voiceTitleOn: "关闭男声解说",
    voiceTitleOff: "开启标准普通话浑厚男声解说",
    voiceUnsupported: "当前浏览器不支持语音合成",

    // Layer toggles & HUD
    layerFormations: "部队",
    layerEnemy: "动向",
    layerCombat: "战火",
    layerLabels: "地名",
    hint3dGl: "拖拽 360° 环绕山势 · Shift+拖拽平移 · 滚轮缩放",
    hint3dCss: "拖拽旋转沙盘 · 滚轮缩放",
    hint2d: "拖拽平移地图 · 滚轮缩放",
    compassNorth: "北",
    hudTickerDefault: "正在推演战场态势…",
    hudRedDefault: "红方",
    hudBlueDefault: "蓝方",

    // Tooltips & Markers
    locCapital: "战略中枢",
    locFortress: "关隘要塞",
    locFord: "关键渡口/桥梁",
    locBridge: "关键桥梁",
    locBeach: "登陆海滩",
    locPort: "战略港口",
    locDropzone: "空降着陆区",
    locDefault: "战役地标",
    locFallbackBody: "战役关键地理节点",
    unitSelected: "已选中兵团",
    unit3d: "三维兵力",
    unitStereo: "立体兵力",
    unitCurrent: "当前态势",
    unitFallbackBody: "参战兵团",
    markerFire: "奇袭火攻",
    markerTurning: "战略转折",
    markerVictory: "战役突破",
    markerAirborne: "空降突击",
    markerAmphibious: "两栖抢滩",
    markerBridge: "夺桥激战",
    markerClash: "关键战事",

    // Phase Controls
    phasePrev: "上一阶段",
    phaseNext: "下一阶段",
    playTour: "自动推演",
    pauseTour: "暂停推演",

    // Sections
    sec01Label: "指挥体系与战斗序列",
    sec01TitleHtml: "先看谁在指挥，<br />再看部队往哪里走。",
    sec01Deck: "沙盘中的番号按阶段重新定位。切换阶段可查看各部当时所处方向与任务；悬停或点击地图上的番号、地名可查看详情。",
    orderSuffix: "序列",
    dossierEyebrow: "阶段行动记录",
    sec02Label: "战役态势",
    sec03DefaultLabel: "胜负逻辑",
    sec04Label: "事件全览",
    closingBackSandtable: "返回沙盘 ↑",
    closingBackArchive: "战役档案馆 →",

    // Footer
    footerSubtitle: "历史学习与战役推演专题",
    footerSourcesLabel: "主要史料与参考",
    footerDisclaimer: "地图为战役态势示意，不作精确地理测绘用途。兵力与事件表述依据公开史料概括，存在不同记载处以“约”等限定语标注。",
    mapTitleSuffix: "战役态势示意图",
    mapDescSuffix: "按阶段动态推演双方部署与机动路线。"
  },

  en: {
    // Brand & Nav
    siteTitle: "War Sandtable",
    siteFullTitle: "War Sandtable | 3D Interactive Historical Battle Simulator",
    battleTitleSuffix: " | War Sandtable",
    siteSeal: "WS",
    navSandtable: "Sandtable",
    navCommand: "Command",
    navSituation: "Situation",
    navLogic: "Strategy",
    navChronicle: "Chronicle",
    switcherKickerHome: "ARCHIVES",
    switcherNameHome: "Select Battle",
    switcherArchivePrefix: "ARCHIVE",
    menuHeader: "BATTLE ARCHIVES",
    menuOverview: "All Archives",
    badgeCurrent: "ACTIVE",
    badgePlanned: "SOON",

    // Home Hero & Archive
    homeEyebrow: "WORLD MILITARY HISTORY · 3D INTERACTIVE BATTLE SANDTABLE",
    homeTitleHtml: 'Trace the <span class="accent">Art</span> of Maneuver,<br />Read the Pivot of Victory.',
    homeDeck: "Across ancient and modern theaters, every decisive battle unfolds over terrain and time. Choose an archive to simulate deployments, 3D troop movements, and command decisions phase by phase.",
    statPlayable: "Playable Battles",
    statSplit: "Chinese / World History",
    statSpan: "Time Span (AD)",
    archiveEyebrow: "GLOBAL ARCHIVES",
    archiveTitle: "Select a Campaign",
    filterAll: "All",
    filterChina: "Chinese History",
    filterWorld: "World History",
    filterWw2: "World War II",
    cardArchivePrefix: "FILE",
    cardPlayable: "PLAYABLE",
    cardPlanned: "PLANNED",
    cardTime: "DATE",
    cardTheater: "THEATER",
    cardOpponents: "FORCES",
    cardEnter: "Enter Sandtable →",
    cardComingSoon: "Coming Soon",
    cardAriaEnter: "Open ",
    cardAriaPlanned: "Planned: ",
    cardAriaSuffix: " sandtable",

    // Brief & Sandtable Toolbar
    briefGoal: "GOAL",
    briefResult: "OUTCOME",
    btn3d: "3D Map",
    btn3dTitle: "3D Relief Terrain & Miniature Armies",
    btnLowFly: "Close-Up",
    btnLowFlyTitle: "Low-altitude camera to inspect terrain and 3D soldiers",
    btnAutoCam: "Auto-Cam",
    btnAutoCamTitle: "Automatically pan camera to active combat sector",
    btnStyleGame: "Game Style",
    btnStyleRealistic: "Realistic",
    btnStyleTitle: "Toggle Strategy Game Style / Documentary Style",
    btn2d: "2D Map",
    btn2dTitle: "2D Tactical Vector Map",
    btnZoomOut: "Zoom Out",
    btnZoomIn: "Zoom In",
    btnReset: "Reset View",
    btnBriefHide: "⛶ Expand",
    btnBriefShow: "✕ Exit Full",
    btnBriefTitle: "Expand or collapse fullscreen sandtable",

    // Turn-by-Turn Batch Sequencer
    turnPrev: "Prev Turn",
    turnNext: "Next Turn",
    turnPlay: "Step Play",
    turnPause: "Pause",
    turnOverview: "All",
    turnStepMode: "Turns",
    turnOverviewTitle: "Toggle Turn-by-Turn Playback / Full Phase Overview",
    turnOverviewLabel: "Full Phase Overview",
    turnActorRed: "Red Move",
    turnActorBlue: "Blue Move",
    turnActorClash: "Engagement",
    turnLabelPrefix: "Turn ",
    turnLabelSuffix: "",
    voiceTitleOn: "Mute Voice Narration",
    voiceTitleOff: "Play Deep American Male Voice Narration",
    voiceUnsupported: "Speech synthesis not supported in this browser",

    // Layer toggles & HUD
    layerFormations: "Units",
    layerEnemy: "Moves",
    layerCombat: "FX",
    layerLabels: "Places",
    hint3dGl: "Drag 360° Orbit · Shift+Drag Pan · Scroll Zoom",
    hint3dCss: "Drag to rotate · Scroll to zoom",
    hint2d: "Drag to pan · Scroll to zoom",
    compassNorth: "N",
    hudTickerDefault: "Simulating battlefield situation…",
    hudRedDefault: "Red",
    hudBlueDefault: "Blue",

    // Tooltips & Markers
    locCapital: "Strategic Hub",
    locFortress: "Fortress / Pass",
    locFord: "Key Ford / Bridge",
    locBridge: "Key Bridge",
    locBeach: "Landing Beach",
    locPort: "Strategic Port",
    locDropzone: "Airborne Drop Zone",
    locDefault: "Landmark",
    locFallbackBody: "Key geographic point of the campaign",
    unitSelected: "Selected Unit",
    unit3d: "3D Formation",
    unitStereo: "Formation",
    unitCurrent: "Active Unit",
    unitFallbackBody: "Combat formation",
    markerFire: "Fire Raid",
    markerTurning: "Turning Point",
    markerVictory: "Breakthrough",
    markerAirborne: "Airborne Drop",
    markerAmphibious: "Amphibious Landing",
    markerBridge: "Bridge Assault",
    markerClash: "Key Engagement",

    // Phase Controls
    phasePrev: "Previous Phase",
    phaseNext: "Next Phase",
    playTour: "Auto Play",
    pauseTour: "Pause",

    // Sections
    sec01Label: "Command & Order of Battle",
    sec01TitleHtml: "First see who commands,<br />then follow where armies move.",
    sec01Deck: "Formations reposition dynamically across phases. Switch phases to inspect each unit's mission; hover or click any 3D squad or landmark for tactical notes.",
    orderSuffix: " OOB",
    dossierEyebrow: "PHASE OPERATION LOG",
    sec02Label: "Battlefield Situation",
    sec03DefaultLabel: "Strategic Logic",
    sec04Label: "Campaign Chronicle",
    closingBackSandtable: "Back to Sandtable ↑",
    closingBackArchive: "Battle Archives →",

    // Footer
    footerSubtitle: "Interactive Historical Campaign Simulator",
    footerSourcesLabel: "Historical Sources & References",
    footerDisclaimer: "Maps are schematic tactical representations, not precision cartography. Force estimates synthesize public historical sources where accounts vary.",
    mapTitleSuffix: " Tactical Map",
    mapDescSuffix: "Phase-by-phase simulation of opposing deployments and maneuvers."
  }
};

export const MARKER_GLYPHS_EN = {
  fire: "🔥",
  clash: "⚔",
  turning: "✦",
  victory: "★",
  airborne: "▼",
  amphibious: "⚓",
  bridge: "⌘"
};

function detectInitialLang() {
  try {
    const param = new URLSearchParams(window.location.search).get("lang");
    if (param === "en" || param === "zh") {
      localStorage.setItem(STORAGE_KEY, param);
      return param;
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "zh") return saved;
  } catch (_) {}
  return "zh";
}

let currentLang = detectInitialLang();

export function getLang() {
  return currentLang;
}

export function isEn() {
  return currentLang === "en";
}

export function setLang(lang) {
  const next = lang === "en" ? "en" : "zh";
  currentLang = next;
  document.documentElement.lang = next === "en" ? "en" : "zh-CN";
  try {
    localStorage.setItem(STORAGE_KEY, next);
    const url = new URL(window.location.href);
    if (next === "en") url.searchParams.set("lang", "en");
    else url.searchParams.delete("lang");
    window.history.replaceState(window.history.state, "", url.toString());
  } catch (_) {}
  return next;
}

export function t(key) {
  return DICT[currentLang]?.[key] ?? DICT.zh[key] ?? key;
}

export function getLocalizedEntry(entry) {
  if (!entry) return entry;
  if (currentLang !== "en" || !entry.en) return entry;
  return { ...entry, ...entry.en };
}

/**
 * 将英文翻译覆盖层无损合并到标准化的战役数据上：
 * - 保留所有地理坐标、SVG 路径、主题配色与兵种判定提示（_rawLabel / _rawSub）
 * - 同步翻译地名与 phase.keys，确保 2D/3D 关键节点高亮与提示完全一致
 */
export function applyBattleOverlay(battle, overlay) {
  if (!overlay) return battle;
  const locMap = overlay.locations || {};
  const riverMap = overlay.riverLabels || {};
  const regionMap = overlay.regionLabels || {};

  let terrainSvg = battle.mapConfig.terrainSvg || "";
  if (terrainSvg) {
    const svgLabelMap = { ...regionMap, ...riverMap };
    Object.entries(svgLabelMap).forEach(([zhText, enText]) => {
      terrainSvg = terrainSvg.replaceAll(`>${zhText}</text>`, `>${enText}</text>`);
    });
  }

  const mapConfig = {
    ...battle.mapConfig,
    terrainSvg,
    scaleNote: overlay.mapConfig?.scaleNote ?? battle.mapConfig.scaleNote,
    filterSides: overlay.mapConfig?.filterSides
      ? { ...battle.mapConfig.filterSides, ...overlay.mapConfig.filterSides }
      : battle.mapConfig.filterSides,
    legends: (battle.mapConfig.legends || []).map((leg, i) => ({
      ...leg,
      label: overlay.mapConfig?.legends?.[i] ?? leg.label
    })),
    locations: (battle.mapConfig.locations || []).map((loc) => {
      const tr = locMap[loc.name];
      if (!tr) return loc;
      return {
        ...loc,
        _rawName: loc.name,
        name: typeof tr === "string" ? tr : tr.name || loc.name,
        sub: typeof tr === "object" && tr.sub !== undefined ? tr.sub : loc.sub
      };
    }),
    terrain: {
      ...battle.mapConfig.terrain,
      riverLabels: (battle.mapConfig.terrain?.riverLabels || []).map((r) => ({
        ...r,
        text: riverMap[r.text] ?? r.text
      })),
      regionLabels: (battle.mapConfig.terrain?.regionLabels || []).map((r) => ({
        ...r,
        text: regionMap[r.text] ?? r.text
      }))
    }
  };

  const translatePlace = (name) => {
    const tr = locMap[name];
    if (!tr) return name;
    return typeof tr === "string" ? tr : tr.name || name;
  };

  const phases = (battle.phases || []).map((p, idx) => {
    const po = overlay.phases?.[idx] || {};
    const fMap = po.formations || {};
    return {
      ...p,
      short: po.short ?? p.short,
      name: po.name ?? p.name,
      date: po.date ?? p.date,
      tag: po.tag ?? p.tag,
      intent: po.intent ?? p.intent,
      goal: po.goal ?? p.goal,
      result: po.result ?? p.result,
      keys: (p.keys || []).map(translatePlace),
      detail: po.detail ?? p.detail,
      markers: (p.markers || []).map((m, mi) => {
        const mo = po.markers?.[mi];
        if (!mo) return { ...m, glyph: MARKER_GLYPHS_EN[m.type] || "⚔" };
        return {
          ...m,
          label: mo.label ?? m.label,
          desc: mo.desc ?? m.desc,
          glyph: mo.glyph ?? MARKER_GLYPHS_EN[m.type] ?? "⚔"
        };
      }),
      formations: (p.formations || []).map((u) => {
        const uo = fMap[u.id];
        return {
          ...u,
          _rawLabel: u.label,
          _rawSub: u.sub,
          label: uo?.label ?? u.label,
          sub: uo?.sub ?? u.sub,
          detail: uo?.detail ?? u.detail
        };
      })
    };
  });

  return {
    ...battle,
    title: overlay.title ?? battle.title,
    subtitle: overlay.subtitle ?? battle.subtitle,
    era: overlay.era ?? battle.era,
    period: overlay.period ?? battle.period,
    seal: overlay.seal ?? battle.seal,
    meta: overlay.meta ? { ...battle.meta, ...overlay.meta } : battle.meta,
    mapConfig,
    phases,
    commanders: overlay.commanders ? { ...battle.commanders, ...overlay.commanders } : battle.commanders,
    orderOfBattle: overlay.orderOfBattle ? { ...battle.orderOfBattle, ...overlay.orderOfBattle } : battle.orderOfBattle,
    situation: overlay.situation
      ? {
          ...battle.situation,
          ...overlay.situation,
          forceComparison: overlay.situation.forceComparison
            ? {
                ...battle.situation.forceComparison,
                ...overlay.situation.forceComparison,
                red: { ...battle.situation.forceComparison?.red, ...overlay.situation.forceComparison?.red },
                blue: { ...battle.situation.forceComparison?.blue, ...overlay.situation.forceComparison?.blue }
              }
            : battle.situation.forceComparison,
          deployments: overlay.situation.deployments
            ? {
                red: { ...battle.situation.deployments?.red, ...overlay.situation.deployments?.red },
                blue: { ...battle.situation.deployments?.blue, ...overlay.situation.deployments?.blue }
              }
            : battle.situation.deployments
        }
      : battle.situation,
    logic: overlay.logic
      ? {
          ...battle.logic,
          ...overlay.logic,
          decisionLoop: overlay.logic.decisionLoop
            ? { ...battle.logic.decisionLoop, ...overlay.logic.decisionLoop }
            : battle.logic.decisionLoop
        }
      : battle.logic,
    chronicle: overlay.chronicle ? { ...battle.chronicle, ...overlay.chronicle } : battle.chronicle,
    sources: overlay.sources ?? battle.sources
  };
}
