import { battleRegistry, loadBattle } from "./data/battles.js";

const requestedBattle = new URLSearchParams(window.location.search).get("battle") || "chishui-1935";
const battle = await loadBattle(requestedBattle);
const phases = battle.phases;
const svgNamespace = "http://www.w3.org/2000/svg";

const phaseButtons = [...document.querySelectorAll(".phase-button")];
const routes = [...document.querySelectorAll(".routes path:not(.route-future)")];
const places = [...document.querySelectorAll(".location")];
const playButton = document.querySelector("#play-tour");
const formationLayer = document.querySelector("#formation-layer");
const battleMenu = document.querySelector("#battle-menu");
let currentPhase = 0;
let tourTimer = null;
let forceFilter = "all";

function makeSvg(tag, attributes = {}) {
  const node = document.createElementNS(svgNamespace, tag);
  Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, value));
  return node;
}

function createFormationNodes() {
  const formationIds = [...new Set(phases.flatMap((phase) => phase.formations.map((unit) => unit.id)))];

  formationIds.forEach((id) => {
    const group = makeSvg("g", { id: `formation-${id}`, class: "formation" });
    group.dataset.formationId = id;
    group.append(
      makeSvg("line", { class: "unit-line", x1: "0", y1: "0", x2: "16", y2: "-10" }),
      makeSvg("circle", { class: "unit-pip", cx: "0", cy: "0", r: "4" }),
      makeSvg("rect", { class: "unit-plate", x: "16", y: "-25", width: "132", height: "34" }),
      makeSvg("text", { class: "unit-label", x: "24", y: "-11" }),
      makeSvg("text", { class: "unit-sub", x: "24", y: "2" })
    );
    group.style.opacity = "0";
    formationLayer.append(group);
  });
}

function updateFormations(phase) {
  const active = new Map(phase.formations.map((unit) => [unit.id, unit]));

  formationLayer.querySelectorAll(".formation").forEach((node) => {
    const unit = active.get(node.dataset.formationId);
    if (!unit) {
      node.style.opacity = "0";
      return;
    }

    node.style.opacity = "1";
    node.setAttribute("transform", `translate(${unit.x} ${unit.y})`);
    node.setAttribute("class", `formation ${unit.side}`);
    node.querySelector(".unit-label").textContent = unit.label;
    node.querySelector(".unit-sub").textContent = unit.sub;
    node.classList.toggle("is-muted", forceFilter !== "all" && forceFilter !== unit.side);
  });
}

function renderCommanders() {
  const renderSide = (target, people) => {
    target.innerHTML = people
      .map((person) => `<div class="commander-row"><strong>${person.name}</strong><span>${person.role}</span></div>`)
      .join("");
  };
  renderSide(document.querySelector("#red-commanders"), battle.commanders.red);
  renderSide(document.querySelector("#blue-commanders"), battle.commanders.blue);
}

function renderOrder(side = "red") {
  const target = document.querySelector("#order-table");
  target.innerHTML = battle.orderOfBattle[side]
    .map(([unit, commander, role]) => `<div class="order-row"><strong>${unit}</strong><b>${commander}</b><span>${role}</span></div>`)
    .join("");

  document.querySelectorAll("[data-order-side]").forEach((button) => {
    const active = button.dataset.orderSide === side;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
}

function renderDossier(index) {
  const phase = phases[index];
  document.querySelector("#dossier-title").textContent = `${phase.name} · ${phase.date}`;
  document.querySelector("#dossier-list").innerHTML = phase.detail
    .map(([date, title, copy]) => `<div class="dossier-row"><time>${date}</time><strong>${title}</strong><span>${copy}</span></div>`)
    .join("");

  document.querySelectorAll(".dossier-tabs button").forEach((button, buttonIndex) => {
    const active = buttonIndex === index;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
}

function renderBattleMenu() {
  battleMenu.innerHTML = `<header>战争沙盘档案库 · DATA-DRIVEN ARCHIVE</header>${battleRegistry
    .map(
      (item, index) => `<button class="battle-option ${item.status === "planned" ? "is-planned" : ""}" type="button" ${item.status === "planned" ? "disabled" : ""}>
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${item.name}</strong>
        <small>${item.period}</small>
      </button>`
    )
    .join("")}`;
}

function setPhase(index, options = {}) {
  currentPhase = Number(index);
  const phase = phases[currentPhase];

  document.querySelector("#map-phase-name").textContent = phase.name;
  document.querySelector("#map-date").textContent = phase.date;
  document.querySelector("#brief-number").textContent = String(currentPhase + 1).padStart(2, "0");
  document.querySelector("#brief-intent").textContent = phase.intent;
  document.querySelector("#brief-goal").textContent = phase.goal;
  document.querySelector("#brief-result").textContent = phase.result;
  document.querySelector("#phase-progress-bar").style.width = `${(currentPhase + 1) * 25}%`;

  phaseButtons.forEach((button, buttonIndex) => {
    const active = buttonIndex === currentPhase;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });

  routes.forEach((route, routeIndex) => {
    route.setAttribute("d", phases[routeIndex].route);
    route.classList.toggle("is-active", routeIndex === currentPhase);
  });

  places.forEach((place) => {
    place.classList.toggle("is-key", phase.keys.includes(place.dataset.place));
  });

  updateFormations(phase);
  renderDossier(currentPhase);

  if (options.scrollToMap) {
    document.querySelector("#top").scrollIntoView({ behavior: "smooth" });
  }
}

function stopTour() {
  window.clearInterval(tourTimer);
  tourTimer = null;
  playButton.classList.remove("is-playing");
  playButton.querySelector("span:last-child").textContent = "自动推演";
}

function startTour() {
  setPhase(0);
  playButton.classList.add("is-playing");
  playButton.querySelector("span:last-child").textContent = "暂停推演";
  tourTimer = window.setInterval(() => {
    if (currentPhase === phases.length - 1) {
      stopTour();
      return;
    }
    setPhase(currentPhase + 1);
  }, 3600);
}

createFormationNodes();
renderCommanders();
renderOrder();
renderBattleMenu();

document.querySelector(".dossier-tabs").innerHTML = phases
  .map((phase, index) => `<button type="button" role="tab" aria-selected="${index === 0}" data-dossier-phase="${index}">${String(index + 1).padStart(2, "0")}</button>`)
  .join("");

phaseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    stopTour();
    setPhase(button.dataset.phase);
  });
});

document.querySelectorAll("[data-dossier-phase]").forEach((button) => {
  button.addEventListener("click", () => {
    stopTour();
    setPhase(button.dataset.dossierPhase);
  });
});

document.querySelectorAll("[data-order-side]").forEach((button) => {
  button.addEventListener("click", () => renderOrder(button.dataset.orderSide));
});

document.querySelectorAll("[data-force-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    forceFilter = button.dataset.forceFilter;
    document.querySelectorAll("[data-force-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
    updateFormations(phases[currentPhase]);
  });
});

document.querySelectorAll(".timeline-event[data-phase]").forEach((event) => {
  event.addEventListener("click", () => {
    stopTour();
    setPhase(event.dataset.phase, { scrollToMap: true });
  });
});

playButton.addEventListener("click", () => {
  if (tourTimer) stopTour();
  else startTour();
});

document.querySelector("#battle-switcher").addEventListener("click", () => {
  battleMenu.hidden = !battleMenu.hidden;
});

document.addEventListener("click", (event) => {
  if (!battleMenu.hidden && !battleMenu.contains(event.target) && !event.target.closest("#battle-switcher")) {
    battleMenu.hidden = true;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") battleMenu.hidden = true;
  if (event.key === "ArrowRight" && currentPhase < phases.length - 1) {
    stopTour();
    setPhase(currentPhase + 1);
  }
  if (event.key === "ArrowLeft" && currentPhase > 0) {
    stopTour();
    setPhase(currentPhase - 1);
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".deployment, .logic-step, .timeline-event, .commander-side, .order-layout, .phase-dossier").forEach((item) => {
  item.classList.add("reveal-item");
  revealObserver.observe(item);
});

setPhase(0);
