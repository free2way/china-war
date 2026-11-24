// 通用交互式战役沙盘渲染引擎（WebGL 真三维起伏地形 + 2D 矢量平面双模）
// 支持真实地貌高程起伏、贴地三维发光行军路线、3D 立体兵力棋子与动态行军图标、
// 自由 360° 旋转俯仰缩放、战术事件光柱与自动防重叠布局

import { Terrain3DEngine, getBattleEnvLabel } from "./terrain3d.js?v=7";

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

const DEFAULT_CAM_3D = { pitch: 38, yaw: -10, zoom: 1.08, panX: 0, panY: 14 };
const LOW_FLY_CAM_3D = { pitch: 24, yaw: -18, zoom: 1.28, panX: 0, panY: 22 };
const DEFAULT_CAM_2D = { pitch: 0, yaw: 0, zoom: 1.0, panX: 0, panY: 0 };

function inferUnitKind(unit, battle) {
  if (unit.kind) return unit.kind;
  const text = `${unit.label || ""} ${unit.sub || ""}`;
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
  if (battle.id === "market-garden-1944") return "armor";
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

    // WebGL 真三维起伏地形引擎与屏幕投影交互层
    this.terrain3d = new Terrain3DEngine(stageEl.querySelector("#terrain-3d-canvas"));
    this.glOverlayEl = stageEl.querySelector("#terrain-3d-overlay");
    this.glLandmarksEl = stageEl.querySelector("#gl-landmarks");
    this.glMoversEl = stageEl.querySelector("#gl-movers");
    this.glMarkersEl = stageEl.querySelector("#gl-markers");
    this.glUnitsEl = stageEl.querySelector("#gl-units");
    this.hudCompassNeedleEl = stageEl.querySelector("#hud-compass-needle");
    this.hudEnvBadgeEl = stageEl.querySelector("#hud-env-badge");
    this.stageEl.classList.toggle("has-webgl", this.terrain3d.ready);

    this.battle = null;
    this.currentPhase = 0;
    this.forceFilter = "all";
    this.layers = {
      formations: true,
      enemy: true,
      labels: true
    };
    this.activeUnitMap = new Map();

    // 3D 立体相机状态（默认开启 3D 立体起伏地形 + 纪录片分阶段运镜）
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
          this.cam.zoom = Math.min(1.85, +(this.cam.zoom + 0.16).toFixed(2));
          this.applyCamera();
        } else if (action === "zoom-out") {
          this.cam.zoom = Math.max(0.76, +(this.cam.zoom - 0.16).toFixed(2));
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
        } else if (action === "reset") {
          this.cam = this.viewMode === "3d" ? { ...DEFAULT_CAM_3D } : { ...DEFAULT_CAM_2D };
          this.applyCamera();
        } else if (action === "expand") {
          const section = this.stageEl.closest(".sandtable");
          if (section) {
            const expanded = section.classList.toggle("is-expanded");
            btn.classList.toggle("is-active", expanded);
            btn.setAttribute("aria-pressed", String(expanded));
            btn.textContent = expanded ? "⤡ 退出大屏" : "⛶ 大屏";
            // 布局展开后立即同步 WebGL 分辨率
            requestAnimationFrame(() => this.terrain3d.resize());
            setTimeout(() => this.terrain3d.resize(), 320);
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
        const step = e.deltaY > 0 ? -0.08 : 0.08;
        this.cam.zoom = Math.max(0.76, Math.min(1.65, +(this.cam.zoom + step).toFixed(2)));
        this.applyCamera({ immediate: true });
      },
      { passive: false }
    );
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
            ? "拖拽 360° 环绕山势 · Shift+拖拽平移 · 滚轮缩放"
            : "拖拽旋转沙盘 · 滚轮缩放"
          : "拖拽平移地图 · 滚轮缩放";
    }
    this.cam = this.viewMode === "3d" ? { ...DEFAULT_CAM_3D } : { ...DEFAULT_CAM_2D };
    this.applyCamera();
    if (this.terrain3d.ready) {
      if (this.viewMode === "3d") {
        this.terrain3d.resize();
        this.startGlLoop();
      } else {
        this.stopGlLoop();
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

  renderBattle(battle) {
    this.battle = battle;
    this.currentPhase = 0;
    this.forceFilter = "all";
    this.hideTooltip();

    if (!this.svgEl) return;

    const { mapConfig, theme, phases } = battle;
    this.svgEl.setAttribute("viewBox", mapConfig.viewBox || "0 0 880 720");

    const mapTitle = this.svgEl.querySelector("#map-title");
    const mapDesc = this.svgEl.querySelector("#map-desc");
    if (mapTitle) mapTitle.textContent = `${battle.title}战役态势示意图`;
    if (mapDesc) mapDesc.textContent = `${battle.subtitle || battle.title}，按阶段动态推演双方部署与机动路线。`;

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
          const kindMap = {
            capital: "战略中枢",
            fortress: "关隘要塞",
            ford: "渡口津要",
            bridge: "关键桥梁",
            beach: "登陆海滩",
            port: "战略港口",
            dropzone: "空降着陆区"
          };
          this.showTooltip(event, {
            kicker: kindMap[loc.kind] || "战役地标",
            title: loc.name,
            body: loc.sub || "战役关键地理节点"
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
            kicker: `${sideName} · 当前态势`,
            title: unit.label,
            body: unit.detail || unit.sub || "参战兵团"
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
      this.terrain3d.resize();
      this.buildGlLandmarks(mapConfig.locations || []);
      this.buildGlUnits(phases);
      if (this.hudEnvBadgeEl) {
        this.hudEnvBadgeEl.textContent = getBattleEnvLabel(battle.id);
      }
    }

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
            kicker: loc.kind === "capital" ? "战略中枢" : loc.kind === "fortress" ? "关隘要塞" : "关键渡口/桥梁",
            title: loc.name,
            body: loc.sub || "战役关键地理节点"
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
          kicker: `${sideName} · 立体兵力`,
          title: unit.label,
          body: unit.detail || unit.sub || "参战兵团"
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
      { key: "formations", label: "部队" },
      { key: "enemy", label: "动向" },
      { key: "labels", label: "地名" }
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

  setPhase(phaseIndex) {
    if (!this.battle || !this.svgEl) return;
    this.currentPhase = phaseIndex;
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

    // 同步 WebGL 真三维起伏地形的贴地路线、立体地标、棋子与动态行军徽标
    if (this.terrain3d.ready) {
      this.syncGlPhase(phase, phaseIndex);
      if (this.viewMode === "3d") {
        this.terrain3d.resize();
        this.startGlLoop();
      }
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
      glyph.textContent = m.glyph || MARKER_GLYPHS[type] || "战";
      g.append(glyph);

      const showMarkerInfo = (event) => {
        const typeMap = {
          fire: "奇袭火攻",
          turning: "战略转折",
          victory: "战役突破",
          airborne: "空降突击",
          amphibious: "两栖抢滩",
          bridge: "夺桥激战"
        };
        this.showTooltip(event, {
          kicker: typeMap[type] || "关键战事",
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
      const typeMap = {
        fire: "奇袭火攻",
        turning: "战略转折",
        victory: "战役突破",
        airborne: "空降突击",
        amphibious: "两栖抢滩",
        bridge: "夺桥激战"
      };
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
            <span class="marker-3d-orb">${m.glyph || MARKER_GLYPHS[type] || "战"}</span>
          </span>
        `;
        const showInfo = (event) => {
          this.showTooltip(event, {
            kicker: typeMap[type] || "关键战事",
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

    // 同步 WebGL 投影兵力棋子阵营筛选与目标坐标
    if (this.terrain3d.ready) {
      this.syncGlUnits(phase);
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
    locations.forEach((loc) => {
      const isMajor = loc.kind === "capital" || loc.kind === "fortress" || loc.kind === "ford";
      const el = document.createElement("button");
      el.type = "button";
      el.className = `gl-landmark ${loc.kind ? `gl-loc-${loc.kind}` : ""} ${isMajor ? "is-major" : ""}`;
      el.dataset.place = loc.name;
      el.setAttribute("aria-label", `${loc.name}${loc.sub ? `：${loc.sub}` : ""}`);
      el.innerHTML = `
        ${isMajor ? `<span class="gl-landmark-icon">${get3DLandmarkIconSvg(loc.kind)}</span>` : `<span class="gl-landmark-dot"></span>`}
        <span class="gl-landmark-name">${loc.name}</span>
      `;
      const showInfo = (event) => {
        this.showTooltip(event, {
          kicker: loc.kind === "capital" ? "战略中枢" : loc.kind === "fortress" ? "关隘要塞" : loc.kind === "ford" ? "关键渡口/桥梁" : "战役地标",
          title: loc.name,
          body: loc.sub || "战役关键地理节点"
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
          kicker: `${sideName} · 三维兵力`,
          title: unit.label,
          body: unit.detail || unit.sub || "参战兵团"
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

  syncGlUnits(phase) {
    if (!this.glUnitsEl || !phase) return;
    const activeMap = new Map(phase.formations.map((u) => [u.id, u]));
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
      item.tx = unit.x;
      item.ty = unit.y;
      if (!item.initialized) {
        item.x = unit.x;
        item.y = unit.y;
        item.initialized = true;
      }
      item.el.style.opacity = "1";
      item.el.style.pointerEvents = "auto";
      item.el.className = `gl-unit side-${unit.side} kind-${kind}`;
      item.el.classList.toggle("is-muted", this.forceFilter !== "all" && this.forceFilter !== unit.side);
      item.el.setAttribute("aria-label", `${unit.label}${unit.sub ? `：${unit.sub}` : ""}`);
      const badge = item.el.querySelector(".gl-unit-badge");
      if (badge && badge.dataset.kind !== kind) {
        badge.dataset.kind = kind;
        badge.innerHTML = get3DUnitIconSvg(kind);
      }
      item.el.querySelector(".gl-unit-label").textContent = unit.label;
      item.el.querySelector(".gl-unit-sub").textContent = unit.sub || "";
    });
  }

  syncGlPhase(phase, phaseIndex) {
    if (!this.terrain3d.ready || !this.battle) return;
    const theme = this.battle.theme || {};

    // 1. 更新关键地标高亮
    this.glLandmarks.forEach(({ el, loc }) => {
      el.classList.toggle("is-key", (phase.keys || []).includes(loc.name));
    });

    // 2. 采样路线并构建贴合山势的 WebGL 三维带箭头态势大箭头（支持渐进生长）
    this.phaseStartTime = performance.now();
    const routeSpecs = [];
    this.svgEl.querySelectorAll("#map-routes .route").forEach((pathEl) => {
      const idx = Number(pathEl.getAttribute("data-phase-route"));
      if (idx > phaseIndex) return;
      const pts = this.sampleSvgPath(pathEl, 88);
      if (pts.length < 2) return;
      const isCurrent = idx === phaseIndex;
      routeSpecs.push({
        points: pts,
        color: theme.accentBright || theme.accent || "#e2513f",
        width: isCurrent ? 0.025 : 0.011,
        hover: isCurrent ? 0.024 : 0.013,
        alpha: isCurrent ? 0.96 : 0.28,
        dashScale: isCurrent ? 6.5 : 3.5,
        speed: isCurrent ? 1.55 : 0.0,
        arrow: isCurrent,
        animateDraw: isCurrent,
        side: "red"
      });
    });

    const futurePath = this.svgEl.querySelector("#map-routes .route-future.is-active");
    if (futurePath) {
      const pts = this.sampleSvgPath(futurePath, 48);
      if (pts.length >= 2) {
        routeSpecs.push({
          points: pts,
          color: theme.gold || theme.accent || "#d6b56a",
          width: 0.014,
          hover: 0.015,
          alpha: 0.62,
          dashScale: 9.0,
          speed: 0.9,
          arrow: true,
          animateDraw: true,
          side: "red"
        });
      }
    }

    this.svgEl.querySelectorAll("#map-enemy-routes .enemy-route-path").forEach((pathEl) => {
      const pts = this.sampleSvgPath(pathEl, 52);
      if (pts.length < 2) return;
      routeSpecs.push({
        points: pts,
        color: theme.opposing || "#8aa2aa",
        width: 0.015,
        hover: 0.017,
        alpha: 0.76,
        dashScale: 7.5,
        speed: 1.15,
        arrow: true,
        animateDraw: true,
        side: "blue"
      });
    });

    this.terrain3d.setRoutes(routeSpecs);

    // 2.5 贴地三维包围圈 / 激战阵地光环 + 战火与飘雪粒子
    const rings = (phase.markers || []).map((m) => ({
      x: m.x,
      y: m.y,
      radius: m.type === "fire" ? 36 : 30,
      width: 0.012,
      color: m.type === "fire" ? "#ff8a3d" : m.type === "victory" || m.type === "turning" ? theme.gold || "#e0ac4f" : theme.accentBright || "#e2513f",
      alpha: 0.78
    }));
    this.terrain3d.setRings(rings);
    this.terrain3d.setParticles(phase.markers || []);

    // 2.6 纪录片风格分阶段电影运镜自动聚焦当前核心战区
    if (this.autoCamera && this.viewMode === "3d") {
      this.focusCameraOnPhase(phase, phaseIndex);
    }

    // 3. 构建贴地 3D 战事光柱徽章
    if (this.glMarkersEl) {
      this.glMarkersEl.innerHTML = "";
      this.glMarkers = [];
      const typeMap = {
        fire: "奇袭火攻",
        turning: "战略转折",
        victory: "战役突破",
        airborne: "空降突击",
        amphibious: "两栖抢滩",
        bridge: "夺桥激战"
      };
      (phase.markers || []).forEach((m) => {
        const type = m.type || "clash";
        const el = document.createElement("button");
        el.type = "button";
        el.className = `gl-marker marker-${type}`;
        el.setAttribute("aria-label", `${m.label}${m.desc ? `：${m.desc}` : ""}`);
        el.innerHTML = `
          <span class="gl-marker-orb">${m.glyph || MARKER_GLYPHS[type] || "战"}</span>
          <span class="gl-marker-beam"></span>
          <span class="gl-marker-ring"></span>
        `;
        const showInfo = (event) => {
          this.showTooltip(event, {
            kicker: typeMap[type] || "关键战事",
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

    // 4. 构建沿三维起伏路线行进的 3D 动态图标
    if (this.glMoversEl) {
      this.glMoversEl.innerHTML = "";
      this.glMovers = [];
      const primaryKind = inferBattleRouteKind(this.battle);
      const activeRoute = this.svgEl.querySelector("#map-routes .route.is-active");
      if (activeRoute && typeof activeRoute.getTotalLength === "function") {
        const len = activeRoute.getTotalLength();
        if (len > 20) {
          const count = len > 420 ? 3 : 2;
          for (let i = 0; i < count; i++) {
            const el = document.createElement("div");
            el.className = "gl-mover side-red";
            el.innerHTML = `<span class="gl-mover-badge">${get3DUnitIconSvg(primaryKind)}</span>`;
            this.glMoversEl.append(el);
            this.glMovers.push({ el, path: activeRoute, len, offset: i / count, speed: 0.115, side: "red" });
          }
        }
      }
      this.svgEl.querySelectorAll("#map-enemy-routes .enemy-route-path").forEach((path, idx) => {
        if (typeof path.getTotalLength !== "function") return;
        const len = path.getTotalLength();
        if (len < 24) return;
        const el = document.createElement("div");
        el.className = "gl-mover side-blue";
        el.innerHTML = `<span class="gl-mover-dot"></span>`;
        this.glMoversEl.append(el);
        this.glMovers.push({ el, path, len, offset: (idx * 0.31) % 1, speed: 0.14, side: "blue" });
      });
    }

    this.syncGlUnits(phase);
  }

  // 根据当前阶段的关键交战点与地标计算电影运镜聚焦参数
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
    const zoom = Math.max(1.02, Math.min(1.22, 1.28 - span * 0.00048));
    // 轻微旋转不同阶段视角，带来纪录片运镜质感
    const yawOffset = [-11, 10, -14, 8][phaseIndex % 4] || -10;
    const pitch = span < 220 ? 34 : 38;
    const panX = Math.max(-165, Math.min(165, (440 - cx) * 0.52));
    const panY = Math.max(-165, Math.min(165, (360 - cy) * 0.55 + 10));

    this.cam = { pitch, yaw: yawOffset, zoom: +zoom.toFixed(2), panX: Math.round(panX), panY: Math.round(panY) };
  }

  stopGlLoop() {
    if (this.glRaf) {
      cancelAnimationFrame(this.glRaf);
      this.glRaf = null;
    }
  }

  startGlLoop() {
    if (!this.terrain3d.ready || this.viewMode !== "3d") return;
    if (this.glRaf) return;

    const tick = (now) => {
      if (this.viewMode !== "3d") {
        this.glRaf = null;
        return;
      }
      const elapsed = (now - this.glStartTime) / 1000;
      const phaseElapsed = (now - this.phaseStartTime) / 1000;

      // 平滑相机阻尼插值（电影运镜丝滑推拉）
      const lerp = this.dragState ? 0.45 : 0.09;
      this.glCam.pitch += (this.cam.pitch - this.glCam.pitch) * lerp;
      this.glCam.yaw += (this.cam.yaw - this.glCam.yaw) * lerp;
      this.glCam.zoom += (this.cam.zoom - this.glCam.zoom) * lerp;
      this.glCam.panX += (this.cam.panX - this.glCam.panX) * lerp;
      this.glCam.panY += (this.cam.panY - this.glCam.panY) * lerp;

      if (this.hudCompassNeedleEl) {
        this.hudCompassNeedleEl.style.transform = `rotate(${this.glCam.yaw.toFixed(1)}deg)`;
      }

      this.terrain3d.updateCamera(this.glCam);
      this.terrain3d.render(elapsed, { showEnemy: this.layers.enemy, phaseElapsed });

      // 投影地标到三维地形表面
      for (const { el, loc } of this.glLandmarks) {
        const p = this.terrain3d.project(loc.x, loc.y, 0.008);
        el.style.transform = `translate3d(${p.sx.toFixed(1)}px, ${p.sy.toFixed(1)}px, 0)`;
        el.style.zIndex = String(Math.round((1 - p.depth) * 1000));
        el.style.visibility = p.visible ? "visible" : "hidden";
      }

      // 投影战事光柱徽章并记录坐标用于兵牌避让
      const markerObstacles = [];
      for (const { el, marker } of this.glMarkers) {
        const p = this.terrain3d.project(marker.x, marker.y, 0.016);
        el.style.transform = `translate3d(${p.sx.toFixed(1)}px, ${p.sy.toFixed(1)}px, 0)`;
        el.style.zIndex = String(Math.round((1 - p.depth) * 1000) + 140);
        el.style.visibility = p.visible ? "visible" : "hidden";
        if (p.visible) markerObstacles.push({ x: p.sx, y: p.sy - 26 });
      }

      // 投影并平滑移动 3D 兵力棋子，并避让同类标牌与战事光柱
      const projectedUnits = [];
      this.glUnits.forEach((u) => {
        if (!u.active) return;
        u.x += (u.tx - u.x) * 0.14;
        u.y += (u.ty - u.y) * 0.14;
        const p = this.terrain3d.project(u.x, u.y, 0.012);
        projectedUnits.push({ u, p, ox: 0, oy: 0 });
      });

      const boxW = 108;
      const boxH = 31;
      for (let iter = 0; iter < 4; iter++) {
        // 先让兵牌避让战事光柱（火/战/胜）
        for (const a of projectedUnits) {
          if (!a.p.visible) continue;
          for (const obs of markerObstacles) {
            const dx = a.p.sx + a.ox - obs.x;
            const dy = a.p.sy - 24 + a.oy - obs.y;
            if (Math.abs(dx) < 68 && Math.abs(dy) < 34) {
              const dirX = dx === 0 ? 1 : Math.sign(dx);
              const dirY = dy === 0 ? 1 : Math.sign(dy);
              a.ox = Math.max(-58, Math.min(58, a.ox + dirX * (68 - Math.abs(dx)) * 0.45));
              a.oy = Math.max(-48, Math.min(48, a.oy + dirY * (34 - Math.abs(dy)) * 0.35));
            }
          }
        }
        // 再做兵牌之间互相排斥
        for (let i = 0; i < projectedUnits.length; i++) {
          const a = projectedUnits[i];
          if (!a.p.visible) continue;
          for (let j = i + 1; j < projectedUnits.length; j++) {
            const b = projectedUnits[j];
            if (!b.p.visible) continue;
            const dx = a.p.sx + a.ox - (b.p.sx + b.ox);
            const dy = a.p.sy + a.oy - (b.p.sy + b.oy);
            if (Math.abs(dx) < boxW && Math.abs(dy) < boxH) {
              const pushY = (boxH - Math.abs(dy)) * 0.44;
              const dirY = dy === 0 ? (i % 2 === 0 ? -1 : 1) : Math.sign(dy);
              a.oy = Math.max(-52, Math.min(52, a.oy + dirY * pushY));
              b.oy = Math.max(-52, Math.min(52, b.oy - dirY * pushY));
              const pushX = (boxW - Math.abs(dx)) * 0.16;
              const dirX = dx === 0 ? (i % 2 === 0 ? -1 : 1) : Math.sign(dx);
              a.ox = Math.max(-56, Math.min(56, a.ox + dirX * pushX));
              b.ox = Math.max(-56, Math.min(56, b.ox - dirX * pushX));
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

      // 投影沿三维山势起伏路线的 3D 动态行军图标
      if (!this.prefersReducedMotion) {
        for (const m of this.glMovers) {
          if (m.side === "blue" && !this.layers.enemy) {
            m.el.style.visibility = "hidden";
            continue;
          }
          const t = (elapsed * m.speed + m.offset) % 1;
          const pt = m.path.getPointAtLength(t * m.len);
          const p = this.terrain3d.project(pt.x, pt.y, m.side === "red" ? 0.042 : 0.032);
          const edgeFade = t < 0.08 ? t / 0.08 : t > 0.92 ? (1 - t) / 0.08 : 1;
          m.el.style.transform = `translate3d(${p.sx.toFixed(1)}px, ${p.sy.toFixed(1)}px, 0)`;
          m.el.style.opacity = String(edgeFade.toFixed(2));
          m.el.style.zIndex = String(Math.round((1 - p.depth) * 1000) + 90);
          m.el.style.visibility = p.visible ? "visible" : "hidden";
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
