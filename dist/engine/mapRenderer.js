// 通用交互式战役沙盘渲染引擎（Three.js 全面战争/帝国时代 3D 战争游戏场景 + 2D 矢量平面双模）
// 支持真实起伏地形与实时软阴影、实体 3D 森林与城池关隘、分时代不同军装 3D 立体小人方阵/骑兵/坦克、
// 飘扬战旗、三维行军先锋、抛物线炮火/箭雨弹道、点击拾取选中与自由 360° 近景漫游

import { Terrain3DEngine, getBattleEnvLabel } from "./terrain3d.js?v=30";
import { t, getLang, MARKER_GLYPHS_EN } from "./i18n.js?v=25";
import { VoiceNarrator } from "./voiceNarrator.js?v=3";
import { getPhaseTurnScript } from "../data/turnScripts.js?v=2";
import { makeEventId, getEventMeta, getDefaultPrecision, getPhaseSceneCount } from "../data/eventMeta.js?v=5";

const SVG_NS = "http://www.w3.org/2000/svg";
const PLATE_HEIGHT = 30;
const CANVAS_BOUNDS = { minX: 16, maxX: 864, minY: 56, maxY: 668 };

function makeSvg(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, String(v));
  }
  return el;
}

function estimatePlateWidth(label = "", sub = "") {
  const countUnits = (str) =>
    [...str].reduce((acc, ch) => acc + (ch.charCodeAt(0) > 255 ? 10.6 : 6.0), 0);
  const wLabel = countUnits(label) + 20;
  const wSub = countUnits(sub) * 0.78 + 20;
  return Math.max(98, Math.min(158, Math.ceil(Math.max(wLabel, wSub))));
}

function boxesOverlap(a, b, pad = 4) {
  return !(
    a.x + a.w + pad <= b.x ||
    b.x + b.w + pad <= a.x ||
    a.y + a.h + pad <= b.y ||
    b.y + b.h + pad <= a.y
  );
}

function overlapArea(a, b, pad = 4) {
  const ox = Math.max(0, Math.min(a.x + a.w + pad, b.x + b.w + pad) - Math.max(a.x, b.x));
  const oy = Math.max(0, Math.min(a.y + a.h + pad, b.y + b.h + pad) - Math.max(a.y, b.y));
  return ox * oy;
}

function clampBox(box) {
  const x = Math.max(CANVAS_BOUNDS.minX, Math.min(CANVAS_BOUNDS.maxX - box.w, box.x));
  const y = Math.max(CANVAS_BOUNDS.minY, Math.min(CANVAS_BOUNDS.maxY - box.h, box.y));
  return { ...box, x, y };
}

function getLocationLabelBoxes(locations = [], keyNames = []) {
  const boxes = [];
  for (const loc of locations) {
    const isKey = keyNames.includes(loc.name);
    const lx = loc.x + (loc.labelX !== undefined ? loc.labelX : 11);
    const ly = loc.y + (loc.labelY !== undefined ? loc.labelY : -8);
    const w = [...loc.name].length * 12 + 8;
    // 地名文本大约在 [lx, ly - 11] 到 [lx + w, ly + 3]
    boxes.push({
      x: lx - 2,
      y: ly - 12,
      w,
      h: 15,
      weight: isKey ? 1.8 : 0.7
    });
    // 地标圆点本身
    boxes.push({
      x: loc.x - 7,
      y: loc.y - 7,
      w: 14,
      h: 14,
      weight: isKey ? 2.2 : 1.0
    });
  }
  return boxes;
}

function buildCandidates(unit, w, h) {
  const candidates = [];
  // 如果数据层显式指定了 dx / dy，将其放在首位
  if (typeof unit.dx === "number" || typeof unit.dy === "number") {
    const dx = unit.dx ?? 14;
    const dy = unit.dy ?? -22;
    candidates.push({ x: unit.x + dx, y: unit.y + dy, pref: 0 });
  }

  const preferLeft = unit.anchor === "left" || unit.x > 670;
  const preferTop = unit.anchor === "top";
  const preferBottom = unit.anchor === "bottom";

  const slots = [
    { key: "right-up", x: unit.x + 14, y: unit.y - h + 6 },
    { key: "left-up", x: unit.x - w - 14, y: unit.y - h + 6 },
    { key: "right-down", x: unit.x + 14, y: unit.y + 8 },
    { key: "left-down", x: unit.x - w - 14, y: unit.y + 8 },
    { key: "top-center", x: unit.x - w / 2, y: unit.y - h - 14 },
    { key: "bottom-center", x: unit.x - w / 2, y: unit.y + 14 },
    { key: "right-far", x: unit.x + 26, y: unit.y - h / 2 },
    { key: "left-far", x: unit.x - w - 26, y: unit.y - h / 2 }
  ];

  // 按偏好排序
  slots.sort((a, b) => {
    const score = (s) => {
      let sc = 0;
      if (preferLeft && s.key.startsWith("left")) sc -= 2;
      if (!preferLeft && !preferTop && !preferBottom && s.key.startsWith("right")) sc -= 2;
      if (preferTop && s.key.startsWith("top")) sc -= 3;
      if (preferBottom && s.key.startsWith("bottom")) sc -= 3;
      if (s.key.includes("far")) sc += 2;
      return sc;
    };
    return score(a) - score(b);
  });

  slots.forEach((s, i) => candidates.push({ x: s.x, y: s.y, pref: (i + 1) * 18 }));
  return candidates;
}

function resolvePlatePlacements(formations, locations, keyNames) {
  const obstacles = getLocationLabelBoxes(locations, keyNames);
  const placed = new Map();
  const placedBoxes = [];

  for (const unit of formations) {
    const w = estimatePlateWidth(unit.label, unit.sub);
    const h = PLATE_HEIGHT;
    const candidates = buildCandidates(unit, w, h);

    let bestBox = null;
    let bestCost = Infinity;

    for (const cand of candidates) {
      const box = clampBox({ x: cand.x, y: cand.y, w, h });
      let cost = cand.pref;
      // 惩罚越界被强行夹回
      cost += (Math.abs(box.x - cand.x) + Math.abs(box.y - cand.y)) * 6;
      // 强烈惩罚与已放置番号牌重叠
      for (const other of placedBoxes) {
        const area = overlapArea(box, other, 6);
        if (area > 0) cost += 2200 + area * 8;
      }
      // 适度惩罚遮挡地名与关键点
      for (const obs of obstacles) {
        const area = overlapArea(box, obs, 3);
        if (area > 0) cost += (140 + area * 2.2) * obs.weight;
      }
      if (cost < bestCost) {
        bestCost = cost;
        bestBox = box;
      }
    }

    placedBoxes.push(bestBox);
    placed.set(unit.id, bestBox);
  }

  // 二次微调：如果极端密集仍有轻微番号牌重叠，做几轮轻量斥力分离
  const entries = [...placed.entries()];
  for (let iter = 0; iter < 6; iter++) {
    let moved = false;
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const a = entries[i][1];
        const b = entries[j][1];
        if (!boxesOverlap(a, b, 5)) continue;
        moved = true;
        const dy = a.y + a.h / 2 <= b.y + b.h / 2 ? -1 : 1;
        const overlapY = Math.min(a.y + a.h + 5, b.y + b.h + 5) - Math.max(a.y, b.y);
        const shift = Math.min(12, overlapY / 2 + 2);
        const na = clampBox({ ...a, y: a.y + dy * shift });
        const nb = clampBox({ ...b, y: b.y - dy * shift });
        entries[i][1] = na;
        entries[j][1] = nb;
        placed.set(entries[i][0], na);
        placed.set(entries[j][0], nb);
      }
    }
    if (!moved) break;
  }

  return placed;
}

const MARKER_GLYPHS = {
  fire: "火",
  clash: "战",
  turning: "转",
  victory: "胜",
  airborne: "伞",
  amphibious: "登",
  bridge: "桥"
};

const DEFAULT_CAM_3D = { pitch: 38, yaw: -10, zoom: 1.04, panX: 0, panY: 0 };
const LOW_FLY_CAM_3D = { pitch: 22, yaw: -24, zoom: 1.38, panX: 0, panY: 20 };
const DEFAULT_CAM_2D = { pitch: 0, yaw: 0, zoom: 1.0, panX: 0, panY: 0 };
const TURN_DURATION_MS = 3800;

function getMarkerGlyph(m) {
  const type = m.type || "clash";
  if (getLang() === "en") return m.glyph || MARKER_GLYPHS_EN[type] || "⚔";
  return m.glyph || MARKER_GLYPHS[type] || "战";
}

function getMarkerKicker(type) {
  const map = {
    fire: t("markerFire"),
    turning: t("markerTurning"),
    victory: t("markerVictory"),
    airborne: t("markerAirborne"),
    amphibious: t("markerAmphibious"),
    bridge: t("markerBridge")
  };
  return map[type] || t("markerClash");
}

function getLocKicker(kind) {
  const map = {
    capital: t("locCapital"),
    fortress: t("locFortress"),
    ford: t("locFord"),
    bridge: t("locBridge"),
    beach: t("locBeach"),
    port: t("locPort"),
    dropzone: t("locDropzone")
  };
  return map[kind] || t("locDefault");
}

function inferUnitKind(unit, battle) {
  if (unit.kind) return unit.kind;
  const text = `${unit._rawLabel || unit.label || ""} ${unit._rawSub || unit.sub || ""}`;
  if (/军委|司令|大营|中军|师部|兵团部|许都|行营|指挥|总部|集团军群/.test(text)) return "command";
  if (/伞|空降|滑翔|航空/.test(text)) return "airborne";
  if (/舰|船|两栖|登陆/.test(text)) return "navy";
  if (/发石|霹雳|炮|高橹/.test(text)) return "artillery";
  if (/骑|关羽|张辽|文丑|颜良|乌巢/.test(text)) return "cavalry";
  if (/装甲|坦克|第30军|党卫军|美陆战|机械化/.test(text)) return "armor";
  if (battle?.id === "guandu-200" && unit.side === "red" && /徐晃/.test(text)) return "cavalry";
  return "infantry";
}

function inferBattleRouteKind(battle) {
  if (!battle) return "infantry";
  if (battle.id === "guandu-200") return "cavalry";
  if (battle.id === "normandy-1944") return "navy";
  if (battle.id === "market-garden-1944" || battle.id === "sinai-1973") return "armor";
  return "infantry";
}

function get3DUnitIconSvg(kind) {
  switch (kind) {
    case "command":
      return `<svg viewBox="0 0 28 28" aria-hidden="true">
        <path d="M8 24V4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M9 5L23 8.5L18.5 12L23 15.5L9 17Z" fill="currentColor" fill-opacity="0.92"/>
        <polygon points="14,8.6 15,10.8 17.4,11 15.6,12.5 16.2,14.8 14,13.6 11.8,14.8 12.4,12.5 10.6,11 13,10.8" fill="#fff"/>
      </svg>`;
    case "cavalry":
      return `<svg viewBox="0 0 28 28" aria-hidden="true">
        <path d="M5 21L13 13L18 15L23 8" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M7 18C9 12 14 9 20 8L22 12L17 15L19 22H15L13.5 17L10 22H7Z" fill="currentColor"/>
        <path d="M18 5L25 7L19 10Z" fill="#fff" fill-opacity="0.9"/>
      </svg>`;
    case "armor":
      return `<svg viewBox="0 0 28 28" aria-hidden="true">
        <rect x="4" y="16" width="20" height="6" rx="3" fill="currentColor"/>
        <path d="M8 16L10.5 10.5H17.5L20 16Z" fill="currentColor" fill-opacity="0.92"/>
        <path d="M17 12.5H25.5" stroke="#fff" stroke-width="2.1" stroke-linecap="round"/>
        <circle cx="8" cy="19" r="1.4" fill="#fff" fill-opacity="0.75"/>
        <circle cx="14" cy="19" r="1.4" fill="#fff" fill-opacity="0.75"/>
        <circle cx="20" cy="19" r="1.4" fill="#fff" fill-opacity="0.75"/>
      </svg>`;
    case "airborne":
      return `<svg viewBox="0 0 28 28" aria-hidden="true">
        <path d="M4 13C4 7.5 8.5 4 14 4C19.5 4 24 7.5 24 13Z" fill="currentColor"/>
        <path d="M6 13L14 21M14 13V21M22 13L14 21" stroke="#fff" stroke-width="1.3" stroke-opacity="0.85"/>
        <circle cx="14" cy="22.5" r="2.2" fill="#fff"/>
      </svg>`;
    case "navy":
      return `<svg viewBox="0 0 28 28" aria-hidden="true">
        <path d="M3 18L6 23H22L25 18H3Z" fill="currentColor"/>
        <path d="M8 18V12H16V18M12 12V7H14.5V12" fill="currentColor" fill-opacity="0.9"/>
        <path d="M16 14H22" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>
      </svg>`;
    case "artillery":
      return `<svg viewBox="0 0 28 28" aria-hidden="true">
        <path d="M6 19L21 9" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>
        <circle cx="11" cy="19" r="4.5" fill="none" stroke="#fff" stroke-width="2"/>
        <circle cx="11" cy="19" r="1.6" fill="currentColor"/>
        <path d="M21 7L24 5.5" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>
      </svg>`;
    default:
      return `<svg viewBox="0 0 28 28" aria-hidden="true">
        <path d="M14 4L22 8V15C22 19.6 18.6 22.8 14 24.5C9.4 22.8 6 19.6 6 15V8Z" fill="currentColor"/>
        <path d="M10 15.5L14 11.5L18 15.5M10 19L14 15L18 19" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
  }
}

function get3DLandmarkIconSvg(kind) {
  if (kind === "capital") {
    return `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20V9H7V6H10V9H14V6H17V9H20V20Z" fill="currentColor"/>
      <rect x="10.2" y="13.5" width="3.6" height="6.5" rx="1.6" fill="#121412" fill-opacity="0.75"/>
    </svg>`;
  }
  if (kind === "ford") {
    return `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 13H21V16H18.5C18 13.8 15.5 13.8 15 16H9C8.5 13.8 6 13.8 5.5 16H3Z" fill="currentColor"/>
      <path d="M4 11L12 7L20 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 20V10L12 5L18 10V20Z" fill="currentColor"/>
    <path d="M12 5V2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <rect x="10.5" y="13" width="3" height="7" fill="#121412" fill-opacity="0.7"/>
  </svg>`;
}

// 四渡赤水专属：三国志风格单字书法帅旗/将旗徽记
const CHISHUI_SANGUO_GLYPHS = {
  "red-command": "帅",
  "red-1": "一",
  "red-3": "三",
  "red-5": "五",
  "red-9": "九",
  "red-decoy": "疑",
  cadre: "干",
  sichuan: "川",
  "central-zhou": "周",
  "central-wu": "吴",
  yunnan: "滇",
  guizhou: "黔"
};

function getSanguoBannerGlyph(unitId, unit) {
  if (CHISHUI_SANGUO_GLYPHS[unitId]) return CHISHUI_SANGUO_GLYPHS[unitId];
  const raw = (unit?._rawLabel || unit?.label || "").trim();
  if (/军委|指挥|总/.test(raw)) return "帅";
  if (/佯动|疑/.test(raw)) return "疑";
  const numMatch = raw.match(/([一二三四五六七八九1-9])/);
  if (numMatch) {
    const map = { "1": "一", "2": "二", "3": "三", "4": "四", "5": "五", "6": "六", "7": "七", "8": "八", "9": "九" };
    return map[numMatch[1]] || numMatch[1];
  }
  return raw.charAt(0) || (unit?.side === "red" ? "红" : "军");
}

function getSanguoLandmarkSeal(kind) {
  if (kind === "fortress") return "关";
  if (kind === "ford") return "渡";
  if (kind === "capital" || kind === "city") return "城";
  return "";
}

export class MapRenderer {
  constructor(stageEl) {
    this.stageEl = stageEl;
    this.viewportEl = stageEl.querySelector("#sandtable-viewport");
    this.worldEl = stageEl.querySelector("#sandtable-world");
    this.svgEl = stageEl.querySelector(".battle-map");
    this.layer3dEl = stageEl.querySelector("#layer-3d");
    this.landmarks3dEl = stageEl.querySelector("#layer-3d-landmarks");
    this.movers3dEl = stageEl.querySelector("#layer-3d-movers");
    this.markers3dEl = stageEl.querySelector("#layer-3d-markers");
    this.units3dEl = stageEl.querySelector("#layer-3d-units");
    this.tooltipEl = stageEl.querySelector("#map-tooltip");

    // WebGL 真三维起伏地形引擎与贴地投影叠加层
    this.terrain3d = new Terrain3DEngine(stageEl.querySelector("#terrain-3d-canvas"));
    this.glOverlayEl = stageEl.querySelector("#terrain-3d-overlay");
    this.glCompareSvgEl = stageEl.querySelector("#gl-compare-svg");
    this.glLandmarksEl = stageEl.querySelector("#gl-landmarks");
    this.glMoversEl = stageEl.querySelector("#gl-movers");
    this.glMarkersEl = stageEl.querySelector("#gl-markers");
    this.glUnitsEl = stageEl.querySelector("#gl-units");
    this.hudCompassNeedleEl = stageEl.querySelector("#hud-compass-needle");
    this.hudEnvBadgeEl = stageEl.querySelector("#hud-env-badge");
    this.turnProgressFillEl = stageEl.querySelector("#turn-progress-fill");
    this.sceneSeekEl = stageEl.querySelector("#scene-seek");
    this.scenePositionEl = stageEl.querySelector("#scene-position");
    this.sceneStops = [];
    this.bannerEl = stageEl.querySelector("#cinematic-banner");
    this.voiceBtnEl = stageEl.querySelector("#turn-voice-btn");
    this.castEl = stageEl.querySelector("#live-commentary");
    this.castFeedEl = stageEl.querySelector("#live-cast-feed");
    this.castStepEl = stageEl.querySelector("#live-cast-step");
    this.castToggleEl = stageEl.querySelector("#live-cast-toggle");
    this.castSourceBtnEl = stageEl.querySelector("#live-cast-source-btn");
    this.castSourcesEl = stageEl.querySelector("#live-cast-sources");
    this.castPrecisionEl = stageEl.querySelector("#live-cast-precision");
    this.tourPillEl = stageEl.querySelector("#tour-pill");
    this.tourPillTextEl = stageEl.querySelector("#tour-pill-text");
    this.tourExitBtnEl = stageEl.querySelector("#tour-exit-btn");
    this.comparePillEl = stageEl.querySelector("#compare-pill");
    this.settingsWrapEl = stageEl.querySelector("#map-settings-wrap");
    this.settingsBtnEl = stageEl.querySelector("#map-settings-btn");
    this.settingsPanelEl = stageEl.querySelector("#map-settings-panel");
    this.shareBtnEl = stageEl.querySelector("#share-scene-btn");
    this.shareToastEl = stageEl.querySelector("#share-toast");
    this.narrator = new VoiceNarrator();
    this.bannerTimer = null;
    this.shareToastTimer = null;
    this.stageEl.classList.toggle("has-webgl", this.terrain3d.ready);

    this.battle = null;
    this.currentPhase = 0;
    this.phaseRenderedIndex = -1;
    this.forceFilter = "all";
    this.layers = {
      formations: true,
      enemy: true,
      combat: true,
      labels: true
    };
    this.activeUnitMap = new Map();
    this.prevPhaseCoords = new Map();

    // 统一播放控制器与稳定事件状态（回合推进、跨阶段导览、URL 深链与实况解说全部对齐同一事件 ID）
    this.turnMode = "step"; // "step" | "all"
    this.turns = [];
    this.currentTurn = 0;
    this.turnPlaying = false;
    this.continuousPlay = false;
    this.guidedTour = null;
    this.turnTimer = null;
    this.turnDeadline = null;
    this.turnRemaining = null;
    this.turnStartTime = performance.now();
    this.onTurnChange = null;
    this.onEventChange = null;
    this.sourcesOpen = false;
    this.activeComparePairs = [];
    this._glCompareEmpty = true;

    // 3D 立体相机状态（默认开启 3D 立体起伏地形 + 纪录片智能聚焦运镜）
    this.viewMode = "3d";
    this.autoCamera = true;
    this.cam = { ...DEFAULT_CAM_3D };
    this.glCam = { ...DEFAULT_CAM_3D };
    this.dragState = null;
    this.moverRaf = null;
    this.movers = [];
    this.glRaf = null;
    this.glStartTime = performance.now();
    this.phaseStartTime = performance.now();
    this.glLandmarks = [];
    this.glMarkers = [];
    this.glUnits = new Map();
    this.glMovers = [];
    this.prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.bindStageInteractions();
    this.bindCameraControls();
    this.bindTurnControls();
    this.applyCamera({ immediate: true });

    if (this.terrain3d.ready && this.viewportEl && typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => this.terrain3d.resize());
      this.resizeObserver.observe(this.viewportEl);
    }
  }

  bindStageInteractions() {
    if (!this.stageEl) return;
    this.stageEl.addEventListener("mouseleave", () => this.hideTooltip());
  }

  bindCameraControls() {
    // 视角模式按钮（3D 立体 / 2D 平面）与缩放/重置按钮
    this.stageEl.querySelectorAll("[data-view-mode]").forEach((btn) => {
      btn.addEventListener("click", () => this.setViewMode(btn.dataset.viewMode));
    });
    this.stageEl.querySelectorAll("[data-cam-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.camAction;
        if (action === "zoom-in") {
          this.cam.zoom = Math.min(2.2, +(this.cam.zoom * 1.18).toFixed(2));
          this.applyCamera();
        } else if (action === "zoom-out") {
          this.cam.zoom = Math.max(0.74, +(this.cam.zoom / 1.18).toFixed(2));
          this.applyCamera();
        } else if (action === "low-fly") {
          if (this.viewMode !== "3d") this.setViewMode("3d");
          this.cam = { ...LOW_FLY_CAM_3D };
          this.applyCamera();
        } else if (action === "auto-cam") {
          this.autoCamera = !this.autoCamera;
          btn.classList.toggle("is-active", this.autoCamera);
          btn.setAttribute("aria-pressed", String(this.autoCamera));
          if (this.autoCamera && this.battle) {
            this.focusCameraOnPhase(this.battle.phases[this.currentPhase], this.currentPhase);
          }
        } else if (action === "toggle-style") {
          const cur = this.stageEl.dataset.mapStyle || "game";
          const isChishui = this.battle?.id === "chishui-1935";
          const next = isChishui
            ? cur === "sanguo"
              ? "game"
              : cur === "game"
                ? "realistic"
                : "sanguo"
            : cur === "realistic"
              ? "game"
              : "realistic";
          this.applyMapStyle(next, { rebuildFortresses: isChishui });
        } else if (action === "reset") {
          this.cam = this.viewMode === "3d" ? { ...DEFAULT_CAM_3D } : { ...DEFAULT_CAM_2D };
          this.applyCamera();
        } else if (action === "expand") {
          const section = this.stageEl.closest(".sandtable");
          if (section) {
            const expanded = section.classList.toggle("is-expanded");
            btn.classList.toggle("is-active", expanded);
            btn.setAttribute("aria-pressed", String(expanded));
            btn.textContent = expanded ? t("btnBriefShow") : t("btnBriefHide");
            setTimeout(() => this.terrain3d.resize(), 380);
          }
        }
      });
    });

    if (!this.viewportEl) return;

    // 指针拖拽旋转/倾斜/平移（支持在任意位置起手拖拽，超过 5px 判定为拖拽不误触点击）
    this.viewportEl.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      this.dragState = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startYaw: this.cam.yaw,
        startPitch: this.cam.pitch,
        startPanX: this.cam.panX,
        startPanY: this.cam.panY,
        panMode: this.viewMode === "2d" || e.shiftKey,
        moved: false
      };
    });

    this.viewportEl.addEventListener("pointermove", (e) => {
      if (!this.dragState || e.pointerId !== this.dragState.pointerId) return;
      const dx = e.clientX - this.dragState.startX;
      const dy = e.clientY - this.dragState.startY;
      if (!this.dragState.moved) {
        if (Math.hypot(dx, dy) < 5) return;
        this.dragState.moved = true;
        this.viewportEl.classList.add("is-dragging");
        try {
          this.viewportEl.setPointerCapture(e.pointerId);
        } catch (_) {}
      }
      if (this.dragState.panMode) {
        this.cam.panX = Math.max(-240, Math.min(240, this.dragState.startPanX + dx));
        this.cam.panY = Math.max(-200, Math.min(200, this.dragState.startPanY + dy));
      } else if (this.terrain3d.ready) {
        // WebGL 真三维模式支持 360° 自由环绕与低空俯仰
        this.cam.yaw = this.dragState.startYaw - dx * 0.34;
        this.cam.pitch = Math.max(16, Math.min(78, this.dragState.startPitch + dy * 0.24));
      } else {
        this.cam.yaw = Math.max(-55, Math.min(55, this.dragState.startYaw + dx * 0.24));
        this.cam.pitch = Math.max(14, Math.min(62, this.dragState.startPitch - dy * 0.2));
      }
      this.applyCamera({ immediate: true });
    });

    const endDrag = (e) => {
      if (!this.dragState || e.pointerId !== this.dragState.pointerId) return;
      this.viewportEl.classList.remove("is-dragging");
      try {
        this.viewportEl.releasePointerCapture(e.pointerId);
      } catch (_) {}
      this.dragState = null;
    };
    this.viewportEl.addEventListener("pointerup", endDrag);
    this.viewportEl.addEventListener("pointercancel", endDrag);

    // 滚轮缩放
    this.viewportEl.addEventListener(
      "wheel",
      (e) => {
        if (!e.ctrlKey && Math.abs(e.deltaY) < 4) return;
        e.preventDefault();
        const factor = e.deltaY > 0 ? 0.92 : 1.09;
        this.cam.zoom = Math.max(0.74, Math.min(2.2, +(this.cam.zoom * factor).toFixed(2)));
        this.applyCamera({ immediate: true });
      },
      { passive: false }
    );
  }

  bindTurnControls() {
    this.sceneSeekEl?.addEventListener("input", () => {
      const scene = this.sceneStops[Number(this.sceneSeekEl.value)];
      if (scene) this.goToScene(scene.phase, scene.turn, { narrate: false, scrubbing: true });
    });
    this.sceneSeekEl?.addEventListener("change", () => {
      this.emitEventChange({ scrubbing: false });
    });
    this.stageEl.querySelector("#turn-prev")?.addEventListener("click", () => {
      this.stepScene(-1);
    });
    this.stageEl.querySelector("#turn-next")?.addEventListener("click", () => {
      this.stepScene(1);
    });
    this.stageEl.querySelector("#turn-play")?.addEventListener("click", () => {
      this.toggleUnifiedPlay({ continuous: Boolean(this.guidedTour) || this.continuousPlay });
    });
    this.stageEl.querySelector("#turn-mode-btn")?.addEventListener("click", () => {
      if (this.turnMode === "step") {
        this.stopTurnTimer();
        this.narrator.stop();
        this.turnMode = "all";
        this.applyTurn(-1);
      } else {
        this.turnMode = "step";
        this.turnPlaying = true;
        this.applyTurn(0);
      }
    });
    this.voiceBtnEl?.addEventListener("click", () => {
      if (!this.narrator.isSupported()) {
        this.voiceBtnEl.title = t("voiceUnsupported");
        return;
      }
      const next = !this.narrator.isEnabled();
      this.narrator.setEnabled(next);
      this.updateVoiceButton();
      if (next) {
        if (this.turnTimer) {
          clearTimeout(this.turnTimer);
          this.turnTimer = null;
        }
        this.speakCurrentTurn(() => this.scheduleNextTurnAfterSpeech());
      } else if (this.turnPlaying && this.turnMode === "step") {
        this.scheduleTurnTimeout();
      }
    });
    this.updateVoiceButton();

    // 左上角游戏直播风格实况解说框：独立滚动不触发沙盘缩放，支持一键折叠与史料出处展开
    if (this.castEl) {
      this.castEl.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });
      this.castEl.addEventListener("pointerdown", (e) => e.stopPropagation());
    }
    this.castToggleEl?.addEventListener("click", () => {
      if (!this.castEl) return;
      const collapsed = this.castEl.classList.toggle("is-collapsed");
      this.castToggleEl.textContent = collapsed ? "+" : "−";
      this.castToggleEl.setAttribute("aria-expanded", String(!collapsed));
    });
    this.castSourceBtnEl?.addEventListener("click", () => {
      if (!this.sourcesOpen && this.isUnifiedPlaying()) this.pauseUnified();
      this.sourcesOpen = !this.sourcesOpen;
      if (this.castSourcesEl) this.castSourcesEl.hidden = !this.sourcesOpen;
      this.castSourceBtnEl.classList.toggle("is-active", this.sourcesOpen);
      this.castSourceBtnEl.setAttribute("aria-expanded", String(this.sourcesOpen));
    });

    // 退出导览按钮
    this.tourExitBtnEl?.addEventListener("click", () => {
      this.pauseUnified({ notify: false });
      this.setGuidedTour(null, { notify: true });
    });

    // 桌面「地图设置」收纳浮层
    if (this.settingsPanelEl) {
      this.settingsPanelEl.addEventListener("pointerdown", (e) => e.stopPropagation());
      this.settingsPanelEl.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });
    }
    this.settingsBtnEl?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!this.settingsPanelEl) return;
      const nextOpen = this.settingsPanelEl.hidden;
      this.settingsPanelEl.hidden = !nextOpen;
      this.settingsBtnEl.classList.toggle("is-active", nextOpen);
      this.settingsBtnEl.setAttribute("aria-expanded", String(nextOpen));
    });
    document.addEventListener("click", (e) => {
      if (!this.settingsPanelEl || this.settingsPanelEl.hidden) return;
      if (this.settingsWrapEl?.contains(e.target)) return;
      this.settingsPanelEl.hidden = true;
      this.settingsBtnEl?.classList.remove("is-active");
      this.settingsBtnEl?.setAttribute("aria-expanded", "false");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.settingsPanelEl && !this.settingsPanelEl.hidden) {
        this.settingsPanelEl.hidden = true;
        this.settingsBtnEl?.classList.remove("is-active");
        this.settingsBtnEl?.setAttribute("aria-expanded", "false");
      }
    });

    // 一键复制当前一幕深链分享 URL
    this.shareBtnEl?.addEventListener("click", async () => {
      const sceneUrl = new URL(window.location.href);
      sceneUrl.hash = "";
      const url = sceneUrl.href;
      let copied = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);
          copied = true;
        }
      } catch {
        copied = false;
      }
      if (!copied) {
        try {
          const ta = document.createElement("textarea");
          ta.value = url;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.append(ta);
          ta.select();
          copied = document.execCommand("copy");
          ta.remove();
        } catch {
          copied = false;
        }
      }
      if (this.shareToastEl) {
        this.shareToastEl.textContent = copied ? t("shareCopied") : url;
        this.shareToastEl.hidden = false;
        if (this.shareToastTimer) clearTimeout(this.shareToastTimer);
        this.shareToastTimer = setTimeout(() => {
          if (this.shareToastEl) this.shareToastEl.hidden = true;
          this.shareToastTimer = null;
        }, 2200);
      }
    });
  }

  updateVoiceButton(isSpeaking = false) {
    if (!this.voiceBtnEl) return;
    const on = this.narrator.isEnabled();
    this.voiceBtnEl.classList.toggle("is-active", on);
    this.voiceBtnEl.classList.toggle("is-speaking", on && isSpeaking);
    this.voiceBtnEl.setAttribute("aria-pressed", String(on));
    this.voiceBtnEl.title = !this.narrator.isSupported()
      ? t("voiceUnsupported")
      : on
      ? t("voiceTitleOn")
      : t("voiceTitleOff");
  }

  setViewMode(mode) {
    this.viewMode = mode === "2d" ? "2d" : "3d";
    this.stageEl.classList.toggle("is-3d", this.viewMode === "3d");
    this.stageEl.classList.toggle("is-2d", this.viewMode === "2d");
    this.stageEl.querySelectorAll("[data-view-mode]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.viewMode === this.viewMode);
    });
    const hint = this.stageEl.querySelector("#map-hint");
    if (hint) {
      hint.textContent =
        this.viewMode === "3d"
          ? this.terrain3d.ready
            ? t("hint3dGl")
            : t("hint3dCss")
          : t("hint2d");
    }
    this.cam = this.viewMode === "3d" ? { ...DEFAULT_CAM_3D } : { ...DEFAULT_CAM_2D };
    const phase = this.battle?.phases[this.currentPhase];
    const activeTurn = this.turnMode === "step" ? this.turns[this.currentTurn] : null;
    if (this.viewMode === "3d" && this.autoCamera && phase && activeTurn) {
      this.focusCameraOnTurn(phase, activeTurn);
    }
    this.applyCamera();
    if (this.terrain3d.ready) {
      if (this.viewMode === "3d") {
        this.terrain3d.resize();
        this.startGlLoop();
      } else if (this.glRaf) {
        cancelAnimationFrame(this.glRaf);
        this.glRaf = null;
      }
    }
  }

  applyCamera({ immediate = false } = {}) {
    if (!this.viewportEl) return;
    this.viewportEl.classList.toggle("is-instant", immediate);
    this.viewportEl.style.setProperty("--cam-pitch", `${this.cam.pitch}deg`);
    this.viewportEl.style.setProperty("--cam-yaw", `${this.cam.yaw}deg`);
    this.viewportEl.style.setProperty("--cam-zoom", String(this.cam.zoom));
    this.viewportEl.style.setProperty("--pan-x", `${this.cam.panX}px`);
    this.viewportEl.style.setProperty("--pan-y", `${this.cam.panY}px`);
  }

  applyMapStyle(style, { rebuildFortresses = false } = {}) {
    const next = style === "sanguo" || style === "realistic" ? style : "game";
    this.stageEl.dataset.mapStyle = next;
    this.terrain3d.setRenderStyle(next);
    if (rebuildFortresses && this.terrain3d.ready && this.battle) {
      this.terrain3d.buildFortresses(this.battle.mapConfig?.locations || []);
    }
    const styleBtn = this.stageEl.querySelector('[data-cam-action="toggle-style"]');
    if (styleBtn) {
      const active = next !== "realistic";
      styleBtn.classList.toggle("is-active", active);
      styleBtn.setAttribute("aria-pressed", String(active));
      styleBtn.textContent =
        next === "sanguo"
          ? t("btnStyleSanguo")
          : next === "game"
            ? t("btnStyleGame")
            : t("btnStyleRealistic");
    }
  }

  refreshLanguage() {
    this.applyMapStyle(this.stageEl.dataset.mapStyle || "game");
    const expandBtn = this.stageEl.querySelector("#stage-expand-btn");
    if (expandBtn) {
      const expanded = this.stageEl.closest(".sandtable")?.classList.contains("is-expanded");
      expandBtn.textContent = expanded ? t("btnBriefShow") : t("btnBriefHide");
    }
    const hint = this.stageEl.querySelector("#map-hint");
    if (hint) {
      hint.textContent =
        this.viewMode === "3d"
          ? this.terrain3d.ready
            ? t("hint3dGl")
            : t("hint3dCss")
          : t("hint2d");
    }
    if (this.hudEnvBadgeEl && this.battle) {
      this.hudEnvBadgeEl.textContent = getBattleEnvLabel(this.battle.id, getLang());
    }
    this.renderGuidedTourBadge();
    this.renderLayerToggles();
    this.renderTurnHud();
    this.updateVoiceButton(this.narrator.speaking);
    if (this.narrator.isEnabled() && this.battle) {
      this.speakCurrentTurn(() => this.scheduleNextTurnAfterSpeech());
    }
  }

  renderBattle(battle) {
    this.battle = battle;
    this.currentPhase = 0;
    this.phaseRenderedIndex = -1;
    this.forceFilter = "all";
    this.activeComparePairs = [];
    // 保持全应用统一的沙盘界面、兵牌与地标样式（四渡赤水仅在底层 3D 山川水系采用定制喀斯特林山地貌）
    this.applyMapStyle("game");
    if (this.glCompareSvgEl) {
      this.glCompareSvgEl.innerHTML = "";
      this._glCompareEmpty = true;
    }
    const turnRouteLayer = this.svgEl?.querySelector("#map-route-turn-layer");
    if (turnRouteLayer) turnRouteLayer.innerHTML = "";
    const compareLayer = this.svgEl?.querySelector("#map-compare-layer");
    if (compareLayer) compareLayer.innerHTML = "";
    if (this.comparePillEl) this.comparePillEl.hidden = true;
    this.hideTooltip();

    if (!this.svgEl) return;

    const { mapConfig, theme, phases } = battle;
    this.svgEl.setAttribute("viewBox", mapConfig.viewBox || "0 0 880 720");

    const mapTitle = this.svgEl.querySelector("#map-title");
    const mapDesc = this.svgEl.querySelector("#map-desc");
    if (mapTitle) mapTitle.textContent = `${battle.title}${t("mapTitleSuffix")}`;
    if (mapDesc) mapDesc.textContent = `${battle.subtitle || battle.title} — ${t("mapDescSuffix")}`;

    // 1. 动态更新 SVG Marker 颜色以匹配当前战役主题
    const arrowRedPath = this.svgEl.querySelector("#arrow-red path");
    if (arrowRedPath) arrowRedPath.setAttribute("fill", theme.accentBright || theme.accent);
    const arrowEnemyPath = this.svgEl.querySelector("#arrow-enemy path");
    if (arrowEnemyPath) arrowEnemyPath.setAttribute("fill", theme.opposing || "#8fa5ad");

    // 2. 地形与水系层
    const terrainLayer = this.svgEl.querySelector("#map-terrain");
    if (terrainLayer) {
      terrainLayer.innerHTML = mapConfig.terrainSvg || "";
    }

    // 3. 敌军动向层
    const enemyLayer = this.svgEl.querySelector("#map-enemy-routes");
    if (enemyLayer) {
      enemyLayer.innerHTML = "";
    }

    // 4. 我方/核心阶段路线层
    const routesLayer = this.svgEl.querySelector("#map-routes");
    if (routesLayer) {
      routesLayer.innerHTML = "";
      phases.forEach((phase, idx) => {
        if (!phase.route) return;
        const path = makeSvg("path", {
          class: `route route-${idx}`,
          d: phase.route,
          "data-phase-route": idx
        });
        routesLayer.append(path);
      });
      if (mapConfig.futureRoute) {
        routesLayer.append(
          makeSvg("path", {
            class: "route-future",
            d: mapConfig.futureRoute
          })
        );
      }
    }

    // 5. 地理关键点层
    const locLayer = this.svgEl.querySelector("#map-locations");
    if (locLayer) {
      locLayer.innerHTML = "";
      (mapConfig.locations || []).forEach((loc) => {
        const g = makeSvg("g", {
          class: `location ${loc.kind ? `loc-${loc.kind}` : ""}`,
          "data-place": loc.name,
          transform: `translate(${loc.x} ${loc.y})`,
          tabindex: "0",
          role: "button",
          "aria-label": `${loc.name}${loc.sub ? `：${loc.sub}` : ""}`
        });

        const r = loc.r || 4.5;
        g.append(makeSvg("circle", { class: "loc-halo", r: r + 5 }));

        if (loc.kind === "capital" || loc.kind === "fortress") {
          const size = r * 1.85;
          g.append(
            makeSvg("rect", {
              class: "loc-core",
              x: -size / 2,
              y: -size / 2,
              width: size,
              height: size,
              rx: loc.kind === "capital" ? 1 : 0,
              transform: loc.kind === "fortress" ? "rotate(45)" : ""
            })
          );
        } else {
          g.append(makeSvg("circle", { class: "loc-core", r }));
        }

        const label = makeSvg("text", {
          class: "loc-label",
          x: loc.labelX !== undefined ? loc.labelX : 11,
          y: loc.labelY !== undefined ? loc.labelY : -8
        });
        label.textContent = loc.name;
        g.append(label);

        const showLocInfo = (event) => {
          this.showTooltip(event, {
            kicker: getLocKicker(loc.kind),
            title: loc.name,
            body: loc.sub || t("locFallbackBody")
          });
        };
        g.addEventListener("mouseenter", showLocInfo);
        g.addEventListener("mousemove", (event) => this.positionTooltip(event));
        g.addEventListener("focus", showLocInfo);
        g.addEventListener("click", showLocInfo);
        g.addEventListener("mouseleave", () => this.hideTooltip());
        g.addEventListener("blur", () => this.hideTooltip());

        locLayer.append(g);
      });
    }

    // 6. 战术事件标记层（每阶段动态更新）
    const markerLayer = this.svgEl.querySelector("#map-markers");
    if (markerLayer) {
      markerLayer.innerHTML = "";
    }

    // 7. 部队番号层（跨阶段复用同一 ID 实现平滑位移）
    const formationLayer = this.svgEl.querySelector("#formation-layer");
    if (formationLayer) {
      formationLayer.innerHTML = "";
      const ids = [...new Set(phases.flatMap((p) => p.formations.map((u) => u.id)))];

      ids.forEach((id) => {
        const g = makeSvg("g", {
          id: `formation-${id}`,
          class: "formation",
          "data-formation-id": id,
          tabindex: "0"
        });
        g.style.opacity = "0";
        g.style.pointerEvents = "none";

        g.append(
          makeSvg("line", { class: "unit-line", x1: 0, y1: 0, x2: 14, y2: -10 }),
          makeSvg("circle", { class: "unit-ring", cx: 0, cy: 0, r: 6.5 }),
          makeSvg("circle", { class: "unit-pip", cx: 0, cy: 0, r: 3.4 }),
          makeSvg("rect", { class: "unit-plate", x: 14, y: -24, width: 120, height: PLATE_HEIGHT, rx: 4 }),
          makeSvg("rect", { class: "unit-stripe", x: 14, y: -24, width: 3, height: PLATE_HEIGHT, rx: 1.5 }),
          makeSvg("text", { class: "unit-label", x: 23, y: -11 }),
          makeSvg("text", { class: "unit-sub", x: 23, y: 1 })
        );

        const showUnitInfo = (event) => {
          const unit = this.activeUnitMap.get(id);
          if (!unit) return;
          const sideName =
            unit.side === "red"
              ? this.battle.mapConfig.filterSides.red
              : this.battle.mapConfig.filterSides.blue;
          this.showTooltip(event, {
            kicker: `${sideName} · ${t("unitCurrent")}`,
            title: unit.label,
            body: unit.detail || unit.sub || t("unitFallbackBody")
          });
        };

        g.addEventListener("mouseenter", showUnitInfo);
        g.addEventListener("mousemove", (event) => this.positionTooltip(event));
        g.addEventListener("focus", showUnitInfo);
        g.addEventListener("click", showUnitInfo);
        g.addEventListener("mouseleave", () => this.hideTooltip());
        g.addEventListener("blur", () => this.hideTooltip());

        formationLayer.append(g);
      });
    }

    // 7. 渲染 3D 地标建筑与 3D 部队立体棋子层（含 WebGL 真三维地形）
    this.render3DLandmarks(mapConfig.locations || []);
    this.init3DUnits(phases);
    if (this.terrain3d.ready) {
      this.terrain3d.loadBattle(battle);
      this.terrain3d.buildFortresses(mapConfig.locations || []);
      this.terrain3d.resize();
      this.buildGlLandmarks(mapConfig.locations || []);
      this.buildGlUnits(phases);
      if (this.hudEnvBadgeEl) {
        this.hudEnvBadgeEl.textContent = getBattleEnvLabel(battle.id, getLang());
      }
    }
    this.prevPhaseCoords.clear();

    // 8. 渲染图例与筛选控件
    this.renderLegend(mapConfig);
    this.renderFilters(mapConfig);
    this.renderLayerToggles();
    this.applyLayerVisibility();
  }

  render3DLandmarks(locations) {
    if (!this.landmarks3dEl) return;
    this.landmarks3dEl.innerHTML = "";
    locations
      .filter((loc) => loc.kind === "capital" || loc.kind === "fortress" || loc.kind === "ford")
      .forEach((loc) => {
        const el = document.createElement("button");
        el.type = "button";
        el.className = `landmark-3d landmark-${loc.kind}`;
        el.dataset.place = loc.name;
        el.style.left = `${(loc.x / 880) * 100}%`;
        el.style.top = `${(loc.y / 720) * 100}%`;
        el.setAttribute("aria-label", `${loc.name}${loc.sub ? `：${loc.sub}` : ""}`);
        el.innerHTML = `
          <span class="landmark-3d-base"></span>
          <span class="landmark-3d-tower">${get3DLandmarkIconSvg(loc.kind)}</span>
        `;
        const showInfo = (event) => {
          this.showTooltip(event, {
            kicker: getLocKicker(loc.kind),
            title: loc.name,
            body: loc.sub || t("locFallbackBody")
          });
        };
        el.addEventListener("mouseenter", showInfo);
        el.addEventListener("mousemove", (ev) => this.positionTooltip(ev));
        el.addEventListener("focus", showInfo);
        el.addEventListener("click", showInfo);
        el.addEventListener("mouseleave", () => this.hideTooltip());
        el.addEventListener("blur", () => this.hideTooltip());
        this.landmarks3dEl.append(el);
      });
  }

  init3DUnits(phases) {
    if (!this.units3dEl) return;
    this.units3dEl.innerHTML = "";
    const ids = [...new Set(phases.flatMap((p) => p.formations.map((u) => u.id)))];
    ids.forEach((id) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "unit-3d";
      el.dataset.formationId = id;
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
      el.innerHTML = `
        <span class="unit-3d-shadow"></span>
        <span class="unit-3d-base"></span>
        <span class="unit-3d-body">
          <span class="unit-3d-pole"></span>
          <span class="unit-3d-token"></span>
        </span>
      `;
      const showInfo = (event) => {
        const unit = this.activeUnitMap.get(id);
        if (!unit) return;
        const sideName =
          unit.side === "red"
            ? this.battle.mapConfig.filterSides.red
            : this.battle.mapConfig.filterSides.blue;
        this.showTooltip(event, {
          kicker: `${sideName} · ${t("unitStereo")}`,
          title: unit.label,
          body: unit.detail || unit.sub || t("unitFallbackBody")
        });
      };
      el.addEventListener("mouseenter", showInfo);
      el.addEventListener("mousemove", (ev) => this.positionTooltip(ev));
      el.addEventListener("focus", showInfo);
      el.addEventListener("click", showInfo);
      el.addEventListener("mouseleave", () => this.hideTooltip());
      el.addEventListener("blur", () => this.hideTooltip());
      this.units3dEl.append(el);
    });
  }

  renderLegend(mapConfig) {
    const legendEl = this.stageEl.querySelector(".map-legend");
    if (!legendEl) return;
    legendEl.innerHTML = (mapConfig.legends || [])
      .map((item) => `<span><i class="${item.colorClass}"></i>${item.label}</span>`)
      .join("");
  }

  renderFilters(mapConfig) {
    const container = this.stageEl.querySelector(".map-filters");
    if (!container) return;
    const fs = mapConfig.filterSides;
    container.innerHTML = `
      <button class="is-active" type="button" data-force-filter="all">${fs.all}</button>
      <button type="button" data-force-filter="red">${fs.red}</button>
      <button type="button" data-force-filter="blue">${fs.blue}</button>
    `;
    container.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.forceFilter = btn.dataset.forceFilter;
        container.querySelectorAll("button").forEach((b) => b.classList.toggle("is-active", b === btn));
        this.updateFormations();
      });
    });
  }

  renderLayerToggles() {
    const container = this.stageEl.querySelector(".map-layer-toggles");
    if (!container) return;
    const items = [
      { key: "formations", label: t("layerFormations") },
      { key: "enemy", label: t("layerEnemy") },
      { key: "combat", label: t("layerCombat") },
      { key: "labels", label: t("layerLabels") }
    ];
    container.innerHTML = items
      .map(
        (item) =>
          `<button type="button" class="${this.layers[item.key] ? "is-active" : ""}" data-layer="${item.key}" aria-pressed="${this.layers[item.key]}">${item.label}</button>`
      )
      .join("");

    container.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.layer;
        this.layers[key] = !this.layers[key];
        btn.classList.toggle("is-active", this.layers[key]);
        btn.setAttribute("aria-pressed", String(this.layers[key]));
        this.applyLayerVisibility();
      });
    });
  }

  applyLayerVisibility() {
    if (!this.svgEl) return;
    this.svgEl.classList.toggle("hide-formations", !this.layers.formations);
    this.svgEl.classList.toggle("hide-enemy", !this.layers.enemy);
    this.svgEl.classList.toggle("hide-labels", !this.layers.labels);
    if (this.layer3dEl) {
      this.layer3dEl.classList.toggle("hide-formations", !this.layers.formations);
      this.layer3dEl.classList.toggle("hide-enemy", !this.layers.enemy);
      this.layer3dEl.classList.toggle("hide-labels", !this.layers.labels);
    }
    if (this.glOverlayEl) {
      this.glOverlayEl.classList.toggle("hide-formations", !this.layers.formations);
      this.glOverlayEl.classList.toggle("hide-enemy", !this.layers.enemy);
      this.glOverlayEl.classList.toggle("hide-labels", !this.layers.labels);
    }
  }

  setPhase(phaseIndex, { initialTurn = 0, autoPlay = true, continuous = false, narrate = true, scrubbing = false } = {}) {
    if (!this.battle || !this.svgEl) return;
    this.currentPhase = phaseIndex;
    this.phaseRenderedIndex = phaseIndex;
    const phase = this.battle.phases[phaseIndex];
    if (!phase) return;

    // 更新阶段主路线 + 历史轨迹淡留
    this.svgEl.querySelectorAll("#map-routes .route").forEach((pathEl) => {
      const idx = Number(pathEl.getAttribute("data-phase-route"));
      pathEl.classList.toggle("is-active", idx === phaseIndex);
      pathEl.classList.toggle("is-past", idx < phaseIndex);
    });

    // 最后阶段显示后续战略走向虚线
    const futurePath = this.svgEl.querySelector("#map-routes .route-future");
    if (futurePath) {
      futurePath.classList.toggle("is-active", phaseIndex === this.battle.phases.length - 1);
    }

    // 更新阶段敌军/对手态势动向箭头
    const enemyLayer = this.svgEl.querySelector("#map-enemy-routes");
    if (enemyLayer) {
      const routes =
        phase.enemyRoutes && phase.enemyRoutes.length > 0
          ? phase.enemyRoutes
          : this.battle.mapConfig.defaultEnemyRoutes || [];
      enemyLayer.innerHTML = routes
        .map(
          (r) =>
            `<path class="enemy-route-path" d="${typeof r === "string" ? r : r.d}" marker-end="url(#arrow-enemy)" />`
        )
        .join("");
    }

    // 高亮关键地理节点（同步 2D 与 3D 地标）
    this.svgEl.querySelectorAll("#map-locations .location").forEach((locEl) => {
      const isKey = phase.keys.includes(locEl.getAttribute("data-place"));
      locEl.classList.toggle("is-key", isKey);
    });
    if (this.landmarks3dEl) {
      this.landmarks3dEl.querySelectorAll(".landmark-3d").forEach((lmEl) => {
        lmEl.classList.toggle("is-key", phase.keys.includes(lmEl.dataset.place));
      });
    }

    // 渲染本阶段战术事件标记（2D + 3D 立体光柱徽章）
    this.renderMarkers(phase.markers || []);

    // 更新部队番号坐标与 3D 立体棋子布局
    this.updateFormations();

    // 启动沿交战与行军路线的 3D 动态行军图标
    this.setupRouteMovers();

    // 记录之前各阶段各部队最近一次出现的坐标，用于跨回合渐进推进与前后对照位移线
    this.prevPhaseCoords = new Map();
    for (let p = 0; p < phaseIndex; p++) {
      (this.battle.phases[p]?.formations || []).forEach((u) => {
        this.prevPhaseCoords.set(u.id, { x: u.x, y: u.y });
      });
    }

    // 同步 WebGL 真三维起伏地形与分步回合批次演进
    this.turns = this.buildPhaseTurns(phase, phaseIndex);
    this.updateWarHudBase(phase, phaseIndex);
    if (this.terrain3d.ready && this.autoCamera && this.viewMode === "3d") {
      this.focusCameraOnPhase(phase, phaseIndex);
    }

    this.continuousPlay = Boolean(continuous || this.guidedTour);
    if (this.turnMode === "all") {
      this.stopTurnTimer();
      this.applyTurn(-1, { narrate, scrubbing });
    } else {
      this.turnPlaying = Boolean(autoPlay);
      const clampedT = Math.max(0, Math.min(Math.max(0, this.turns.length - 1), Number(initialTurn) || 0));
      this.applyTurn(clampedT, { narrate, scrubbing });
    }

    if (this.terrain3d.ready && this.viewMode === "3d") {
      this.terrain3d.resize();
      this.startGlLoop();
    }
  }

  renderMarkers(markers) {
    const markerLayer = this.svgEl.querySelector("#map-markers");
    if (!markerLayer) return;
    markerLayer.innerHTML = "";

    markers.forEach((m) => {
      const type = m.type || "clash";
      const g = makeSvg("g", {
        class: `battle-marker marker-${type}`,
        transform: `translate(${m.x} ${m.y})`,
        tabindex: "0",
        role: "button",
        "aria-label": `${m.label}${m.desc ? `：${m.desc}` : ""}`
      });

      g.append(
        makeSvg("circle", { class: "marker-pulse", r: 15 }),
        makeSvg("circle", { class: "marker-badge", r: 10.5 })
      );

      const glyph = makeSvg("text", { class: "marker-glyph", x: 0, y: 3.8, "text-anchor": "middle" });
      glyph.textContent = getMarkerGlyph(m);
      g.append(glyph);

      const showMarkerInfo = (event) => {
        this.showTooltip(event, {
          kicker: getMarkerKicker(type),
          title: m.label,
          body: m.desc || ""
        });
      };

      g.addEventListener("mouseenter", showMarkerInfo);
      g.addEventListener("mousemove", (event) => this.positionTooltip(event));
      g.addEventListener("focus", showMarkerInfo);
      g.addEventListener("click", showMarkerInfo);
      g.addEventListener("mouseleave", () => this.hideTooltip());
      g.addEventListener("blur", () => this.hideTooltip());

      markerLayer.append(g);
    });

    // 同步渲染 3D 立体战事光柱徽章
    if (this.markers3dEl) {
      this.markers3dEl.innerHTML = "";
      markers.forEach((m) => {
        const type = m.type || "clash";
        const el = document.createElement("button");
        el.type = "button";
        el.className = `marker-3d marker-${type}`;
        el.style.left = `${(m.x / 880) * 100}%`;
        el.style.top = `${(m.y / 720) * 100}%`;
        el.setAttribute("aria-label", `${m.label}${m.desc ? `：${m.desc}` : ""}`);
        el.innerHTML = `
          <span class="marker-3d-ring"></span>
          <span class="marker-3d-pillar">
            <span class="marker-3d-beam"></span>
            <span class="marker-3d-orb">${getMarkerGlyph(m)}</span>
          </span>
        `;
        const showInfo = (event) => {
          this.showTooltip(event, {
            kicker: getMarkerKicker(type),
            title: m.label,
            body: m.desc || ""
          });
        };
        el.addEventListener("mouseenter", showInfo);
        el.addEventListener("mousemove", (ev) => this.positionTooltip(ev));
        el.addEventListener("focus", showInfo);
        el.addEventListener("click", showInfo);
        el.addEventListener("mouseleave", () => this.hideTooltip());
        el.addEventListener("blur", () => this.hideTooltip());
        this.markers3dEl.append(el);
      });
    }
  }

  updateFormations() {
    if (!this.battle || !this.svgEl) return;
    const phase = this.battle.phases[this.currentPhase];
    if (!phase) return;

    const formationLayer = this.svgEl.querySelector("#formation-layer");
    if (!formationLayer) return;

    this.activeUnitMap = new Map(phase.formations.map((u) => [u.id, u]));
    const placements = resolvePlatePlacements(
      phase.formations,
      this.battle.mapConfig.locations,
      phase.keys || []
    );

    formationLayer.querySelectorAll(".formation").forEach((node) => {
      const id = node.getAttribute("data-formation-id");
      const unit = this.activeUnitMap.get(id);

      if (!unit) {
        node.style.opacity = "0";
        node.style.pointerEvents = "none";
        return;
      }

      const box = placements.get(id);
      const plateX = Math.round(box.x - unit.x);
      const plateY = Math.round(box.y - unit.y);
      const width = box.w;
      const height = box.h;

      // 引线连接到番号牌最靠近坐标点的边缘中点
      const isLeftSide = plateX + width / 2 < 0;
      const lineX2 = Math.max(plateX, Math.min(plateX + width, 0));
      const lineY2 = Math.max(plateY, Math.min(plateY + height, 0));
      const stripeX = isLeftSide ? plateX + width - 3 : plateX;
      const textX = plateX + 9;

      node.style.opacity = "1";
      node.style.pointerEvents = "auto";
      node.setAttribute("transform", `translate(${unit.x} ${unit.y})`);
      node.setAttribute("class", `formation ${unit.side}`);
      node.classList.toggle("is-muted", this.forceFilter !== "all" && this.forceFilter !== unit.side);

      const line = node.querySelector(".unit-line");
      line.setAttribute("x2", String(lineX2));
      line.setAttribute("y2", String(lineY2));

      const plate = node.querySelector(".unit-plate");
      plate.setAttribute("x", String(plateX));
      plate.setAttribute("y", String(plateY));
      plate.setAttribute("width", String(width));
      plate.setAttribute("height", String(height));

      const stripe = node.querySelector(".unit-stripe");
      stripe.setAttribute("x", String(stripeX));
      stripe.setAttribute("y", String(plateY));
      stripe.setAttribute("height", String(height));

      const labelEl = node.querySelector(".unit-label");
      labelEl.setAttribute("x", String(textX));
      labelEl.setAttribute("y", String(plateY + 13));
      labelEl.textContent = unit.label;

      const subEl = node.querySelector(".unit-sub");
      subEl.setAttribute("x", String(textX));
      subEl.setAttribute("y", String(plateY + 24.5));
      subEl.textContent = unit.sub || "";
    });

    // 同步更新 3D 立体兵力棋子位置与兵种立体图标
    if (this.units3dEl) {
      this.units3dEl.querySelectorAll(".unit-3d").forEach((el) => {
        const id = el.dataset.formationId;
        const unit = this.activeUnitMap.get(id);
        if (!unit) {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          return;
        }
        const kind = inferUnitKind(unit, this.battle);
        el.style.opacity = "1";
        el.style.pointerEvents = "auto";
        el.style.left = `${(unit.x / 880) * 100}%`;
        el.style.top = `${(unit.y / 720) * 100}%`;
        el.className = `unit-3d side-${unit.side} kind-${kind}`;
        el.classList.toggle("is-muted", this.forceFilter !== "all" && this.forceFilter !== unit.side);
        el.setAttribute("aria-label", `${unit.label}${unit.sub ? `：${unit.sub}` : ""}`);
        const token = el.querySelector(".unit-3d-token");
        if (token && token.dataset.kind !== kind) {
          token.dataset.kind = kind;
          token.innerHTML = get3DUnitIconSvg(kind);
        }
      });
    }

    // 同步 WebGL 投影兵力棋子阵营筛选与当前回合行动高亮
    if (this.terrain3d.ready) {
      const isAll = this.turnMode === "all";
      this.syncGlUnits(phase, isAll ? null : this.turns[this.currentTurn] || null, isAll);
    }
  }

  stopRouteMovers() {
    if (this.moverRaf) {
      cancelAnimationFrame(this.moverRaf);
      this.moverRaf = null;
    }
    this.movers = [];
    if (this.movers3dEl) this.movers3dEl.innerHTML = "";
    this.stopGlLoop();
  }

  setupRouteMovers() {
    this.stopRouteMovers();
    if (!this.movers3dEl || !this.svgEl || this.prefersReducedMotion) return;

    const primaryKind = inferBattleRouteKind(this.battle);
    const activeRoute = this.svgEl.querySelector("#map-routes .route.is-active");
    if (activeRoute && typeof activeRoute.getTotalLength === "function") {
      const len = activeRoute.getTotalLength();
      if (len > 20) {
        const count = len > 420 ? 3 : 2;
        for (let i = 0; i < count; i++) {
          const el = document.createElement("div");
          el.className = "mover-3d side-red";
          el.innerHTML = `
            <span class="mover-3d-shadow"></span>
            <span class="mover-3d-body">
              <span class="mover-3d-badge">${get3DUnitIconSvg(primaryKind)}</span>
            </span>
          `;
          this.movers3dEl.append(el);
          this.movers.push({
            el,
            path: activeRoute,
            len,
            offset: i / count,
            speed: 0.115
          });
        }
      }
    }

    const enemyPaths = [...this.svgEl.querySelectorAll("#map-enemy-routes .enemy-route-path")];
    enemyPaths.forEach((path, idx) => {
      if (typeof path.getTotalLength !== "function") return;
      const len = path.getTotalLength();
      if (len < 24) return;
      const el = document.createElement("div");
      el.className = "mover-3d side-blue";
      el.innerHTML = `
        <span class="mover-3d-shadow"></span>
        <span class="mover-3d-body">
          <span class="mover-3d-chevron"></span>
        </span>
      `;
      this.movers3dEl.append(el);
      this.movers.push({
        el,
        path,
        len,
        offset: (idx * 0.31) % 1,
        speed: 0.14
      });
    });

    if (this.movers.length === 0) return;

    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = (now - startTime) / 1000;
      for (const m of this.movers) {
        const t = (elapsed * m.speed + m.offset) % 1;
        const pt = m.path.getPointAtLength(t * m.len);
        m.el.style.left = `${(pt.x / 880) * 100}%`;
        m.el.style.top = `${(pt.y / 720) * 100}%`;
        // 淡入淡出起终点使循环顺滑
        const edgeFade = t < 0.08 ? t / 0.08 : t > 0.92 ? (1 - t) / 0.08 : 1;
        m.el.style.opacity = String(edgeFade.toFixed(2));
      }
      this.moverRaf = requestAnimationFrame(tick);
    };
    this.moverRaf = requestAnimationFrame(tick);
  }

  /* ---------------- WebGL 真三维起伏地形投影叠加层 ---------------- */

  sampleSvgPath(pathEl, maxPoints = 72) {
    if (!pathEl || typeof pathEl.getTotalLength !== "function") return [];
    const len = pathEl.getTotalLength();
    if (len < 6) return [];
    const steps = Math.max(12, Math.min(maxPoints, Math.round(len / 9)));
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const pt = pathEl.getPointAtLength((i / steps) * len);
      pts.push([pt.x, pt.y]);
    }
    return pts;
  }

  buildGlLandmarks(locations) {
    if (!this.glLandmarksEl) return;
    this.glLandmarksEl.innerHTML = "";
    this.glLandmarks = [];
    const isChishui = this.battle?.id === "chishui-1935";
    locations.forEach((loc) => {
      const isMajor =
        loc.kind === "capital" ||
        loc.kind === "fortress" ||
        loc.kind === "ford" ||
        (isChishui && loc.kind === "city");
      const sealChar = getSanguoLandmarkSeal(loc.kind);
      const el = document.createElement("button");
      el.type = "button";
      el.className = `gl-landmark ${loc.kind ? `gl-loc-${loc.kind}` : ""} ${isMajor ? "is-major" : ""}`;
      el.dataset.place = loc.name;
      el.setAttribute("aria-label", `${loc.name}${loc.sub ? `：${loc.sub}` : ""}`);
      el.innerHTML = `
        ${
          isMajor
            ? `<span class="gl-landmark-icon">${get3DLandmarkIconSvg(loc.kind)}</span>${
                sealChar ? `<span class="gl-sanguo-seal" aria-hidden="true">${sealChar}</span>` : ""
              }`
            : `<span class="gl-landmark-dot"></span>`
        }
        <span class="gl-landmark-name">${loc.name}</span>
      `;
      const showInfo = (event) => {
        this.showTooltip(event, {
          kicker: getLocKicker(loc.kind),
          title: loc.name,
          body: loc.sub || t("locFallbackBody")
        });
      };
      el.addEventListener("mouseenter", showInfo);
      el.addEventListener("mousemove", (ev) => this.positionTooltip(ev));
      el.addEventListener("focus", showInfo);
      el.addEventListener("click", showInfo);
      el.addEventListener("mouseleave", () => this.hideTooltip());
      el.addEventListener("blur", () => this.hideTooltip());
      this.glLandmarksEl.append(el);
      this.glLandmarks.push({ el, loc });
    });
  }

  buildGlUnits(phases) {
    if (!this.glUnitsEl) return;
    this.glUnitsEl.innerHTML = "";
    this.glUnits.clear();
    const ids = [...new Set(phases.flatMap((p) => p.formations.map((u) => u.id)))];
    ids.forEach((id) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "gl-unit";
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
      el.innerHTML = `
        <span class="gl-unit-card">
          <span class="gl-unit-badge"></span>
          <span class="gl-unit-meta">
            <strong class="gl-unit-label"></strong>
            <small class="gl-unit-sub"></small>
          </span>
        </span>
        <span class="gl-sanguo-pennant" aria-hidden="true">
          <svg class="gl-sanguo-flag-svg" viewBox="0 0 42 46">
            <path class="sg-flag-pole" d="M8 4V45" stroke="#d8b668" stroke-width="2.2" stroke-linecap="round"/>
            <polygon class="sg-flag-spear" points="8,0 5.2,5.6 10.8,5.6" fill="#f7de94"/>
            <circle cx="8" cy="6.2" r="2.1" fill="#c93b2b"/>
            <path class="sg-flag-cloth" d="M9.2 6.2 C18 4.4, 29 8.2, 39.5 6.8 L34.2 15.2 L39.5 23.6 C29 25.0, 18 21.2, 9.2 23.2 Z"/>
            <path class="sg-flag-trim" d="M9.2 6.2 C18 4.4, 29 8.2, 39.5 6.8 L34.2 15.2 L39.5 23.6 C29 25.0, 18 21.2, 9.2 23.2 Z" fill="none" stroke-width="1.2"/>
          </svg>
          <em class="gl-sanguo-glyph"></em>
        </span>
        <span class="gl-unit-stem"></span>
        <span class="gl-unit-foot"></span>
      `;
      const showInfo = (event) => {
        const unit = this.activeUnitMap.get(id);
        if (!unit) return;
        const sideName =
          unit.side === "red"
            ? this.battle.mapConfig.filterSides.red
            : this.battle.mapConfig.filterSides.blue;
        this.showTooltip(event, {
          kicker: `${sideName} · ${t("unit3d")}`,
          title: unit.label,
          body: unit.detail || unit.sub || t("unitFallbackBody")
        });
      };
      el.addEventListener("mouseenter", showInfo);
      el.addEventListener("mousemove", (ev) => this.positionTooltip(ev));
      el.addEventListener("focus", showInfo);
      el.addEventListener("click", showInfo);
      el.addEventListener("mouseleave", () => this.hideTooltip());
      el.addEventListener("blur", () => this.hideTooltip());
      this.glUnitsEl.append(el);
      this.glUnits.set(id, { el, x: 440, y: 360, tx: 440, ty: 360, active: false, initialized: false });
    });
  }

  syncGlUnits(phase, activeTurn = null, isAll = true) {
    if (!this.glUnitsEl || !phase) return;
    const activeMap = new Map(phase.formations.map((u) => [u.id, u]));
    const totalTurns = Math.max(1, this.turns.length);
    const stepFrac = isAll ? 1 : (this.currentTurn + 1) / totalTurns;
    const actor = isAll ? "all" : activeTurn?.actor || "all";
    const focusSet = !isAll && activeTurn?.focusUnits?.length ? new Set(activeTurn.focusUnits) : null;

    this.glUnits.forEach((item, id) => {
      const unit = activeMap.get(id);
      if (!unit) {
        item.active = false;
        item.el.style.opacity = "0";
        item.el.style.pointerEvents = "none";
        return;
      }
      const kind = inferUnitKind(unit, this.battle);
      item.active = true;

      // 分步回合模式下，部队从上阶段位置随回合推进平滑行进至本阶段目标点
      const prev = this.prevPhaseCoords.get(id);
      if (!isAll && prev) {
        const moveRatio = 0.25 + 0.75 * stepFrac;
        item.tx = prev.x + (unit.x - prev.x) * moveRatio;
        item.ty = prev.y + (unit.y - prev.y) * moveRatio;
      } else {
        item.tx = unit.x;
        item.ty = unit.y;
      }
      if (!item.initialized) {
        item.x = item.tx;
        item.y = item.ty;
        item.initialized = true;
      }

      const statusText = `${unit._rawLabel || unit.label || ""} ${unit._rawSub || unit.sub || ""}`;
      let hp = 86;
      let isCritical = false;
      if (/全歼|被焚|溃散|溃众|瓦解|阵亡|被俘|八百骑|残/.test(statusText)) {
        hp = 22;
        isCritical = true;
      } else if (/被围|激战|血战|阻击|扑空|受阻|撤离|突围|失当|降曹/.test(statusText)) {
        hp = 52;
        isCritical = /被围|失当/.test(statusText);
      } else if (/主攻|突击|奇袭|斩|胜|追击|精骑/.test(statusText)) {
        hp = 94;
      }

      // 战术信息按需呼吸：仅本回合核心参战部队展开完整战旗铭牌，其余部队收拢为极简圆点
      const isFocused = focusSet ? focusSet.has(id) : isAll || actor === "clash" || actor === unit.side;
      const isBreathingDot = !isAll && !isFocused;
      const isActing = !isAll && isFocused;

      item.el.style.opacity = "1";
      item.el.style.pointerEvents = "auto";
      item.el.style.setProperty("--hp", `${hp}%`);
      item.el.className = `gl-unit side-${unit.side} kind-${kind}${isCritical ? " is-critical" : ""}${
        isActing ? " is-turn-active" : ""
      }${isBreathingDot ? " is-breathing-dot" : ""}`;
      item.el.classList.toggle("is-muted", this.forceFilter !== "all" && this.forceFilter !== unit.side);
      item.el.setAttribute("aria-label", `${unit.label}${unit.sub ? `：${unit.sub}` : ""}`);
      const badge = item.el.querySelector(".gl-unit-badge");
      if (badge && badge.dataset.kind !== kind) {
        badge.dataset.kind = kind;
        badge.innerHTML = get3DUnitIconSvg(kind);
      }
      item.el.querySelector(".gl-unit-label").textContent = unit.label;
      item.el.querySelector(".gl-unit-sub").textContent = unit.sub || "";
      const sgGlyph = item.el.querySelector(".gl-sanguo-glyph");
      if (sgGlyph) {
        sgGlyph.textContent = getSanguoBannerGlyph(id, unit);
      }
    });
  }

  // 将包含多条独立子路径（多处 M）的 SVG 路径拆分为独立点列，防止跨区拉直
  sampleSvgSubpaths(pathEl, stepsPerSub = 68) {
    if (!pathEl) return [];
    const d = (pathEl.getAttribute("d") || "").trim();
    if (!d) return [];
    const parts = d
      .split(/(?=[Mm]\s*-?\d)/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length <= 1) {
      const pts = this.sampleSvgPath(pathEl, stepsPerSub);
      return pts.length >= 2 ? [pts] : [];
    }
    const result = [];
    for (const part of parts) {
      const tmp = makeSvg("path", { d: part });
      const pts = this.sampleSvgPath(tmp, Math.max(22, Math.round(stepsPerSub / Math.sqrt(parts.length))));
      if (pts.length >= 2) result.push(pts);
    }
    return result;
  }

  // 优先采用手工精编的历史回合剧本（turnScripts.js），无剧本时自动智能编排
  buildPhaseTurns(phase, phaseIndex) {
    const details =
      phase.detail && phase.detail.length > 0 ? phase.detail : [[phase.date || "", phase.name, phase.goal || ""]];
    const activeRedEl = this.svgEl?.querySelector("#map-routes .route.is-active");
    const redSubpaths = this.sampleSvgSubpaths(activeRedEl, 84);
    const enemyEls = [...(this.svgEl?.querySelectorAll("#map-enemy-routes .enemy-route-path") || [])];
    const enemySubpaths = enemyEls
      .map((el, idx) => ({ idx, el, points: this.sampleSvgPath(el, 48) }))
      .filter((e) => e.points.length >= 2);

    const script = getPhaseTurnScript(this.battle?.id, phase.id);
    if (script && script.length > 0) {
      const turns = script.map((sc, idx) => {
        const [date, title, desc] = details[idx] || [phase.date || "", phase.name, ""];
        const redSlices = [];
        if (Array.isArray(sc.redSubpaths)) {
          sc.redSubpaths.forEach((subIdx) => {
            if (redSubpaths[subIdx]) redSlices.push({ points: redSubpaths[subIdx] });
          });
        } else if (Array.isArray(sc.redSegment) && redSubpaths[0]) {
          const full = redSubpaths[0];
          const n = full.length;
          const sI = Math.max(0, Math.floor(sc.redSegment[0] * (n - 1)));
          const eI = Math.min(n - 1, Math.ceil(sc.redSegment[1] * (n - 1)));
          if (eI > sI) redSlices.push({ points: full.slice(sI, eI + 1) });
        }

        const validEnemy = (sc.enemyIndices || []).filter((i) => enemySubpaths.some((e) => e.idx === i));
        const validMarkers = (sc.markerIndices || []).filter((i) => i >= 0 && i < (phase.markers || []).length);

        return {
          id: makeEventId(this.battle?.id || "battle", phaseIndex, idx),
          index: idx,
          date,
          title,
          desc,
          actor: sc.actor || "red",
          focusUnits: sc.focusUnits || [],
          focusPlaces: sc.focusPlaces || [],
          redSlices,
          enemyIndices: validEnemy,
          markerIndices: validMarkers,
          sfx: sc.sfx || "march",
          banner: sc.banner || null,
          narration: sc.narration || null,
          meta: getEventMeta(this.battle?.id, phase.id, idx)
        };
      });
      turns._redSubpaths = redSubpaths;
      turns._enemySubpaths = enemySubpaths;
      turns._phaseIndex = phaseIndex;
      return turns;
    }

    // 自动编排兜底（适用于未来新增的未写剧本战役）
    const total = details.length;
    const markers = phase.markers || [];
    const turns = details.map(([date, title, desc], idx) => {
      const txt = `${title || ""} ${desc || ""}`;
      let actor = "red";
      const isClash =
        /激战|血战|斩|大捷|焚|全歼|破高橹|陷落|鏖战|强渡|突围|攻克|大溃|倒戈|Slays|Ambush|Clash|Victory|Falls|Destroyed|Breakout|Catapults|Bloody|Assault/i.test(
          txt
        );
      const isBlueInit =
        /^(颜良|袁绍|袁军|文丑|川军|德军|党卫军|美军|桑镇.*炸|费赫尔.*黑|Yuan|German|SS |Son |Black Friday)/i.test(
          `${title || ""}`
        );
      if (isClash) actor = "clash";
      else if (isBlueInit && enemySubpaths.length > 0) actor = "blue";
      return {
        id: makeEventId(this.battle?.id || "battle", phaseIndex, idx),
        index: idx,
        date,
        title,
        desc,
        actor,
        focusUnits: [],
        focusPlaces: [],
        redSlices: [],
        enemyIndices: [],
        markerIndices: [],
        sfx: isClash ? "clash" : "march",
        banner: null,
        narration: null,
        meta: getEventMeta(this.battle?.id, phase.id, idx)
      };
    });

    if (enemySubpaths.length > 0) {
      const blueSlots = turns.filter((x) => x.actor === "blue").map((x) => x.index);
      const clashSlots = turns.filter((x) => x.actor === "clash").map((x) => x.index);
      const redSlots = turns.filter((x) => x.actor === "red").map((x) => x.index);
      const preferred = [...blueSlots, ...clashSlots, ...redSlots];
      enemySubpaths.forEach((eObj, i) => {
        const slot = i < blueSlots.length ? blueSlots[i] : preferred[i % preferred.length] ?? Math.min(total - 1, i);
        turns[slot].enemyIndices.push(eObj.idx);
      });
    }

    const redTurns = turns.filter((x) => x.actor === "red" || x.actor === "clash");
    const targetRedTurns = redTurns.length > 0 ? redTurns : turns;
    if (redSubpaths.length === 1) {
      const fullPts = redSubpaths[0];
      const segs = targetRedTurns.length;
      const n = fullPts.length;
      targetRedTurns.forEach((tObj, sIdx) => {
        const startI = sIdx === 0 ? 0 : Math.max(0, Math.floor((sIdx / segs) * (n - 1)) - 1);
        const endI = sIdx === segs - 1 ? n - 1 : Math.min(n - 1, Math.ceil(((sIdx + 1) / segs) * (n - 1)));
        if (endI > startI) tObj.redSlices.push({ points: fullPts.slice(startI, endI + 1) });
      });
    } else if (redSubpaths.length > 1) {
      redSubpaths.forEach((pts, rIdx) => {
        const slot = Math.min(targetRedTurns.length - 1, Math.floor((rIdx / redSubpaths.length) * targetRedTurns.length));
        targetRedTurns[slot].redSlices.push({ points: pts });
      });
    }

    markers.forEach((_, mIdx) => {
      const slot =
        markers.length === 1
          ? Math.max(0, Math.min(total - 1, total >= 3 ? total - 2 : total - 1))
          : Math.min(total - 1, Math.max(1, Math.round(((mIdx + 1) / markers.length) * (total - 1))));
      turns[slot].markerIndices.push(mIdx);
      turns[slot].actor = "clash";
    });

    turns._redSubpaths = redSubpaths;
    turns._enemySubpaths = enemySubpaths;
    turns._phaseIndex = phaseIndex;
    return turns;
  }

  getPhaseBounds() {
    const total = Math.max(1, this.battle?.phases?.length || 1);
    if (this.guidedTour?.phaseRange) {
      return [
        Math.max(0, this.guidedTour.phaseRange[0]),
        Math.min(total - 1, this.guidedTour.phaseRange[1])
      ];
    }
    return [0, total - 1];
  }

  renderGuidedTourBadge() {
    if (!this.tourPillEl) return;
    if (!this.guidedTour) {
      this.tourPillEl.hidden = true;
      return;
    }
    const lang = getLang();
    if (this.tourPillTextEl) {
      const dur = this.guidedTour.durationLabel?.[lang] || this.guidedTour.durationLabel?.zh || "";
      const title = this.guidedTour.title?.[lang] || this.guidedTour.title?.zh || "";
      this.tourPillTextEl.textContent = dur ? `${dur} · ${title}` : title;
    }
    this.tourPillEl.hidden = false;
  }

  setGuidedTour(tour, { notify = false } = {}) {
    this.guidedTour = tour || null;
    this.continuousPlay = Boolean(tour);
    this.renderGuidedTourBadge();
    this.updateSceneSeek();
    if (notify) {
      this.emitEventChange({ tourExited: !tour });
    }
  }

  emitEventChange({ tourExited = false, scrubbing = false } = {}) {
    if (!this.battle) return;
    const isAll = this.turnMode === "all";
    const activeTurn = isAll ? null : this.turns[this.currentTurn];
    if (typeof this.onEventChange === "function") {
      this.onEventChange({
        phaseIndex: this.currentPhase,
        turnIndex: isAll ? -1 : this.currentTurn,
        eventId: activeTurn?.id || makeEventId(this.battle.id, this.currentPhase, Math.max(0, this.currentTurn)),
        playing: this.isUnifiedPlaying(),
        tourExited,
        scrubbing
      });
    }
  }

  isUnifiedPlaying() {
    return this.turnMode === "step" && this.turnPlaying;
  }

  pauseUnified({ notify = true } = {}) {
    this.stopTurnTimer();
    this.narrator.pause();
    this.updateVoiceButton(false);
    if (this.battle) {
      this.renderTurnHud();
      if (notify) this.emitEventChange();
    }
  }

  toggleUnifiedPlay({ continuous = true } = {}) {
    if (!this.battle) return;
    if (this.isUnifiedPlaying()) {
      this.pauseUnified();
      return;
    }
    this.continuousPlay = Boolean(continuous || this.guidedTour);
    const [minP, maxP] = this.getPhaseBounds();
    if (this.turnMode === "all") {
      this.turnMode = "step";
      this.turnPlaying = true;
      this.applyTurn(0);
      return;
    }
    if (this.currentPhase >= maxP && this.currentTurn >= this.turns.length - 1 && this.turnRemaining === 0) {
      this.goToScene(minP, 0, { autoPlay: true, continuous: this.continuousPlay });
      return;
    }
    this.startTurnTimer();
    this.emitEventChange();
  }

  goToScene(phaseIndex, turnIndex = 0, { autoPlay = false, continuous = false, narrate = true, scrubbing = false } = {}) {
    if (!this.battle) return;
    const maxP = Math.max(0, this.battle.phases.length - 1);
    const pIdx = Math.max(0, Math.min(maxP, Number(phaseIndex) || 0));
    const [tourStart, tourEnd] = this.getPhaseBounds();
    const tourExited = Boolean(this.guidedTour && (pIdx < tourStart || pIdx > tourEnd));
    if (tourExited) this.setGuidedTour(null, { notify: true });
    this.turnMode = "step";
    if (pIdx !== this.phaseRenderedIndex) {
      this.setPhase(pIdx, { initialTurn: turnIndex, autoPlay, continuous, narrate, scrubbing });
      return;
    }
    this.stopTurnTimer();
    this.continuousPlay = Boolean(continuous || this.guidedTour);
    this.turnPlaying = Boolean(autoPlay);
    const clampedT = Math.max(0, Math.min(Math.max(0, this.turns.length - 1), Number(turnIndex) || 0));
    this.applyTurn(clampedT, { narrate, scrubbing });
  }

  stepScene(delta) {
    if (!this.battle || this.turns.length === 0) return;
    this.stopTurnTimer();
    this.narrator.stop();
    this.turnMode = "step";
    const [minP, maxP] = this.getPhaseBounds();
    const nextT = this.currentTurn + delta;
    if (nextT >= 0 && nextT < this.turns.length) {
      this.applyTurn(nextT);
    } else if (nextT >= this.turns.length && this.currentPhase < maxP) {
      this.goToScene(this.currentPhase + 1, 0, { autoPlay: false, continuous: this.continuousPlay });
    } else if (nextT < 0 && this.currentPhase > minP) {
      this.goToScene(this.currentPhase - 1, 99, { autoPlay: false, continuous: this.continuousPlay });
    }
  }

  stopTurnTimer() {
    if (this.turnDeadline !== null) {
      this.turnRemaining = Math.max(0, this.turnDeadline - performance.now());
      this.turnDeadline = null;
    }
    if (this.turnTimer) {
      clearTimeout(this.turnTimer);
      this.turnTimer = null;
    }
    this.turnPlaying = false;
  }

  advanceOrFinishTurn() {
    this.turnTimer = null;
    this.turnDeadline = null;
    if (!this.turnPlaying || this.turnMode !== "step" || !this.battle) return;
    if (this.currentTurn < this.turns.length - 1) {
      this.applyTurn(this.currentTurn + 1);
      return;
    }
    const [, maxP] = this.getPhaseBounds();
    if (this.continuousPlay && this.currentPhase < maxP) {
      this.goToScene(this.currentPhase + 1, 0, { autoPlay: true, continuous: true });
      return;
    }
    this.turnPlaying = false;
    this.turnRemaining = 0;
    this.renderTurnHud();
    this.emitEventChange();
  }

  getTurnDuration() {
    const firstPhase = this.getPhaseBounds()[0];
    let index = this.currentTurn;
    for (let phase = firstPhase; phase < this.currentPhase; phase++) {
      index += getPhaseSceneCount(this.battle, phase);
    }
    return (this.guidedTour?.sceneDurations?.[index] ?? TURN_DURATION_MS / 1000) * 1000;
  }

  scheduleTurnTimeout(minDelay = 0) {
    if (this.turnTimer) clearTimeout(this.turnTimer);
    if (!this.turnPlaying || this.turnMode !== "step") return;
    const remaining = this.turnDeadline === null
      ? this.turnRemaining ?? this.getTurnDuration()
      : this.turnDeadline - performance.now();
    const delay = Math.max(minDelay, remaining);
    this.turnDeadline = performance.now() + delay;
    this.turnTimer = setTimeout(() => this.advanceOrFinishTurn(), delay);
  }

  scheduleNextTurnAfterSpeech() {
    this.scheduleTurnTimeout(850);
  }

  startTurnTimer() {
    if (this.turnMode !== "step" || this.turns.length === 0) return;
    this.turnPlaying = true;
    const phase = this.battle?.phases?.[this.currentPhase];
    const lang = getLang();
    if (this.narrator.isEnabled()) {
      const canResume = phase && this.narrator.canResume(this.battle.id, phase.id, this.currentTurn, lang);
      if (!canResume) {
        this.turnRemaining = null;
      }
      this.turnDeadline = performance.now() + (this.turnRemaining ?? this.getTurnDuration());
      this.renderTurnHud();
      if (canResume) {
        this.narrator.resume({
          onStart: () => this.updateVoiceButton(true),
          onEnd: () => {
            this.updateVoiceButton(false);
            this.scheduleNextTurnAfterSpeech();
          }
        });
      } else {
        this.speakCurrentTurn(() => this.scheduleNextTurnAfterSpeech());
      }
    } else {
      this.turnDeadline = performance.now() + (this.turnRemaining ?? this.getTurnDuration());
      this.renderTurnHud();
      this.scheduleTurnTimeout();
    }
  }

  goToTurn(turnIdx) {
    if (!this.battle || this.turns.length === 0) return;
    this.stopTurnTimer();
    this.turnMode = "step";
    const clamped = Math.max(0, Math.min(this.turns.length - 1, Number(turnIdx) || 0));
    this.applyTurn(clamped);
  }

  clearCinematicBanner() {
    if (this.bannerTimer) {
      clearTimeout(this.bannerTimer);
      this.bannerTimer = null;
    }
    this.bannerEl?.classList.remove("is-showing");
    this.stageEl?.classList.remove("is-clash-spotlight");
  }

  showCinematicBanner(banner) {
    this.clearCinematicBanner();
    if (!banner || !this.bannerEl) return;
    const lang = getLang();
    const copy = banner[lang] || banner.zh || banner.en;
    if (!copy) return;
    const kEl = this.stageEl.querySelector("#cb-kicker");
    const tEl = this.stageEl.querySelector("#cb-title");
    const sEl = this.stageEl.querySelector("#cb-sub");
    if (kEl) kEl.textContent = copy.kicker || "";
    if (tEl) tEl.textContent = copy.title || "";
    if (sEl) sEl.textContent = copy.sub || "";
    void this.bannerEl.offsetWidth;
    this.bannerEl.classList.add("is-showing");
    this.stageEl.classList.add("is-clash-spotlight");
    this.bannerTimer = setTimeout(() => {
      this.bannerEl?.classList.remove("is-showing");
      this.stageEl?.classList.remove("is-clash-spotlight");
      this.bannerTimer = null;
    }, 2500);
  }

  speakCurrentTurn(onDone) {
    if (!this.narrator.isEnabled() || !this.battle) {
      this.updateVoiceButton(false);
      onDone?.();
      return;
    }
    const lang = getLang();
    const phase = this.battle.phases[this.currentPhase];
    if (!phase) {
      onDone?.();
      return;
    }
    const isAll = this.turnMode === "all";
    const turnIdx = isAll ? 0 : this.currentTurn;
    const nextIdx = !isAll && turnIdx + 1 < this.turns.length ? turnIdx + 1 : null;
    this.narrator.playClip({
      battleId: this.battle.id,
      phaseId: phase.id,
      turnIndex: turnIdx,
      lang,
      nextTurnIndex: nextIdx,
      onStart: () => this.updateVoiceButton(true),
      onEnd: () => {
        this.updateVoiceButton(false);
        onDone?.();
      }
    });
  }

  computeComparePairs(phase, activeTurn, isAll) {
    if (isAll || !activeTurn?.meta?.compareUnits?.length) return [];
    const forward = Boolean(activeTurn.meta.compareToNextPhase);
    const formations = (forward
      ? this.battle.phases[this.currentPhase + 1]?.formations
      : phase?.formations) || [];
    const origins = forward
      ? new Map((phase?.formations || []).map((unit) => [unit.id, unit]))
      : this.prevPhaseCoords;
    const pairs = [];
    for (const item of activeTurn.meta.compareUnits) {
      if (item && typeof item === "object" && Array.isArray(item.from) && Array.isArray(item.to)) {
        pairs.push({
          id: item.id || "vec",
          from: { x: item.from[0], y: item.from[1] },
          to: { x: item.to[0], y: item.to[1] },
          side: item.side === "blue" ? "blue" : "red",
          forward
        });
        continue;
      }
      const unit = formations.find((u) => u.id === item);
      const prev = origins.get(item);
      if (!unit || !prev) continue;
      if (Math.hypot(unit.x - prev.x, unit.y - prev.y) < 10) continue;
      pairs.push({
        id: item,
        from: prev,
        to: { x: unit.x, y: unit.y },
        side: unit.side === "red" ? "red" : "blue",
        forward
      });
    }
    return pairs;
  }

  renderComparePairSvg(fx, fy, tx, ty, side, forward) {
    let svg = `<circle class="compare-ghost-dot side-${side}" cx="${fx.toFixed(1)}" cy="${fy.toFixed(1)}" r="4.5" />`;
    svg += `<line class="compare-ghost-line side-${side}" x1="${fx.toFixed(1)}" y1="${fy.toFixed(1)}" x2="${tx.toFixed(1)}" y2="${ty.toFixed(1)}" />`;
    if (forward) {
      const dx = tx - fx;
      const dy = ty - fy;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      const px = -uy;
      const py = ux;
      const ax1 = tx - ux * 9 + px * 4.5;
      const ay1 = ty - uy * 9 + py * 4.5;
      const ax2 = tx - ux * 9 - px * 4.5;
      const ay2 = ty - uy * 9 - py * 4.5;
      svg += `<circle class="compare-target-ring side-${side}" cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="6.2" />`;
      svg += `<polygon class="compare-target-head side-${side}" points="${tx.toFixed(1)},${ty.toFixed(1)} ${ax1.toFixed(1)},${ay1.toFixed(1)} ${ax2.toFixed(1)},${ay2.toFixed(1)}" />`;
    }
    return svg;
  }

  applyTurn(turnIdx, { narrate = true, scrubbing = false } = {}) {
    if (!this.battle) return;
    const phase = this.battle.phases[this.currentPhase];
    if (!phase) return;

    if (this.turnTimer) {
      clearTimeout(this.turnTimer);
      this.turnTimer = null;
    }
    this.narrator.stop();
    this.updateVoiceButton();
    this.turnDeadline = null;
    this.turnRemaining = null;

    const isAll = turnIdx < 0 || this.turnMode === "all";
    this.currentTurn = isAll ? this.turns.length - 1 : Math.max(0, Math.min(this.turns.length - 1, turnIdx));
    this.turnStartTime = performance.now();
    this.phaseStartTime = this.turnStartTime;

    const activeTurn = isAll ? null : this.turns[this.currentTurn];
    if (this.turnPlaying && !isAll) this.turnDeadline = this.turnStartTime + this.getTurnDuration();
    const theme = this.battle.theme || {};
    this.activeComparePairs = this.computeComparePairs(phase, activeTurn, isAll);

    this.sync2DTurn(phase, activeTurn, isAll);
    if (this.terrain3d.ready) {
      this.syncGlTurn(phase, this.currentPhase, activeTurn, isAll, theme);
      if (this.autoCamera && this.viewMode === "3d" && !isAll && activeTurn) {
        this.focusCameraOnTurn(phase, activeTurn);
      }
    }

    // 关键转折回合弹出电影级战报横幅 + 局部聚焦暗角
    if (!isAll && activeTurn?.banner) {
      this.showCinematicBanner(activeTurn.banner);
    } else {
      this.clearCinematicBanner();
    }

    this.renderTurnHud();
    if (typeof this.onTurnChange === "function") {
      this.onTurnChange(isAll ? -1 : this.currentTurn, this.turns.length);
    }
    this.emitEventChange({ scrubbing });

    // 语音解说与战地音效同步：开启声音时等待男声解说完毕再推进下一回合
    if (narrate && this.narrator.isEnabled()) {
      if (!isAll && activeTurn?.sfx) {
        this.narrator.playCue(activeTurn.sfx);
      }
      this.speakCurrentTurn(() => this.scheduleNextTurnAfterSpeech());
    } else if (this.turnPlaying && !isAll) {
      this.scheduleTurnTimeout();
    }
  }

  sync2DTurn(phase, activeTurn, isAll) {
    if (!this.svgEl) return;
    const k = this.currentTurn;
    const enemySubpaths = this.turns._enemySubpaths || [];

    // 2D 模式同样严格按回合分段渲染我方推进路线，关闭 3D 或静音时也能清晰看清路线先后变化
    const activeRedRoute = this.svgEl.querySelector("#map-routes .route.is-active");
    if (activeRedRoute) {
      activeRedRoute.classList.toggle("is-turn-managed", !isAll);
    }
    const turnRouteLayer = this.svgEl.querySelector("#map-route-turn-layer");
    if (turnRouteLayer) {
      if (isAll) {
        turnRouteLayer.innerHTML = "";
      } else {
        const toPathD = (pts) =>
          pts
            .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
            .join(" ");
        const parts = [];
        this.turns.forEach((tObj, idx) => {
          if (idx > k) return;
          const cls = idx === k ? "route-turn-active" : "route-turn-past";
          (tObj.redSlices || []).forEach(({ points }) => {
            if (points && points.length >= 2) {
              parts.push(`<path class="${cls}" d="${toPathD(points)}" />`);
            }
          });
        });
        turnRouteLayer.innerHTML = parts.join("");
      }
    }

    // 2D 前后对照部队位移残影虚线
    const compareLayer = this.svgEl.querySelector("#map-compare-layer");
    if (compareLayer) {
      if (this.activeComparePairs.length === 0) {
        compareLayer.innerHTML = "";
      } else {
        compareLayer.innerHTML = this.activeComparePairs
          .map(({ from, to, side, forward }) => this.renderComparePairSvg(from.x, from.y, to.x, to.y, side, forward))
          .join("");
      }
    }

    enemySubpaths.forEach(({ idx, el }) => {
      if (isAll) {
        el.classList.remove("is-turn-past", "is-turn-future");
        return;
      }
      const turnOfEnemy = this.turns.findIndex((tObj) => tObj.enemyIndices.includes(idx));
      el.classList.toggle("is-turn-past", turnOfEnemy >= 0 && turnOfEnemy < k);
      el.classList.toggle("is-turn-future", turnOfEnemy > k);
    });

    const markerEls = [...this.svgEl.querySelectorAll("#map-markers .battle-marker")];
    markerEls.forEach((el, mIdx) => {
      if (isAll) {
        el.classList.remove("is-turn-future");
        return;
      }
      const mTurn = this.turns.findIndex((tObj) => tObj.markerIndices.includes(mIdx));
      el.classList.toggle("is-turn-future", mTurn > k);
    });

    const actor = isAll ? "all" : activeTurn?.actor || "all";
    this.svgEl.querySelectorAll("#formation-layer .formation").forEach((node) => {
      const isRed = node.classList.contains("red");
      const idle = !isAll && ((actor === "red" && !isRed) || (actor === "blue" && isRed));
      node.classList.toggle("is-turn-idle", idle);
    });
  }

  syncGlTurn(phase, phaseIndex, activeTurn, isAll, theme) {
    const k = this.currentTurn;
    const redSubpaths = this.turns._redSubpaths || [];
    const enemySubpaths = this.turns._enemySubpaths || [];

    // 地标按需呼吸：突出当前回合核心地标，弱化远方无关地名
    const focusPlaces = !isAll && activeTurn?.focusPlaces?.length ? new Set(activeTurn.focusPlaces) : null;
    this.glLandmarks.forEach(({ el, loc }) => {
      const isKey = (phase.keys || []).includes(loc.name);
      const isTurnFocus = focusPlaces ? focusPlaces.has(loc._rawName || loc.name) || focusPlaces.has(loc.name) : false;
      el.classList.toggle("is-key", isKey);
      el.classList.toggle("is-turn-focus", isTurnFocus);
      el.classList.toggle("is-breathing-dim", !isAll && focusPlaces !== null && !isTurnFocus && !isKey);
    });

    const routeSpecs = [];
    const activeMoverPaths = [];

    // 之前阶段的淡留历史轨迹（极简淡化）
    this.svgEl.querySelectorAll("#map-routes .route").forEach((pathEl) => {
      const idx = Number(pathEl.getAttribute("data-phase-route"));
      if (idx >= phaseIndex) return;
      this.sampleSvgSubpaths(pathEl, 46).forEach((pts) => {
        routeSpecs.push({
          points: pts,
          color: theme.accentBright || theme.accent || "#e2513f",
          width: 0.011,
          hover: 0.014,
          alpha: 0.16,
          dashScale: 4.0,
          speed: 0,
          arrow: false,
          animateDraw: false,
          side: "red"
        });
      });
    });

    if (isAll) {
      redSubpaths.forEach((pts) => {
        routeSpecs.push({
          points: pts,
          color: theme.accentBright || theme.accent || "#e2513f",
          width: 0.025,
          hover: 0.025,
          alpha: 0.94,
          dashScale: 7.0,
          speed: 1.5,
          arrow: true,
          animateDraw: true,
          side: "red"
        });
        activeMoverPaths.push({ points: pts, side: "red", singlePass: false });
      });
      enemySubpaths.forEach(({ points }) => {
        routeSpecs.push({
          points,
          color: theme.opposing || "#7ba5b8",
          width: 0.015,
          hover: 0.02,
          alpha: 0.72,
          dashScale: 8.2,
          speed: 1.2,
          arrow: true,
          animateDraw: true,
          side: "blue"
        });
        activeMoverPaths.push({ points, side: "blue", singlePass: false });
      });
    } else {
      this.turns.forEach((tObj, idx) => {
        if (idx > k) return;
        const isCurrent = idx === k;

        tObj.redSlices.forEach(({ points }) => {
          routeSpecs.push({
            points,
            color: theme.accentBright || theme.accent || "#e2513f",
            width: isCurrent ? 0.028 : 0.015,
            hover: isCurrent ? 0.027 : 0.018,
            alpha: isCurrent ? 0.98 : 0.28,
            dashScale: isCurrent ? 7.2 : 5.0,
            speed: isCurrent ? 1.7 : 0,
            arrow: true,
            animateDraw: isCurrent,
            side: "red"
          });
          if (isCurrent) activeMoverPaths.push({ points, side: "red", singlePass: true });
        });

        tObj.enemyIndices.forEach((eIdx) => {
          const eObj = enemySubpaths.find((item) => item.idx === eIdx);
          if (!eObj) return;
          routeSpecs.push({
            points: eObj.points,
            color: theme.opposing || "#7ba5b8",
            width: isCurrent ? 0.022 : 0.013,
            hover: isCurrent ? 0.024 : 0.017,
            alpha: isCurrent ? 0.94 : 0.25,
            dashScale: isCurrent ? 8.0 : 5.5,
            speed: isCurrent ? 1.55 : 0,
            arrow: true,
            animateDraw: isCurrent,
            side: "blue"
          });
          if (isCurrent) activeMoverPaths.push({ points: eObj.points, side: "blue", singlePass: true });
        });
      });
    }

    const futurePath = this.svgEl.querySelector("#map-routes .route-future.is-active");
    if (futurePath && (isAll || k === this.turns.length - 1)) {
      const pts = this.sampleSvgPath(futurePath, 40);
      if (pts.length >= 2) {
        routeSpecs.push({
          points: pts,
          color: theme.gold || theme.accent || "#d6b56a",
          width: 0.014,
          hover: 0.02,
          alpha: 0.54,
          dashScale: 10,
          speed: 1.0,
          arrow: true,
          animateDraw: true,
          side: "red"
        });
      }
    }

    this.terrain3d.setRoutes(routeSpecs);

    // 仅展示截至当前回合的战事标记与包围圈（交锋回合触发炮火弹道）
    const visibleMarkers = [];
    const activeTurnMarkers = [];
    (phase.markers || []).forEach((m, mIdx) => {
      if (isAll) {
        visibleMarkers.push({ m, isNew: true });
        activeTurnMarkers.push(m);
        return;
      }
      const mTurn = this.turns.findIndex((tObj) => tObj.markerIndices.includes(mIdx));
      if (mTurn <= k) {
        visibleMarkers.push({ m, isNew: mTurn === k });
        if (mTurn === k) activeTurnMarkers.push(m);
      }
    });

    const ringSpecs = visibleMarkers.map(({ m, isNew }) => ({
      x: m.x,
      y: m.y,
      radius: m.type === "fire" ? 42 : 34,
      width: isNew ? 0.014 : 0.008,
      color:
        m.type === "fire"
          ? "#ff7b29"
          : m.type === "victory" || m.type === "turning"
          ? theme.gold || "#e8be63"
          : theme.accentBright || "#e2513f",
      alpha: isNew ? 0.86 : 0.34
    }));
    this.terrain3d.setRings(ringSpecs);
    this.terrain3d.setFrontlineUnits(phase.formations || [], theme);
    const shouldShowArcs = isAll || activeTurn?.actor === "clash" || activeTurnMarkers.length > 0;
    this.terrain3d.setCombatArcs(
      shouldShowArcs ? phase.formations || [] : [],
      shouldShowArcs ? activeTurnMarkers : [],
      theme
    );
    this.terrain3d.setParticles(visibleMarkers.map((x) => x.m));

    if (this.glMarkersEl) {
      this.glMarkersEl.innerHTML = "";
      this.glMarkers = [];
      visibleMarkers.forEach(({ m, isNew }) => {
        const type = m.type || "clash";
        const el = document.createElement("button");
        el.type = "button";
        el.className = `gl-marker marker-${type}${isNew ? " is-turn-new" : ""}`;
        el.setAttribute("aria-label", `${m.label}${m.desc ? `：${m.desc}` : ""}`);
        el.innerHTML = `
          <span class="gl-marker-orb"><span style="display:inline-block">${getMarkerGlyph(m)}</span></span>
          <span class="gl-marker-beam"></span>
          <span class="gl-marker-ring"></span>
        `;
        const showInfo = (event) => {
          this.showTooltip(event, {
            kicker: getMarkerKicker(type),
            title: m.label,
            body: m.desc || ""
          });
        };
        el.addEventListener("mouseenter", showInfo);
        el.addEventListener("mousemove", (ev) => this.positionTooltip(ev));
        el.addEventListener("focus", showInfo);
        el.addEventListener("click", showInfo);
        el.addEventListener("mouseleave", () => this.hideTooltip());
        el.addEventListener("blur", () => this.hideTooltip());
        this.glMarkersEl.append(el);
        this.glMarkers.push({ el, marker: m });
      });
    }

    // 仅为当前回合活跃路线生成先锋图标，随箭头生长单程推进至终点
    if (this.glMoversEl) {
      this.glMoversEl.innerHTML = "";
      this.glMovers = [];
      const primaryKind = inferBattleRouteKind(this.battle);
      activeMoverPaths.forEach(({ points, side, singlePass }) => {
        if (points.length < 2) return;
        const el = document.createElement("div");
        el.className = `gl-mover side-${side}`;
        el.innerHTML =
          side === "red"
            ? `<span class="gl-mover-badge">${get3DUnitIconSvg(primaryKind)}</span>`
            : `<span class="gl-mover-dot"></span>`;
        this.glMoversEl.append(el);
        this.glMovers.push({ el, points, side, singlePass, speed: side === "red" ? 0.14 : 0.16 });
      });
    }

    this.syncGlUnits(phase, activeTurn, isAll);
  }

  // 纪录片式微幅跟随运镜：当事件配置了锁定对照镜头（同比例、同视角前后对照）时直接锁定，否则平滑聚焦
  focusCameraOnTurn(phase, activeTurn) {
    if (activeTurn?.meta?.camera) {
      this.cam = { ...activeTurn.meta.camera };
      return;
    }
    const pts = [];
    activeTurn.redSlices.forEach(({ points }) => {
      if (points.length) {
        pts.push(points[0], points[points.length - 1]);
      }
    });
    const enemySubpaths = this.turns._enemySubpaths || [];
    activeTurn.enemyIndices.forEach((eIdx) => {
      const eObj = enemySubpaths.find((x) => x.idx === eIdx);
      if (eObj && eObj.points.length) {
        pts.push(eObj.points[0], eObj.points[eObj.points.length - 1]);
      }
    });
    activeTurn.markerIndices.forEach((mIdx) => {
      const m = (phase.markers || [])[mIdx];
      if (m) pts.push([m.x, m.y]);
    });
    if (pts.length === 0) return;

    let cx = 0;
    let cy = 0;
    for (const [x, y] of pts) {
      cx += x;
      cy += y;
    }
    cx /= pts.length;
    cy /= pts.length;

    const targetPanX = Math.max(-145, Math.min(145, (440 - cx) * 0.42));
    const targetPanY = Math.max(-135, Math.min(135, (360 - cy) * 0.44 + 10));
    const yawDrift = [-10, -4, 6, -8][activeTurn.index % 4] ?? -8;
    const zoomBump = activeTurn.actor === "clash" ? 1.18 : 1.10;
    this.cam = {
      pitch: activeTurn.actor === "clash" ? 34 : 37,
      yaw: yawDrift,
      zoom: zoomBump,
      panX: Math.round(targetPanX),
      panY: Math.round(targetPanY)
    };
  }

  // 根据当前阶段的关键交战点与地标计算默认运镜聚焦参数
  focusCameraOnPhase(phase, phaseIndex) {
    if (!phase || !this.battle) return;
    const pts = [];
    const locs = this.battle.mapConfig?.locations || [];
    (phase.markers || []).forEach((m) => pts.push([m.x, m.y]));
    (phase.keys || []).forEach((name) => {
      const found = locs.find((l) => l.name === name);
      if (found) pts.push([found.x, found.y]);
    });
    if (pts.length === 0) {
      this.cam = { ...DEFAULT_CAM_3D };
      return;
    }

    let cx = 0;
    let cy = 0;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const [x, y] of pts) {
      cx += x;
      cy += y;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    cx /= pts.length;
    cy /= pts.length;

    const span = Math.hypot(maxX - minX, maxY - minY);
    const zoom = Math.max(1.0, Math.min(1.18, 1.24 - span * 0.00046));
    const yawOffset = [-10, 9, -12, 8][phaseIndex % 4] || -10;
    const pitch = span < 220 ? 34 : 38;
    const panX = Math.max(-145, Math.min(145, (440 - cx) * 0.45));
    const panY = Math.max(-145, Math.min(145, (360 - cy) * 0.48 + 8));

    this.cam = { pitch, yaw: yawOffset, zoom: +zoom.toFixed(2), panX: Math.round(panX), panY: Math.round(panY) };
  }

  stopGlLoop() {
    if (this.glRaf) {
      cancelAnimationFrame(this.glRaf);
      this.glRaf = null;
    }
    this.stopTurnTimer();
    this.narrator.stop();
    this.clearCinematicBanner();
  }

  updateWarHudBase(phase) {
    if (!this.battle || !phase) return;
    const fs = this.battle.mapConfig?.filterSides || {};
    const redNameEl = this.stageEl.querySelector("#hud-red-name");
    const blueNameEl = this.stageEl.querySelector("#hud-blue-name");
    if (redNameEl) redNameEl.textContent = fs.red || t("hudRedDefault");
    if (blueNameEl) blueNameEl.textContent = fs.blue || t("hudBlueDefault");
  }

  renderTurnHud() {
    if (!this.battle) return;
    const totalPhases = Math.max(1, this.battle.phases.length);
    const curves = {
      "chishui-1935": [28, 56, 70, 88],
      "guandu-200": [38, 46, 78, 92],
      "changjin-1950": [62, 74, 68, 84],
      "normandy-1944": [48, 62, 76, 90],
      "market-garden-1944": [72, 58, 40, 26],
      "sinai-1973": [24, 52, 74, 92]
    };
    const curve = curves[this.battle.id];
    const targetPct = curve
      ? curve[Math.min(this.currentPhase, curve.length - 1)]
      : Math.round(35 + ((this.currentPhase + 1) / totalPhases) * 50);
    const prevPct = this.currentPhase > 0 && curve ? curve[this.currentPhase - 1] : 50;
    const totalTurns = Math.max(1, this.turns.length);
    const turnFrac = this.turnMode === "all" ? 1 : (this.currentTurn + 1) / totalTurns;
    const pct = Math.round(prevPct + (targetPct - prevPct) * turnFrac);

    const fillEl = this.stageEl.querySelector("#hud-momentum-fill");
    const sparkEl = this.stageEl.querySelector("#hud-momentum-spark");
    if (fillEl) fillEl.style.width = `${pct}%`;
    if (sparkEl) sparkEl.style.left = `${pct}%`;

    const isAll = this.turnMode === "all";
    const activeTurn = isAll ? null : this.turns[this.currentTurn];
    const actorEl = this.stageEl.querySelector("#turn-actor-badge");
    const countEl = this.stageEl.querySelector("#turn-step-count");
    const tickerEl = this.stageEl.querySelector("#hud-ticker-text");
    const playBtn = this.stageEl.querySelector("#turn-play");
    const prevBtn = this.stageEl.querySelector("#turn-prev");
    const nextBtn = this.stageEl.querySelector("#turn-next");
    const modeBtn = this.stageEl.querySelector("#turn-mode-btn");

    if (actorEl) {
      const actor = isAll ? "all" : activeTurn?.actor || "red";
      actorEl.className = `turn-actor actor-${actor}`;
      actorEl.textContent =
        actor === "all"
          ? t("turnOverview")
          : actor === "blue"
          ? t("turnActorBlue")
          : actor === "clash"
          ? t("turnActorClash")
          : t("turnActorRed");
    }
    if (countEl) {
      countEl.textContent = isAll ? `${totalTurns}/${totalTurns}` : `${this.currentTurn + 1}/${totalTurns}`;
    }
    if (tickerEl) {
      const phase = this.battle.phases[this.currentPhase];
      tickerEl.classList.remove("is-ticking");
      void tickerEl.offsetWidth;
      if (isAll) {
        tickerEl.textContent = `${phase?.name || ""} — ${t("turnOverviewLabel")}`;
      } else if (activeTurn) {
        tickerEl.textContent = `${activeTurn.date ? `${activeTurn.date} · ` : ""}${activeTurn.title}`;
      }
      tickerEl.classList.add("is-ticking");
    }
    const lang = getLang();
    if (this.comparePillEl) {
      const cmp = !isAll ? activeTurn?.meta?.compareLabel?.[lang] || activeTurn?.meta?.compareLabel?.zh : null;
      if (cmp) {
        this.comparePillEl.textContent = cmp;
        this.comparePillEl.hidden = false;
      } else {
        this.comparePillEl.hidden = true;
      }
    }
    this.renderLiveCommentary(isAll);
    this.updateSceneSeek();
    const [minP, maxP] = this.getPhaseBounds();
    if (playBtn) {
      playBtn.textContent = this.turnPlaying && !isAll ? "⏸" : "▶";
      playBtn.title = this.turnPlaying && !isAll ? t("turnPause") : t("turnPlay");
      playBtn.setAttribute("aria-label", playBtn.title);
      playBtn.classList.toggle("is-playing", this.turnPlaying && !isAll);
    }
    if (prevBtn) {
      prevBtn.disabled = !isAll && this.currentPhase <= minP && this.currentTurn <= 0;
      prevBtn.title = t("turnPrev");
      prevBtn.setAttribute("aria-label", prevBtn.title);
    }
    if (nextBtn) {
      nextBtn.disabled = !isAll && this.currentPhase >= maxP && this.currentTurn >= totalTurns - 1;
      nextBtn.title = t("turnNext");
      nextBtn.setAttribute("aria-label", nextBtn.title);
    }
    if (modeBtn) {
      modeBtn.textContent = isAll ? t("turnStepMode") : t("turnOverview");
      modeBtn.title = t("turnOverviewTitle");
      modeBtn.classList.toggle("is-active", isAll);
    }
    if (this.turnProgressFillEl) {
      this.turnProgressFillEl.style.width = isAll ? "100%" : "0%";
    }
  }

  updateSceneSeek() {
    if (!this.sceneSeekEl || !this.battle) return;
    const isAll = this.turnMode === "all";
    this.sceneSeekEl.closest(".scene-timeline")?.classList.toggle("is-overview", isAll);
    const [first, last] = this.getPhaseBounds();
    this.sceneStops = [];
    for (let phase = first; phase <= last; phase++) {
      const count = getPhaseSceneCount(this.battle, phase);
      for (let turn = 0; turn < count; turn++) this.sceneStops.push({ phase, turn });
    }
    const index = this.sceneStops.findIndex(({ phase, turn }) => phase === this.currentPhase && turn === this.currentTurn);
    const scene = this.turns[this.currentTurn];
    this.sceneSeekEl.max = this.sceneStops.length - 1;
    this.sceneSeekEl.value = Math.max(0, index);
    this.sceneSeekEl.setAttribute("aria-label", t("sceneSeek"));
    this.sceneSeekEl.setAttribute("aria-valuetext", isAll ? t("turnOverview") : [scene?.date, scene?.title].filter(Boolean).join(" · "));
    if (this.scenePositionEl) {
      this.scenePositionEl.textContent = isAll ? t("turnOverview") : `${Math.max(0, index) + 1} / ${this.sceneStops.length}`;
    }
  }

  renderLiveCommentary(isAll = false) {
    if (!this.castFeedEl || !this.battle) return;
    const lang = getLang();
    const totalTurns = Math.max(1, this.turns.length);
    if (this.castStepEl) {
      this.castStepEl.textContent = isAll ? t("turnOverview") : `${this.currentTurn + 1}/${totalTurns}`;
    }
    if (this.castToggleEl) {
      this.castToggleEl.title = t("castCollapseTitle");
    }

    const visibleTurns = isAll ? this.turns : this.turns.slice(0, this.currentTurn + 1);
    const actorLabel = (actor) =>
      actor === "blue" ? t("turnActorBlue") : actor === "clash" ? t("turnActorClash") : t("turnActorRed");

    this.castFeedEl.innerHTML = visibleTurns
      .map((tObj, idx) => {
        const isActive = !isAll && idx === this.currentTurn;
        const body = tObj.narration?.[lang] || tObj.desc || "";
        return `
          <button type="button" class="live-cast-item actor-${tObj.actor || "red"}${isActive ? " is-active" : ""}" data-cast-turn="${tObj.index}">
            <div class="live-cast-meta">
              <span class="live-cast-tag">${actorLabel(tObj.actor)}</span>
              ${tObj.date ? `<span class="live-cast-time">${tObj.date}</span>` : ""}
              <span class="live-cast-headline">${tObj.title || ""}</span>
            </div>
            <p class="live-cast-body">${body}</p>
          </button>`;
      })
      .join("");

    this.castFeedEl.querySelectorAll("[data-cast-turn]").forEach((btn) => {
      btn.addEventListener("click", () => this.goToTurn(Number(btn.dataset.castTurn)));
    });

    // 事件级史料依据与地图精度标注（区分史实地点、示意路线与程序模拟地形）
    const activeTurn = isAll ? this.turns[this.turns.length - 1] : this.turns[this.currentTurn];
    const sources = activeTurn?.meta?.sources || [];
    if (this.castSourceBtnEl) {
      this.castSourceBtnEl.textContent = sources.length > 0 ? `${t("sourceBtn")} (${sources.length})` : t("sourceBtn");
      this.castSourceBtnEl.classList.toggle("is-active", this.sourcesOpen);
      this.castSourceBtnEl.setAttribute("aria-expanded", String(this.sourcesOpen));
    }
    if (this.castSourcesEl) {
      if (sources.length > 0) {
        this.castSourcesEl.innerHTML = sources
          .map((s) => {
            const title = s.title?.[lang] || s.title?.zh || "";
            const note = s.note?.[lang] || s.note?.zh || "";
            const link = s.url
              ? `<a href="${s.url}" target="_blank" rel="noreferrer">${lang === "en" ? "Read source ↗" : "查看史料出处 ↗"}</a>`
              : "";
            return `<div class="cast-source-entry"><strong>${title}</strong><p>${note}</p>${link}</div>`;
          })
          .join("");
      } else {
        this.castSourcesEl.innerHTML = `<div class="cast-source-entry"><p>${t("sourceEmpty")}</p></div>`;
      }
      this.castSourcesEl.hidden = !this.sourcesOpen;
    }
    if (this.castPrecisionEl) {
      const precision = activeTurn?.meta?.precision?.[lang] || activeTurn?.meta?.precision?.zh;
      const notes = [t("precisionTag"), precision || getDefaultPrecision(lang)];
      if (precision && !/3D|三维/.test(precision)) notes.push(t("terrainProvenance"));
      if (this.activeComparePairs.length) {
        notes.push(activeTurn?.meta?.compareToNextPhase ? t("compareKeyNext") : t("compareKey"));
      }
      this.castPrecisionEl.textContent = notes.join(" · ");
    }

    // 平滑滚动至最新一条解说（游戏直播实况滚动感）
    requestAnimationFrame(() => {
      if (!this.castFeedEl) return;
      this.castFeedEl.scrollTo({ top: this.castFeedEl.scrollHeight, behavior: "smooth" });
    });
  }

  samplePolylineAt(points, tNorm) {
    const n = points.length;
    if (n === 0) return [440, 360];
    if (n === 1) return points[0];
    const clamped = Math.max(0, Math.min(1, tNorm));
    const f = clamped * (n - 1);
    const i = Math.min(n - 2, Math.floor(f));
    const frac = f - i;
    return [
      points[i][0] + (points[i + 1][0] - points[i][0]) * frac,
      points[i][1] + (points[i + 1][1] - points[i][1]) * frac
    ];
  }

  startGlLoop() {
    if (!this.terrain3d.ready || this.viewMode !== "3d") return;
    if (this.glRaf) return;

    const tick = (now) => {
      if (this.viewMode !== "3d") {
        this.glRaf = null;
        return;
      }
      const elapsed = Math.max(0, (now - this.glStartTime) / 1000);
      const turnElapsed = Math.max(0, (now - this.turnStartTime) / 1000);

      // 平滑相机阻尼插值（纪录片运镜丝滑推拉）
      const lerp = this.dragState ? 0.45 : 0.075;
      this.glCam.pitch += (this.cam.pitch - this.glCam.pitch) * lerp;
      this.glCam.yaw += (this.cam.yaw - this.glCam.yaw) * lerp;
      this.glCam.zoom += (this.cam.zoom - this.glCam.zoom) * lerp;
      this.glCam.panX += (this.cam.panX - this.glCam.panX) * lerp;
      this.glCam.panY += (this.cam.panY - this.glCam.panY) * lerp;

      if (this.hudCompassNeedleEl) {
        this.hudCompassNeedleEl.style.transform = `rotate(${this.glCam.yaw.toFixed(1)}deg)`;
      }
      // 放大视角时自动展开全部呼吸收拢的兵牌与地名
      this.stageEl.classList.toggle("is-zoomed-in", this.glCam.zoom >= 1.4);

      // 更新回合进度细条（开启男声解说时精确同步音频播放进度）
      if (this.turnProgressFillEl && this.turnMode === "step") {
        const audioProg = this.narrator.getProgress();
        if (audioProg !== null) {
          this.turnProgressFillEl.style.width = `${(audioProg * 100).toFixed(1)}%`;
        } else {
          const duration = this.getTurnDuration();
          const remaining = this.turnDeadline === null ? this.turnRemaining ?? duration : this.turnDeadline - now;
          const pct = Math.max(0, Math.min(100, (1 - remaining / duration) * 100));
          this.turnProgressFillEl.style.width = `${pct.toFixed(1)}%`;
        }
      }

      this.terrain3d.updateCamera(this.glCam);
      this.terrain3d.render(elapsed, {
        showEnemy: this.layers.enemy,
        showCombat: this.layers.combat,
        phaseElapsed: turnElapsed
      });

      // 投影贴地地标（匹配 Terrain3DEngine 世界坐标尺度）
      for (const { el, loc } of this.glLandmarks) {
        const p = this.terrain3d.project(loc.x, loc.y, 0.02);
        el.style.transform = `translate3d(${p.sx.toFixed(1)}px, ${p.sy.toFixed(1)}px, 0)`;
        el.style.zIndex = String(Math.round((1 - p.depth) * 1000));
        el.style.visibility = p.visible ? "visible" : "hidden";
      }

      // 投影战事光柱徽章并记录坐标用于兵牌避让
      const markerObstacles = [];
      for (const { el, marker } of this.glMarkers) {
        const p = this.terrain3d.project(marker.x, marker.y, 0.032);
        el.style.transform = `translate3d(${p.sx.toFixed(1)}px, ${p.sy.toFixed(1)}px, 0)`;
        el.style.zIndex = String(Math.round((1 - p.depth) * 1000) + 140);
        el.style.visibility = p.visible ? "visible" : "hidden";
        if (p.visible) markerObstacles.push({ x: p.sx, y: p.sy - 20 });
      }

      // 投影贴地兵力棋子并执行斥力避让
      const projectedUnits = [];
      this.glUnits.forEach((u) => {
        if (!u.active) return;
        u.x += (u.tx - u.x) * 0.09;
        u.y += (u.ty - u.y) * 0.09;
        const p = this.terrain3d.project(u.x, u.y, 0.025);
        projectedUnits.push({ u, p, ox: 0, oy: 0 });
      });

      const boxW = 108;
      const boxH = 30;
      for (let iter = 0; iter < 5; iter++) {
        for (const a of projectedUnits) {
          if (!a.p.visible) continue;
          for (const obs of markerObstacles) {
            const dx = a.p.sx + a.ox - obs.x;
            const dy = a.p.sy - 26 + a.oy - obs.y;
            if (Math.abs(dx) < 76 && Math.abs(dy) < 38) {
              const dirX = dx === 0 ? 1 : Math.sign(dx);
              const dirY = dy === 0 ? 1 : Math.sign(dy);
              a.ox = Math.max(-68, Math.min(68, a.ox + dirX * (76 - Math.abs(dx)) * 0.45));
              a.oy = Math.max(-56, Math.min(56, a.oy + dirY * (38 - Math.abs(dy)) * 0.38));
            }
          }
        }
        for (let i = 0; i < projectedUnits.length; i++) {
          const a = projectedUnits[i];
          if (!a.p.visible) continue;
          for (let j = i + 1; j < projectedUnits.length; j++) {
            const b = projectedUnits[j];
            if (!b.p.visible) continue;
            const dx = a.p.sx + a.ox - (b.p.sx + b.ox);
            const dy = a.p.sy + a.oy - (b.p.sy + b.oy);
            if (Math.abs(dx) < boxW && Math.abs(dy) < boxH) {
              const pushY = (boxH - Math.abs(dy)) * 0.46;
              const dirY = dy === 0 ? (i % 2 === 0 ? -1 : 1) : Math.sign(dy);
              a.oy = Math.max(-62, Math.min(62, a.oy + dirY * pushY));
              b.oy = Math.max(-62, Math.min(62, b.oy - dirY * pushY));
              const pushX = (boxW - Math.abs(dx)) * 0.18;
              const dirX = dx === 0 ? (i % 2 === 0 ? -1 : 1) : Math.sign(dx);
              a.ox = Math.max(-68, Math.min(68, a.ox + dirX * pushX));
              b.ox = Math.max(-68, Math.min(68, b.ox - dirX * pushX));
            }
          }
        }
      }

      for (const item of projectedUnits) {
        const { u, p, ox, oy } = item;
        u.el.style.transform = `translate3d(${p.sx.toFixed(1)}px, ${p.sy.toFixed(1)}px, 0)`;
        u.el.style.setProperty("--card-ox", `${ox.toFixed(1)}px`);
        u.el.style.setProperty("--card-oy", `${oy.toFixed(1)}px`);
        u.el.style.zIndex = String(Math.round((1 - p.depth) * 1000) + 60);
        u.el.style.visibility = p.visible ? "visible" : "hidden";
      }

      // 投影当前回合活跃路线上的单程先锋行军图标（精准骑在生长箭头最前端！）
      if (!this.prefersReducedMotion) {
        const rawProg = Math.min(1, turnElapsed / 1.15);
        const easedProg = 1 - Math.pow(1 - rawProg, 3);
        for (const m of this.glMovers) {
          if (m.side === "blue" && !this.layers.enemy) {
            m.el.style.visibility = "hidden";
            continue;
          }
          const tPos = m.singlePass ? easedProg : (elapsed * m.speed) % 1;
          const [mx, my] = this.samplePolylineAt(m.points, tPos);
          const p = this.terrain3d.project(mx, my, m.side === "red" ? 0.042 : 0.032);
          const edgeFade = m.singlePass ? Math.min(1, tPos * 6) : tPos < 0.08 ? tPos / 0.08 : tPos > 0.92 ? (1 - tPos) / 0.08 : 1;
          m.el.style.transform = `translate3d(${p.sx.toFixed(1)}px, ${p.sy.toFixed(1)}px, 0)`;
          m.el.style.opacity = String(edgeFade.toFixed(2));
          m.el.style.zIndex = String(Math.round((1 - p.depth) * 1000) + 95);
          m.el.style.visibility = p.visible ? "visible" : "hidden";
        }
      }

      // 投影前后对照的部队位移残影虚线（3D 同视角对照）
      if (this.glCompareSvgEl) {
        if (this.activeComparePairs.length === 0) {
          if (!this._glCompareEmpty) {
            this.glCompareSvgEl.innerHTML = "";
            this._glCompareEmpty = true;
          }
        } else {
          const parts = [];
          for (const pair of this.activeComparePairs) {
            const pf = this.terrain3d.project(pair.from.x, pair.from.y, 0.026);
            const pt = this.terrain3d.project(pair.to.x, pair.to.y, 0.026);
            if (!pf.visible && !pt.visible) continue;
            parts.push(this.renderComparePairSvg(pf.sx, pf.sy, pt.sx, pt.sy, pair.side, pair.forward));
          }
          this.glCompareSvgEl.innerHTML = parts.join("");
          this._glCompareEmpty = false;
        }
      }

      this.glRaf = requestAnimationFrame(tick);
    };
    this.glRaf = requestAnimationFrame(tick);
  }

  showTooltip(event, { kicker, title, body }) {
    if (!this.tooltipEl) return;
    this.tooltipEl.innerHTML = `
      <span class="tooltip-kicker">${kicker}</span>
      <strong>${title}</strong>
      ${body ? `<p>${body}</p>` : ""}
    `;
    this.tooltipEl.hidden = false;
    this.positionTooltip(event);
  }

  positionTooltip(event) {
    if (!this.tooltipEl || this.tooltipEl.hidden || !this.stageEl) return;
    const rect = this.stageEl.getBoundingClientRect();
    let clientX = event.clientX;
    let clientY = event.clientY;
    if (clientX === undefined && event.currentTarget) {
      const targetRect = event.currentTarget.getBoundingClientRect();
      clientX = targetRect.left + targetRect.width / 2;
      clientY = targetRect.top;
    }
    const tipWidth = this.tooltipEl.offsetWidth || 220;
    const tipHeight = this.tooltipEl.offsetHeight || 82;
    let left = clientX - rect.left + 16;
    let top = clientY - rect.top - tipHeight - 12;

    if (left + tipWidth > rect.width - 14) {
      left = clientX - rect.left - tipWidth - 16;
    }
    if (left < 12) left = 12;
    if (top < 56) {
      top = clientY - rect.top + 18;
    }
    this.tooltipEl.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
  }

  hideTooltip() {
    if (this.tooltipEl) {
      this.tooltipEl.hidden = true;
    }
  }
}
