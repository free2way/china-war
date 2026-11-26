// 战史沙盘 · 应用入口
// 负责路由（档案馆 / 战役沙盘）、主题切换与各章节渲染；地图交互交由 MapRenderer。

import { battleRegistry, loadBattle, loadBattleEnOverlay, getBattleEntry } from "./data/battles.js?v=13";
import { normalizeBattle } from "./engine/schema.js?v=13";
import { MapRenderer } from "./engine/mapRenderer.js?v=15";
import { getLang, setLang, isEn, t, getLocalizedEntry, applyBattleOverlay } from "./engine/i18n.js?v=4";

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

function applyStaticI18n() {
  const lang = getLang();
  document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  $("#brand-title").textContent = t("siteTitle");
  const sealEl = $("#brand-seal");
  if (sealEl) sealEl.textContent = t("siteSeal");
  $$("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  $$("[data-i18n-title]").forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });
  const homeTitle = $("#home-title");
  if (homeTitle) homeTitle.innerHTML = t("homeTitleHtml");
  const cmdTitle = $("#command-title");
  if (cmdTitle) cmdTitle.innerHTML = t("sec01TitleHtml");
  const compassSvg = $("#compass-n-svg");
  if (compassSvg) compassSvg.textContent = t("compassNorth");
  const playLabel = $("#play-tour .play-label");
  if (playLabel) playLabel.textContent = state.tourTimer ? t("pauseTour") : t("playTour");
  const prevBtn = $("#phase-prev");
  const nextBtn = $("#phase-next");
  if (prevBtn) prevBtn.setAttribute("aria-label", t("phasePrev"));
  if (nextBtn) nextBtn.setAttribute("aria-label", t("phaseNext"));
  $$("#lang-toggle [data-lang-opt]").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.langOpt === lang);
  });
}

/* ---------------- 菜单与档案馆 ---------------- */

function renderBattleMenu() {
  const menu = $("#battle-menu");
  menu.innerHTML = `
    <header><span>${t("menuHeader")}</span><a href="./" data-nav-home>${t("menuOverview")}</a></header>
    <div class="battle-menu-list">
      ${battleRegistry
        .map((raw, i) => {
          const item = getLocalizedEntry(raw);
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
            <span class="option-badge">${current ? t("badgeCurrent") : available ? pad(i + 1) : t("badgePlanned")}</span>
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
    .map((raw) => {
      const item = getLocalizedEntry(raw);
      const idx = battleRegistry.findIndex((b) => b.id === item.id);
      const available = item.status === "available";
      return `
      <article class="archive-card ${available ? "" : "is-planned"}" style="--item-accent:${item.accent}">
        <button type="button" class="archive-card-hit" data-battle-id="${item.id}" ${available ? "" : "disabled"}
                aria-label="${available ? t("cardAriaEnter") : t("cardAriaPlanned")}${item.name}${t("cardAriaSuffix")}"></button>
        <div class="card-top">
          <span class="card-no">${t("cardArchivePrefix")} ${pad(idx + 1)} · ${item.regionLabel || ""}</span>
          <span class="card-status">${available ? t("cardPlayable") : t("cardPlanned")}</span>
        </div>
        <div class="card-seal" aria-hidden="true">${item.seal}</div>
        <div class="card-body">
          <small>${item.era}${item.codename ? ` · ${item.codename}` : ""}</small>
          <h3>${item.name}</h3>
          <p>${item.summary}</p>
        </div>
        <dl class="card-meta">
          <div><dt>${t("cardTime")}</dt><dd>${item.periodLabel}</dd></div>
          <div><dt>${t("cardTheater")}</dt><dd>${item.theater}</dd></div>
          <div><dt>${t("cardOpponents")}</dt><dd>${item.opponents}</dd></div>
        </dl>
        <div class="card-cta">${available ? t("cardEnter") : t("cardComingSoon")}</div>
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
    <div><strong>${pad(available)}</strong><span>${t("statPlayable")}</span></div>
    <div><strong>${pad(chinaCount)} / ${pad(worldCount)}</strong><span>${t("statSplit")}</span></div>
    <div><strong>${battleRegistry.length ? `${Math.min(...battleRegistry.map((b) => +b.period))}—${Math.max(...battleRegistry.map((b) => +b.period))}` : "—"}</strong><span>${t("statSpan")}</span></div>`;
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
  document.title = t("siteFullTitle");
  $("#switcher-seal").textContent = t("siteSeal");
  $("#switcher-kicker").textContent = t("switcherKickerHome");
  $("#switcher-name").textContent = t("switcherNameHome");
  $("#footer-title").textContent = t("siteTitle");
  $("#footer-sources").innerHTML = "";
  renderArchive();
  renderBattleMenu();
  setupReveal();
}

async function showBattle(id, { forceReload = false, preservePhase = false } = {}) {
  stopTour();
  const prevPhase = preservePhase ? state.phase : 0;
  const prevOrderSide = preservePhase ? state.orderSide : "red";
  if (!forceReload && state.battleId === id && state.battle) {
    document.body.dataset.view = "battle";
    return;
  }

  document.body.classList.add("is-loading");
  let battle;
  try {
    const raw = normalizeBattle(await loadBattle(id));
    if (isEn()) {
      const overlay = await loadBattleEnOverlay(id);
      battle = applyBattleOverlay(raw, overlay);
    } else {
      battle = raw;
    }
  } catch (err) {
    console.error("Failed to load battle:", err);
    document.body.classList.remove("is-loading");
    showHome();
    return;
  }

  state.battleId = id;
  state.battle = battle;
  state.phase = Math.min(prevPhase, Math.max(0, battle.phases.length - 1));
  state.orderSide = prevOrderSide;

  applyTheme(battle.theme);
  document.body.dataset.view = "battle";
  $("#view-home").hidden = true;
  $("#view-battle").hidden = false;

  document.title = `${battle.title}${t("battleTitleSuffix")}`;
  $('meta[name="description"]')?.setAttribute(
    "content",
    `${battle.title}: ${battle.subtitle}. ${t("mapDescSuffix")}`
  );

  const index = battleRegistry.findIndex((b) => b.id === id);
  $("#switcher-seal").textContent = battle.seal;
  $("#switcher-kicker").textContent = `${t("switcherArchivePrefix")} ${pad(index + 1)}`;
  $("#switcher-name").textContent = battle.title;

  renderHero(battle);
  mapRenderer.renderBattle(battle);
  mapRenderer.refreshLanguage();
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

  setPhase(state.phase);
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
  $('[data-order-side="red"]').textContent = `${fs.red}${t("orderSuffix")}`;
  $('[data-order-side="blue"]').textContent = `${fs.blue}${t("orderSuffix")}`;
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
    .map(
      ([d, title, c], i) =>
        `<div class="dossier-row" data-turn-idx="${i}" role="button" tabindex="0"><time>${d}</time><strong>${title}</strong><span>${c}</span></div>`
    )
    .join("");
  $$("#dossier-list .dossier-row").forEach((row) => {
    const jump = () => {
      stopTour();
      mapRenderer?.goToTurn(Number(row.dataset.turnIdx));
      $("#sandtable").scrollIntoView({ behavior: "smooth" });
    };
    row.addEventListener("click", jump);
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        jump();
      }
    });
  });
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

function highlightDossierTurn(turnIdx) {
  $$("#dossier-list .dossier-row").forEach((row, i) => {
    row.classList.toggle("is-turn-active", turnIdx >= 0 && i === turnIdx);
  });
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
  if (labelEl) labelEl.textContent = l.sectionLabel || t("sec03DefaultLabel");
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
  $("#footer-title").textContent = `${battle.title} · ${t("siteTitle")}`;
  $("#footer-sources").innerHTML =
    `<span>${t("footerSourcesLabel")}</span>` +
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
  renderDossier(battle, state.phase);
  mapRenderer.setPhase(state.phase);

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
  $(".play-label", btn).textContent = t("playTour");
}

function startTour() {
  if (!state.battle) return;
  const total = state.battle.phases.length;
  if (state.phase >= total - 1) setPhase(0);
  const btn = $("#play-tour");
  btn.classList.add("is-playing");
  $(".play-label", btn).textContent = t("pauseTour");
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

  $("#lang-toggle")?.addEventListener("click", async () => {
    setLang(isEn() ? "zh" : "en");
    applyStaticI18n();
    if (state.battleId) {
      await showBattle(state.battleId, { forceReload: true, preservePhase: true });
    } else {
      showHome();
    }
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
  applyStaticI18n();
  mapRenderer = new MapRenderer($("#map-stage"));
  mapRenderer.onTurnChange = (turnIdx) => highlightDossierTurn(turnIdx);
  mapRenderer.refreshLanguage();
  renderArchive();
  setupGlobalEvents();
  route();
}

init();
