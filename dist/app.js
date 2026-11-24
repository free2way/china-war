// 战史沙盘 · 应用入口
// 负责路由（档案馆 / 战役沙盘）、主题切换与各章节渲染；地图交互交由 MapRenderer。

import { battleRegistry, loadBattle, getBattleEntry } from "./data/battles.js?v=7";
import { normalizeBattle } from "./engine/schema.js?v=7";
import { MapRenderer } from "./engine/mapRenderer.js?v=7";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const pad = (n) => String(n).padStart(2, "0");
const TOUR_INTERVAL = 4200;

const state = {
  battleId: null,
  battle: null,
  phase: 0,
  orderSide: "red",
  eraFilter: "all",
  tourTimer: null
};

let mapRenderer = null;
let revealObserver = null;

/* ---------------- 主题 ---------------- */

const THEME_VARS = {
  accent: "--accent",
  accentBright: "--accent-bright",
  accentDark: "--accent-dark",
  accentSoft: "--accent-soft",
  opposing: "--opposing",
  opposingSoft: "--opposing-soft",
  gold: "--gold",
  riverKey: "--river-key",
  stageBg: "--stage-bg",
  stageBgAlt: "--stage-bg-alt",
  stageGlow: "--stage-glow",
  paper: "--paper",
  paperLight: "--paper-light",
  paperMuted: "--paper-muted",
  ink: "--ink",
  muted: "--muted",
  closingBg: "--closing-bg"
};

function applyTheme(theme) {
  const root = document.documentElement;
  Object.entries(THEME_VARS).forEach(([key, cssVar]) => {
    if (theme && theme[key]) root.style.setProperty(cssVar, theme[key]);
    else root.style.removeProperty(cssVar);
  });
  document.body.dataset.theme = theme?.id || "";
  const metaTheme = $('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute("content", theme?.stageBg || "#121512");
}

/* ---------------- 菜单与档案馆 ---------------- */

function renderBattleMenu() {
  const menu = $("#battle-menu");
  menu.innerHTML = `
    <header><span>战役档案 · ARCHIVES</span><a href="./" data-nav-home>档案馆总览</a></header>
    <div class="battle-menu-list">
      ${battleRegistry
        .map((item, i) => {
          const available = item.status === "available";
          const current = item.id === state.battleId;
          return `
          <button class="battle-option ${current ? "is-current" : ""} ${available ? "" : "is-planned"}"
                  type="button" role="menuitem" data-battle-id="${item.id}" ${available ? "" : "disabled"}
                  style="--item-accent:${item.accent}">
            <span class="option-seal">${item.seal}</span>
            <span class="option-info">
              <strong>${item.name}</strong>
              <small>${item.periodLabel} · ${item.theater}</small>
            </span>
            <span class="option-badge">${current ? "当前" : available ? pad(i + 1) : "筹备中"}</span>
          </button>`;
        })
        .join("")}
    </div>`;

  $$(".battle-option:not(.is-planned)", menu).forEach((btn) =>
    btn.addEventListener("click", () => {
      closeMenu();
      navigate(btn.dataset.battleId);
    })
  );
  bindHomeLinks(menu);
}

function renderArchive() {
  const grid = $("#archive-grid");
  const filtered = battleRegistry.filter((b) => {
    if (state.eraFilter === "all") return true;
    if (state.eraFilter === "china" || state.eraFilter === "world") return b.region === state.eraFilter;
    return b.category === state.eraFilter;
  });

  grid.innerHTML = filtered
    .map((item) => {
      const idx = battleRegistry.findIndex((b) => b.id === item.id);
      const available = item.status === "available";
      return `
      <article class="archive-card ${available ? "" : "is-planned"}" style="--item-accent:${item.accent}">
        <button type="button" class="archive-card-hit" data-battle-id="${item.id}" ${available ? "" : "disabled"}
                aria-label="${available ? "进入" : "筹备中："}${item.name}沙盘"></button>
        <div class="card-top">
          <span class="card-no">档案 ${pad(idx + 1)} · ${item.regionLabel || "战史"}</span>
          <span class="card-status">${available ? "可推演" : "筹备中"}</span>
        </div>
        <div class="card-seal" aria-hidden="true">${item.seal}</div>
        <div class="card-body">
          <small>${item.era}${item.codename ? ` · ${item.codename}` : ""}</small>
          <h3>${item.name}</h3>
          <p>${item.summary}</p>
        </div>
        <dl class="card-meta">
          <div><dt>时间</dt><dd>${item.periodLabel}</dd></div>
          <div><dt>战场</dt><dd>${item.theater}</dd></div>
          <div><dt>对阵</dt><dd>${item.opponents}</dd></div>
        </dl>
        <div class="card-cta">${available ? "进入沙盘 →" : "敬请期待"}</div>
      </article>`;
    })
    .join("");

  $$(".archive-card-hit:not([disabled])", grid).forEach((btn) =>
    btn.addEventListener("click", () => navigate(btn.dataset.battleId))
  );

  const available = battleRegistry.filter((b) => b.status === "available").length;
  const chinaCount = battleRegistry.filter((b) => b.status === "available" && b.region === "china").length;
  const worldCount = battleRegistry.filter((b) => b.status === "available" && b.region === "world").length;
  $("#home-stats").innerHTML = `
    <div><strong>${pad(available)}</strong><span>可推演战役</span></div>
    <div><strong>${pad(chinaCount)} / ${pad(worldCount)}</strong><span>中国战史 / 世界战史</span></div>
    <div><strong>${battleRegistry.length ? `${Math.min(...battleRegistry.map((b) => +b.period))}—${Math.max(...battleRegistry.map((b) => +b.period))}` : "—"}</strong><span>时间跨度（年）</span></div>`;
}

function openMenu() {
  $("#battle-menu").hidden = false;
  $("#battle-switcher").setAttribute("aria-expanded", "true");
}
function closeMenu() {
  $("#battle-menu").hidden = true;
  $("#battle-switcher").setAttribute("aria-expanded", "false");
}

function bindHomeLinks(root = document) {
  $$("[data-nav-home]", root).forEach((link) => {
    if (link.dataset.bound) return;
    link.dataset.bound = "1";
    link.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenu();
      navigate(null);
    });
  });
}

/* ---------------- 路由 ---------------- */

function navigate(battleId) {
  const url = new URL(window.location.href);
  url.hash = "";
  if (battleId) url.searchParams.set("battle", battleId);
  else url.searchParams.delete("battle");
  window.history.pushState({ battle: battleId }, "", url.toString());
  route({ scrollTop: true });
}

async function route(options = {}) {
  const id = new URLSearchParams(window.location.search).get("battle");
  const entry = id ? getBattleEntry(id) : null;
  if (entry && entry.status === "available") {
    await showBattle(id);
  } else {
    showHome();
  }
  if (options.scrollTop) window.scrollTo(0, 0);
}

function showHome() {
  stopTour();
  mapRenderer?.stopRouteMovers();
  state.battleId = null;
  state.battle = null;
  applyTheme(null);
  document.body.dataset.view = "home";
  $("#view-home").hidden = false;
  $("#view-battle").hidden = true;
  document.title = "战史沙盘｜世界历史著名战役交互推演";
  $("#switcher-seal").textContent = "史";
  $("#switcher-kicker").textContent = "战役档案";
  $("#switcher-name").textContent = "选择战役";
  $("#footer-title").textContent = "战史沙盘";
  $("#footer-sources").innerHTML = "";
  renderBattleMenu();
  setupReveal();
}

async function showBattle(id) {
  stopTour();
  if (state.battleId === id && state.battle) {
    document.body.dataset.view = "battle";
    return;
  }

  document.body.classList.add("is-loading");
  let battle;
  try {
    battle = normalizeBattle(await loadBattle(id));
  } catch (err) {
    console.error("加载战役失败:", err);
    document.body.classList.remove("is-loading");
    showHome();
    return;
  }

  state.battleId = id;
  state.battle = battle;
  state.phase = 0;
  state.orderSide = "red";

  applyTheme(battle.theme);
  document.body.dataset.view = "battle";
  $("#view-home").hidden = true;
  $("#view-battle").hidden = false;

  document.title = `${battle.title}｜战史沙盘`;
  $('meta[name="description"]')?.setAttribute(
    "content",
    `${battle.title}交互战役沙盘：${battle.subtitle}。按阶段推演双方部署、机动路线与制胜逻辑。`
  );

  const index = battleRegistry.findIndex((b) => b.id === id);
  $("#switcher-seal").textContent = battle.seal;
  $("#switcher-kicker").textContent = `战役档案 ${pad(index + 1)}`;
  $("#switcher-name").textContent = battle.title;

  renderHero(battle);
  mapRenderer.renderBattle(battle);
  $("#map-scale").textContent = battle.mapConfig.scaleNote || "";
  renderPhaseControls(battle);
  renderCommanders(battle);
  renderOrder(battle);
  renderSituation(battle);
  renderLogic(battle);
  renderChronicle(battle);
  renderClosing(battle);
  renderFooter(battle);
  renderBattleMenu();

  setPhase(0);
  setupReveal();
  requestAnimationFrame(() => document.body.classList.remove("is-loading"));
}

/* ---------------- 章节渲染 ---------------- */

function renderHero(battle) {
  const meta = battle.meta || {};
  $("#hero-eyebrow").innerHTML = (meta.eyebrow || [battle.era, battle.period])
    .map((t) => `<span>${t}</span>`)
    .join("");
  const [a, b] = meta.heroTitle || [battle.title, ""];
  $("#hero-title").innerHTML = `<span>${a}</span><span class="accent">${b}</span>`;
  $("#hero-deck").textContent = meta.deck || battle.subtitle || "";
  $("#hero-facts").innerHTML = (meta.facts || [])
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
    .join("");
}

function renderPhaseControls(battle) {
  const container = $(".phase-buttons");
  container.style.setProperty("--phase-count", battle.phases.length);
  container.innerHTML = battle.phases
    .map(
      (p, i) => `
      <button class="phase-button" type="button" role="tab" aria-selected="false" data-phase="${i}">
        <span class="phase-no">${pad(i + 1)}</span>
        <strong>${p.short}</strong>
        <small>${p.tag}</small>
      </button>`
    )
    .join("");
  $$(".phase-button", container).forEach((btn) =>
    btn.addEventListener("click", () => {
      stopTour();
      setPhase(Number(btn.dataset.phase));
    })
  );
  $("#brief-total").textContent = `/ ${pad(battle.phases.length)}`;
}

function renderBrief(phase, index) {
  $("#brief-number").textContent = pad(index + 1);
  $("#brief-name").textContent = phase.name;
  $("#brief-date").textContent = phase.date;
  $("#brief-intent").textContent = phase.intent;
  $("#brief-goal").textContent = phase.goal;
  $("#brief-result").textContent = phase.result;
  const fNum = $("#float-brief-num");
  if (fNum) {
    fNum.textContent = pad(index + 1);
    $("#float-brief-name").textContent = phase.name;
    $("#float-brief-date").textContent = phase.date;
    $("#float-brief-goal").textContent = phase.goal;
  }
  const brief = $(".battle-brief");
  brief.classList.remove("is-swapping");
  void brief.offsetWidth;
  brief.classList.add("is-swapping");
}

function renderCommanders(battle) {
  const c = battle.commanders;
  $("#red-commanders-title").textContent = c.redLabel;
  $("#red-commanders-sub").textContent = c.redSub;
  $("#blue-commanders-title").textContent = c.blueLabel;
  $("#blue-commanders-sub").textContent = c.blueSub;
  const row = (p) => `<div class="commander-row"><strong>${p.name}</strong><span>${p.role}</span></div>`;
  $("#red-commanders").innerHTML = c.red.map(row).join("");
  $("#blue-commanders").innerHTML = c.blue.map(row).join("");
}

function renderOrder(battle) {
  const side = state.orderSide;
  const fs = battle.mapConfig.filterSides;
  $('[data-order-side="red"]').textContent = `${fs.red}序列`;
  $('[data-order-side="blue"]').textContent = `${fs.blue}序列`;
  $("#order-table").innerHTML = (battle.orderOfBattle[side] || [])
    .map(([unit, cmd, role]) => `<div class="order-row"><strong>${unit}</strong><b>${cmd}</b><span>${role}</span></div>`)
    .join("");
  $("#order-table").dataset.side = side;
  $$("[data-order-side]").forEach((btn) => {
    const active = btn.dataset.orderSide === side;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-selected", String(active));
  });
}

function renderDossier(battle, index) {
  const phase = battle.phases[index];
  $("#dossier-title").textContent = `${phase.name} · ${phase.date}`;
  $("#dossier-list").innerHTML = phase.detail
    .map(([d, t, c]) => `<div class="dossier-row"><time>${d}</time><strong>${t}</strong><span>${c}</span></div>`)
    .join("");
  const tabs = $(".dossier-tabs");
  tabs.innerHTML = battle.phases
    .map(
      (p, i) =>
        `<button type="button" role="tab" class="${i === index ? "is-active" : ""}" aria-selected="${i === index}" data-dossier-phase="${i}" title="${p.name}">${pad(i + 1)}</button>`
    )
    .join("");
  $$("[data-dossier-phase]", tabs).forEach((btn) =>
    btn.addEventListener("click", () => {
      stopTour();
      setPhase(Number(btn.dataset.dossierPhase));
    })
  );
}

function renderSituation(battle) {
  const s = battle.situation || {};
  $("#situation-eyebrow").textContent = s.eyebrow || "";
  $("#situation-title").innerHTML = s.title || "";
  $("#situation-narrative").textContent = s.narrative || "";

  const fc = s.forceComparison;
  const fill = (el, d) => {
    if (!el || !d) return;
    $(".force-label span", el).textContent = d.label;
    $(".force-label strong", el).textContent = d.count;
    $(".force-bar span", el).style.setProperty("--width", d.width || "50%");
    $("p", el).textContent = d.desc;
  };
  fill($(".force-red"), fc?.red);
  fill($(".force-blue"), fc?.blue);
  $("#force-note").textContent = fc?.note || "";

  const dep = (el, d) => {
    if (!el || !d) return;
    $("header span", el).textContent = d.title;
    $("header small", el).textContent = d.subtitle;
    $("ul", el).innerHTML = d.items.map(([k, v]) => `<li><b>${k}</b><span>${v}</span></li>`).join("");
  };
  dep($("#deploy-red"), s.deployments?.red);
  dep($("#deploy-blue"), s.deployments?.blue);
}

function renderLogic(battle) {
  const l = battle.logic || {};
  const labelEl = $("#logic-section-label");
  if (labelEl) labelEl.textContent = l.sectionLabel || "胜负逻辑";
  $("#logic-eyebrow").textContent = l.eyebrow || "";
  $("#logic-title").innerHTML = l.title || "";
  $("#logic-stage").innerHTML = (l.steps || [])
    .map(
      (s) => `
      <article class="logic-step">
        <span class="logic-no">${s.roman}</span>
        <div><h3>${s.title}</h3><p>${s.desc}</p></div>
        <strong class="logic-key">${s.keyword}</strong>
      </article>`
    )
    .join("");
  const loop = l.decisionLoop || {};
  $("#loop-eyebrow").textContent = loop.eyebrow || "";
  $("#loop-title").innerHTML = loop.title || "";
  $("#loop-items").innerHTML = (loop.items || [])
    .map(([n, t, s]) => `<li><span>${n}</span><b>${t}</b><small>${s}</small></li>`)
    .join("");
}

function renderChronicle(battle) {
  const c = battle.chronicle || {};
  $("#chronicle-eyebrow").textContent = c.eyebrow || "";
  $("#chronicle-title").innerHTML = c.title || "";
  $("#chronicle-deck").textContent = c.deck || "";
  $("#timeline-list").innerHTML = (c.events || [])
    .map((ev) => {
      const inner = `
        <time>${ev.date}</time><span class="event-dot"></span>
        <div class="event-body"><small>${ev.stage}</small><h3>${ev.title}</h3><p>${ev.desc}</p></div>
        <span class="event-tag">${ev.tag}</span>`;
      return ev.isOutcome
        ? `<div class="timeline-event timeline-outcome">${inner}</div>`
        : `<button class="timeline-event" type="button" data-phase="${ev.phaseIndex}">${inner}</button>`;
    })
    .join("");
  $$("#timeline-list button[data-phase]").forEach((btn) =>
    btn.addEventListener("click", () => {
      stopTour();
      setPhase(Number(btn.dataset.phase));
      $("#sandtable").scrollIntoView({ behavior: "smooth" });
    })
  );
}

function renderClosing(battle) {
  const m = battle.meta || {};
  $("#closing-mark").textContent = m.quoteMark || battle.seal;
  $("#closing-quote").textContent = m.quote || "";
  $("#closing-author").textContent = m.quoteAuthor ? `—— ${m.quoteAuthor}` : "";
  $("#closing-desc").textContent = m.quoteDesc || "";
}

function renderFooter(battle) {
  $("#footer-title").textContent = `${battle.title} · 战史沙盘`;
  $("#footer-sources").innerHTML =
    `<span>主要史料与参考</span>` +
    battle.sources.map((s) => `<a href="${s.url}" target="_blank" rel="noreferrer">${s.title}</a>`).join("");
}

/* ---------------- 阶段与推演 ---------------- */

function setPhase(index) {
  const battle = state.battle;
  if (!battle) return;
  const total = battle.phases.length;
  state.phase = Math.max(0, Math.min(total - 1, Number(index)));
  const phase = battle.phases[state.phase];

  renderBrief(phase, state.phase);
  mapRenderer.setPhase(state.phase);
  renderDossier(battle, state.phase);

  $("#phase-progress-bar").style.width = `${((state.phase + 1) / total) * 100}%`;
  $$(".phase-button").forEach((btn, i) => {
    btn.classList.toggle("is-active", i === state.phase);
    btn.classList.toggle("is-done", i < state.phase);
    btn.setAttribute("aria-selected", String(i === state.phase));
  });
  $("#phase-prev").disabled = state.phase === 0;
  $("#phase-next").disabled = state.phase === total - 1;
}

function stopTour() {
  if (state.tourTimer) {
    clearInterval(state.tourTimer);
    state.tourTimer = null;
  }
  const btn = $("#play-tour");
  btn.classList.remove("is-playing");
  $(".play-label", btn).textContent = "自动推演";
}

function startTour() {
  if (!state.battle) return;
  const total = state.battle.phases.length;
  if (state.phase >= total - 1) setPhase(0);
  const btn = $("#play-tour");
  btn.classList.add("is-playing");
  $(".play-label", btn).textContent = "暂停推演";
  state.tourTimer = setInterval(() => {
    if (state.phase >= total - 1) return stopTour();
    setPhase(state.phase + 1);
  }, TOUR_INTERVAL);
}

/* ---------------- 全局事件 ---------------- */

function setupGlobalEvents() {
  $("#play-tour").addEventListener("click", () => (state.tourTimer ? stopTour() : startTour()));
  $("#phase-prev").addEventListener("click", () => {
    stopTour();
    setPhase(state.phase - 1);
  });
  $("#phase-next").addEventListener("click", () => {
    stopTour();
    setPhase(state.phase + 1);
  });

  $("#battle-switcher").addEventListener("click", (e) => {
    e.stopPropagation();
    $("#battle-menu").hidden ? openMenu() : closeMenu();
  });
  document.addEventListener("click", (e) => {
    const menu = $("#battle-menu");
    if (!menu.hidden && !menu.contains(e.target) && !e.target.closest("#battle-switcher")) closeMenu();
  });

  $$("[data-order-side]").forEach((btn) =>
    btn.addEventListener("click", () => {
      state.orderSide = btn.dataset.orderSide;
      if (state.battle) renderOrder(state.battle);
    })
  );

  $$("[data-era-filter]").forEach((btn) =>
    btn.addEventListener("click", () => {
      state.eraFilter = btn.dataset.eraFilter;
      $$("[data-era-filter]").forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });
      renderArchive();
      setupReveal();
    })
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
    if (!state.battle || e.target.closest("input, textarea")) return;
    if (e.key === "ArrowRight") {
      stopTour();
      setPhase(state.phase + 1);
    } else if (e.key === "ArrowLeft") {
      stopTour();
      setPhase(state.phase - 1);
    } else if (e.key === " " && e.target === document.body) {
      e.preventDefault();
      state.tourTimer ? stopTour() : startTour();
    }
  });

  window.addEventListener("popstate", () => route());

  const header = $(".site-header");
  const navLinks = $$(".nav-links a");
  const sectionIds = ["sandtable", "command", "situation", "logic", "chronicle"];

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
    if (state.battle) {
      let currentId = sectionIds[0];
      const probe = window.scrollY + 180;
      for (const id of sectionIds) {
        const sec = document.getElementById(id);
        if (sec && sec.offsetTop <= probe) currentId = id;
      }
      navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${currentId}`));
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  bindHomeLinks();
}

function setupReveal() {
  revealObserver?.disconnect();
  const items = $$(
    ".archive-card, .commander-side, .order-layout, .phase-dossier, .force-line, .deployment, .logic-step, .decision-loop, .timeline-event"
  ).filter((el) => !el.closest("[hidden]"));

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      }),
    { threshold: 0.02, rootMargin: "0px 0px 80px 0px" }
  );

  const vh = window.innerHeight || 900;
  items.forEach((el) => {
    el.classList.add("reveal-item");
    const rect = el.getBoundingClientRect();
    if (rect.top < vh + 60) {
      el.classList.add("is-visible");
    } else {
      el.classList.remove("is-visible");
      revealObserver.observe(el);
    }
  });
}

/* ---------------- 启动 ---------------- */

function init() {
  mapRenderer = new MapRenderer($("#map-stage"));
  renderArchive();
  setupGlobalEvents();
  route();
}

init();
