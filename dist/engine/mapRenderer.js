// 通用交互式 SVG 战役沙盘渲染引擎
// 支持多战役动态底图、历史轨迹叠加、阶段敌我动向、战术事件标记、
// 部队番号平滑过渡与自动防重叠布局

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

export class MapRenderer {
  constructor(stageEl) {
    this.stageEl = stageEl;
    this.svgEl = stageEl.querySelector(".battle-map");
    this.tooltipEl = stageEl.querySelector("#map-tooltip");
    this.battle = null;
    this.currentPhase = 0;
    this.forceFilter = "all";
    this.layers = {
      formations: true,
      enemy: true,
      labels: true
    };
    this.activeUnitMap = new Map();
    this.bindStageInteractions();
  }

  bindStageInteractions() {
    if (!this.stageEl) return;
    this.stageEl.addEventListener("mouseleave", () => this.hideTooltip());
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

    // 8. 渲染图例与筛选控件
    this.renderLegend(mapConfig);
    this.renderFilters(mapConfig);
    this.renderLayerToggles();
    this.applyLayerVisibility();
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

    // 高亮关键地理节点
    this.svgEl.querySelectorAll("#map-locations .location").forEach((locEl) => {
      const isKey = phase.keys.includes(locEl.getAttribute("data-place"));
      locEl.classList.toggle("is-key", isKey);
    });

    // 渲染本阶段战术事件标记
    this.renderMarkers(phase.markers || []);

    // 更新部队番号坐标与防重叠布局
    this.updateFormations();
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
