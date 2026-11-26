// 战史沙盘 · 播音级神经网络男声 MP3 双语解说引擎（中文 YunyangNeural / 英文 AndrewMultilingualNeural）
// 彻底告别浏览器机械 TTS，全平台 Chrome / Safari / Firefox / 移动端一致呈现流畅浑厚真人级播音质感。

export class VoiceNarrator {
  constructor() {
    this.enabled = false;
    this.speaking = false;
    this.playToken = 0;
    this.audio = typeof Audio !== "undefined" ? new Audio() : null;
    this.preloadAudio = typeof Audio !== "undefined" ? new Audio() : null;
    this.audioCtx = null;

    if (this.audio) {
      this.audio.preload = "auto";
    }
    if (this.preloadAudio) {
      this.preloadAudio.preload = "auto";
    }
  }

  isSupported() {
    return Boolean(this.audio);
  }

  isEnabled() {
    return this.enabled;
  }

  setEnabled(flag) {
    this.enabled = Boolean(flag);
    if (!this.enabled) {
      this.stop();
    } else {
      this.ensureAudioCtx();
    }
    return this.enabled;
  }

  buildClipUrl(battleId, phaseId, turnIndex, lang = "zh") {
    const safeLang = lang === "en" ? "en" : "zh";
    return `./audio/${safeLang}/${battleId}__${phaseId}__${turnIndex}.mp3`;
  }

  preload(battleId, phaseId, turnIndex, lang = "zh") {
    if (!this.preloadAudio || battleId == null || phaseId == null || turnIndex == null) return;
    const url = this.buildClipUrl(battleId, phaseId, turnIndex, lang);
    if (this.preloadAudio.dataset?.src === url) return;
    try {
      this.preloadAudio.src = url;
      if (this.preloadAudio.dataset) this.preloadAudio.dataset.src = url;
      this.preloadAudio.load();
    } catch (_) {}
  }

  stop() {
    this.playToken++;
    this.speaking = false;
    if (this.audio) {
      try {
        this.audio.onplaying = null;
        this.audio.onended = null;
        this.audio.onerror = null;
        this.audio.pause();
        this.audio.currentTime = 0;
      } catch (_) {}
    }
  }

  playClip({ battleId, phaseId, turnIndex, lang = "zh", nextTurnIndex = null, onStart, onEnd } = {}) {
    if (!this.enabled || !this.audio || !battleId || !phaseId || turnIndex == null) {
      onEnd?.();
      return false;
    }

    this.stop();
    const myToken = this.playToken;
    const url = this.buildClipUrl(battleId, phaseId, turnIndex, lang);

    if (nextTurnIndex !== null && nextTurnIndex !== undefined) {
      this.preload(battleId, phaseId, nextTurnIndex, lang);
    }

    this.audio.src = url;
    this.audio.volume = 1.0;

    this.audio.onplaying = () => {
      if (myToken !== this.playToken) return;
      this.speaking = true;
      onStart?.();
    };
    this.audio.onended = () => {
      if (myToken !== this.playToken) return;
      this.speaking = false;
      onEnd?.();
    };
    this.audio.onerror = () => {
      if (myToken !== this.playToken) return;
      this.speaking = false;
      onEnd?.();
    };

    try {
      const p = this.audio.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          if (myToken !== this.playToken) return;
          this.speaking = false;
          onEnd?.();
        });
      }
      return true;
    } catch (_) {
      this.speaking = false;
      onEnd?.();
      return false;
    }
  }

  /* ---------------- 极简克制的 Web Audio 纪录片战地氛围提示音 ---------------- */

  ensureAudioCtx() {
    if (this.audioCtx || typeof window === "undefined") return this.audioCtx;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    try {
      this.audioCtx = new Ctx();
    } catch (_) {}
    return this.audioCtx;
  }

  playCue(type = "march") {
    if (!this.enabled) return;
    const ctx = this.ensureAudioCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.055, now);
    master.connect(ctx.destination);

    if (type === "clash" || type === "fire") {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(type === "fire" ? 96 : 110, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.38);
      g.gain.setValueAtTime(0.85, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.44);
      osc.connect(g);
      g.connect(master);
      osc.start(now);
      osc.stop(now + 0.46);
    } else if (type === "victory") {
      [146.83, 220.0, 293.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        g.gain.setValueAtTime(0.001, now + idx * 0.04);
        g.gain.linearRampToValueAtTime(0.28, now + idx * 0.04 + 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.68);
        osc.connect(g);
        g.connect(master);
        osc.start(now + idx * 0.04);
        osc.stop(now + 0.72);
      });
    } else {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(84, now);
      osc.frequency.exponentialRampToValueAtTime(48, now + 0.14);
      g.gain.setValueAtTime(0.4, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(g);
      g.connect(master);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  }
}
