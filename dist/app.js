const phases = [
  {
    name: "一渡赤水",
    date: "1935.01.28—29",
    intent: "原计划北渡长江；土城战斗后发现敌情有变，立即改向西渡赤水。",
    goal: "摆脱川军夹击",
    result: "由被动接战转入机动作战",
    force: "translate(270 256)",
    places: ["土城", "元厚", "古蔺"]
  },
  {
    name: "二渡赤水",
    date: "1935.02.18—21",
    intent: "川军封锁长江、滇军逼近扎西。红军突然回师黔北，攻击敌军防守较弱的方向。",
    goal: "避实击虚，寻求战机",
    result: "夺娄山关，再占遵义",
    force: "translate(510 375)",
    places: ["太平渡", "二郎滩", "桐梓", "娄山关", "遵义"]
  },
  {
    name: "三渡赤水",
    date: "1935.03.16—17",
    intent: "敌军再次向遵义地区收拢。红军由茅台西渡，摆出北渡长江的姿态。",
    goal: "诱使敌军主力西移",
    result: "东面与南面出现机动空间",
    force: "translate(260 276)",
    places: ["茅台", "古蔺", "叙永"]
  },
  {
    name: "四渡赤水",
    date: "1935.03.21—22",
    intent: "以一部继续向西佯动，主力秘密折返东进，趁敌军调动未定再渡赤水。",
    goal: "穿过敌军部署间隙",
    result: "南渡乌江，跳出合围",
    force: "translate(455 498)",
    places: ["太平渡", "二郎滩", "遵义", "贵阳"]
  }
];

const phaseButtons = [...document.querySelectorAll(".phase-button")];
const routes = [...document.querySelectorAll(".routes path:not(.route-future)")];
const places = [...document.querySelectorAll(".location")];
const playButton = document.querySelector("#play-tour");
let currentPhase = 0;
let tourTimer = null;

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
  document.querySelector("#red-force").setAttribute("transform", phase.force);

  phaseButtons.forEach((button, buttonIndex) => {
    const active = buttonIndex === currentPhase;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });

  routes.forEach((route, routeIndex) => {
    route.classList.toggle("is-active", routeIndex === currentPhase);
  });

  places.forEach((place) => {
    place.classList.toggle("is-key", phase.places.includes(place.dataset.place));
  });

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
  }, 3100);
}

phaseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    stopTour();
    setPhase(button.dataset.phase);
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

document.addEventListener("keydown", (event) => {
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
  { threshold: 0.16 }
);

document.querySelectorAll(".deployment, .logic-step, .timeline-event").forEach((item) => {
  item.classList.add("reveal-item");
  revealObserver.observe(item);
});

setPhase(0);
