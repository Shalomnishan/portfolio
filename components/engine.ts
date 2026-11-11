/**
 * Build-agents engine.
 * One requestAnimationFrame loop drives every cursor, wireframe box, reveal
 * and the tour auto-scroll. One IntersectionObserver decides what to build.
 */

declare global {
  interface Window {
    __agents?: boolean;
    __tour?: boolean;
    __agentsReady?: boolean;
  }
}

export interface EngineState {
  ready: boolean;
  agents: boolean;
  paused: boolean;
  touring: boolean;
}

export interface Engine {
  togglePause(): void;
  toggleAgents(): void;
  toggleTour(): void;
  destroy(): void;
}

type Kind = "type" | "pop" | "wipe";
type Phase = "idle" | "travel" | "drag" | "fill" | "release";

const IDLE = 0;
const QUEUED = 1;
const ACTIVE = 2;
const DONE = 3;

interface Chunk {
  node: Text;
  rest: HTMLSpanElement;
  full: string;
  start: number;
  shown: number;
}

interface Task {
  el: HTMLElement;
  kind: Kind;
  label: string;
  parent: Task | null;
  state: number;
  chunks: Chunk[];
  chars: number;
}

interface Cursor {
  el: HTMLElement;
  box: HTMLElement;
  boxLabel: HTMLElement | null;
  x: number;
  y: number;
  sx: number;
  sy: number;
  bend: number;
  hx: number;
  hy: number;
  seed: number;
  phase: Phase;
  t: number;
  dur: number;
  task: Task | null;
}

interface Tour {
  scrolling: boolean;
  t: number;
  settle: number;
  dist: number;
  speed: number;
  ramp: number;
  total: number;
  last: number;
}

const MAX_ACTIVE = 6;
const PAD = 5;
const HOMES: [number, number][] = [
  [0.1, 0.22],
  [0.9, 0.2],
  [0.14, 0.78],
  [0.88, 0.72],
  [0.5, 0.1],
  [0.52, 0.86],
  [0.05, 0.5],
  [0.95, 0.46],
];
const SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
]);

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const easeInOut = (p: number) =>
  p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
const easeBack = (p: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};

export function createEngine(
  layer: HTMLElement,
  onChange: (s: EngineState) => void,
): Engine {
  const root = document.documentElement;
  const cursorEls = Array.from(layer.querySelectorAll<HTMLElement>("[data-agent]"));
  const boxEls = Array.from(layer.querySelectorAll<HTMLElement>("[data-wire]"));

  const state: EngineState = {
    ready: false,
    agents: window.__agents === true,
    paused: false,
    touring: false,
  };
  const emit = () => onChange({ ...state });

  // ---- tasks -------------------------------------------------------------
  const byEl = new Map<Element, Task>();
  const tasks: Task[] = Array.from(
    document.querySelectorAll<HTMLElement>("[data-build]"),
  ).map((el) => {
    const k = el.dataset.build;
    const kind: Kind = k === "type" || k === "wipe" ? k : "pop";
    return {
      el,
      kind,
      label: el.dataset.label || el.tagName.toLowerCase(),
      parent: null,
      state: IDLE,
      chunks: [],
      chars: 0,
    };
  });
  tasks.forEach((t) => byEl.set(t.el, t));
  tasks.forEach((t) => {
    const p = t.el.parentElement?.closest("[data-build]");
    t.parent = p ? (byEl.get(p) ?? null) : null;
  });

  let cursors: Cursor[] = [];
  let io: IntersectionObserver | null = null;
  let raf = 0;
  let last = 0;
  let clock = 0;
  let building = false;
  let ioSeen = false;
  let leaving = -1;
  let tour: Tour | null = null;
  let destroyed = false;
  let bootTimer = 0;

  // ---- reveal primitives -------------------------------------------------
  function beginFill(t: Task) {
    const el = t.el;
    if (t.kind === "type") {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      while (walker.nextNode()) {
        const n = walker.currentNode as Text;
        if (n.data.length > 0) nodes.push(n);
      }
      let start = 0;
      t.chunks = nodes.map((node) => {
        const full = node.data;
        const rest = document.createElement("span");
        rest.className = "type-rest";
        rest.setAttribute("aria-hidden", "true");
        rest.textContent = full;
        node.data = "";
        node.after(rest);
        const chunk = { node, rest, full, start, shown: 0 };
        start += full.length;
        return chunk;
      });
      t.chars = start;
    } else if (t.kind === "pop") {
      el.style.opacity = "0";
      el.style.scale = "0.9";
    } else {
      el.style.clipPath = "inset(-12% 100% -12% -2%)";
    }
    el.setAttribute("data-built", "building");
  }

  function applyFill(t: Task, p: number) {
    const el = t.el;
    if (t.kind === "type") {
      const n = Math.floor(p * t.chars);
      for (const c of t.chunks) {
        const k = clamp(n - c.start, 0, c.full.length);
        if (k !== c.shown) {
          c.shown = k;
          c.node.data = c.full.slice(0, k);
          c.rest.textContent = c.full.slice(k);
        }
      }
    } else if (t.kind === "pop") {
      el.style.opacity = String(Math.min(1, p * 2.2));
      el.style.scale = String(0.9 + 0.1 * easeBack(p));
    } else {
      const e = easeInOut(p);
      el.style.clipPath = `inset(-12% ${((1 - e) * 100).toFixed(2)}% -12% -2%)`;
    }
  }

  /** Restore an element to its untouched, fully rendered DOM. */
  function restore(t: Task) {
    for (const c of t.chunks) {
      c.node.data = c.full;
      c.rest.remove();
    }
    t.chunks = [];
    t.el.style.opacity = "";
    t.el.style.scale = "";
    t.el.style.clipPath = "";
  }

  function finish(t: Task) {
    restore(t);
    t.el.setAttribute("data-built", "done");
    t.state = DONE;
  }

  function fillDuration(t: Task) {
    if (t.kind === "type") return clamp(t.chars * 22, 280, 1300);
    if (t.kind === "pop") return 420;
    return 760;
  }

  // ---- wireframe box -----------------------------------------------------
  function placeBox(c: Cursor, x: number, y: number, w: number, h: number) {
    const s = c.box.style;
    s.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
    s.width = `${Math.max(0, w).toFixed(1)}px`;
    s.height = `${Math.max(0, h).toFixed(1)}px`;
    if (c.boxLabel && c.task) {
      c.boxLabel.textContent = `${c.task.label} · ${Math.round(w)}×${Math.round(h)}`;
    }
  }

  // ---- scheduling --------------------------------------------------------
  function onIO(entries: IntersectionObserverEntry[]) {
    ioSeen = true;
    for (const e of entries) {
      const t = byEl.get(e.target);
      if (!t || t.state !== IDLE) continue;
      if (e.isIntersecting) t.state = QUEUED;
      else if (e.boundingClientRect.bottom <= 0) finish(t); // already scrolled past
    }
  }

  function schedule() {
    let active = 0;
    for (const c of cursors) if (c.task && c.phase !== "release") active++;
    if (active >= MAX_ACTIVE) return;

    for (const t of tasks) {
      if (t.state !== QUEUED) continue;
      if (t.parent && t.parent.state !== DONE) continue;
      const r = t.el.getBoundingClientRect();
      if (r.bottom <= 0 || (r.width === 0 && r.height === 0)) {
        finish(t);
        continue;
      }
      let best: Cursor | null = null;
      let bestD = Infinity;
      for (const c of cursors) {
        if (c.task) continue;
        const d = Math.hypot(c.x - r.left, c.y - r.top);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      if (!best) break;
      best.task = t;
      t.state = ACTIVE;
      best.phase = "travel";
      best.t = 0;
      best.sx = best.x;
      best.sy = best.y;
      best.dur = clamp(260 + bestD * 0.42, 320, 780);
      best.bend = (Math.random() < 0.5 ? -1 : 1) * Math.min(bestD * 0.2, 90);
      if (++active >= MAX_ACTIVE) break;
    }
  }

  function stepBusy(c: Cursor, dt: number) {
    const t = c.task as Task;
    const r = t.el.getBoundingClientRect();
    const L = r.left - PAD;
    const T = r.top - PAD;
    const W = r.width + PAD * 2;
    const H = r.height + PAD * 2;
    c.t += dt;
    const p = Math.min(1, c.t / c.dur);

    if (c.phase === "travel") {
      const e = easeInOut(p);
      const dx = L - c.sx;
      const dy = T - c.sy;
      const len = Math.hypot(dx, dy) || 1;
      const cx = (c.sx + L) / 2 - (dy / len) * c.bend;
      const cy = (c.sy + T) / 2 + (dx / len) * c.bend;
      const u = 1 - e;
      c.x = u * u * c.sx + 2 * u * e * cx + e * e * L;
      c.y = u * u * c.sy + 2 * u * e * cy + e * e * T;
      if (p >= 1) {
        c.phase = "drag";
        c.t = 0;
        c.dur = clamp(220 + Math.hypot(W, H) * 0.22, 280, 520);
        c.box.style.opacity = "1";
        c.box.style.display = "block";
        placeBox(c, L, T, 0, 0);
      }
    } else if (c.phase === "drag") {
      const e = easeOut(p);
      placeBox(c, L, T, W * e, H * e);
      c.x = L + W * e;
      c.y = T + H * e;
      if (p >= 1) {
        beginFill(t);
        c.phase = "fill";
        c.t = 0;
        c.dur = fillDuration(t);
      }
    } else if (c.phase === "fill") {
      placeBox(c, L, T, W, H);
      c.x = L + W;
      c.y = T + H;
      applyFill(t, p);
      if (p >= 1) {
        finish(t);
        c.phase = "release";
        c.t = 0;
        c.dur = 200;
      }
    } else {
      placeBox(c, L, T, W, H);
      c.x = L + W;
      c.y = T + H;
      c.box.style.opacity = String(1 - p);
      if (p >= 1) {
        c.box.style.display = "none";
        c.task = null;
        c.phase = "idle";
      }
    }
  }

  function stepIdle(c: Cursor, dt: number) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let tx: number;
    let ty: number;
    if (leaving >= 0) {
      tx = c.hx < 0.5 ? -140 : vw + 140;
      ty = c.hy * vh;
    } else {
      tx = c.hx * vw + Math.sin(clock * 0.0011 + c.seed) * 12;
      ty = c.hy * vh + Math.cos(clock * 0.0009 + c.seed * 1.7) * 10;
    }
    const k = 1 - Math.exp(-dt * (leaving >= 0 ? 0.004 : 0.0024));
    c.x += (tx - c.x) * k;
    c.y += (ty - c.y) * k;
  }

  function stepBuild(dt: number) {
    schedule();
    let busy = false;
    for (const c of cursors) {
      if (c.task) {
        busy = true;
        stepBusy(c, dt);
      } else {
        stepIdle(c, dt);
      }
      c.el.style.transform = `translate3d(${c.x.toFixed(1)}px,${c.y.toFixed(1)}px,0)`;
    }
    if (leaving < 0) {
      if (ioSeen && !busy && tasks.every((t) => t.state === DONE)) leaving = 0;
    } else {
      leaving += dt;
      if (leaving > 900) layer.dataset.on = "0";
      if (leaving > 1500) {
        building = false;
        io?.disconnect();
        io = null;
      }
    }
  }

  // ---- build lifecycle ---------------------------------------------------
  function startBuild() {
    io?.disconnect();
    root.classList.add("build-mode");
    for (const t of tasks) {
      restore(t);
      t.el.removeAttribute("data-built");
      t.state = IDLE;
    }
    const count = window.matchMedia("(max-width: 767px)").matches ? 6 : 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    cursors = cursorEls.slice(0, count).map((el, i) => {
      const [hx, hy] = HOMES[i % HOMES.length];
      const x = hx < 0.5 ? -120 : vw + 120;
      const y = hy * vh;
      const box = boxEls[i];
      box.style.display = "none";
      el.style.display = "";
      el.style.transform = `translate3d(${x}px,${y}px,0)`;
      return {
        el,
        box,
        boxLabel: box.querySelector<HTMLElement>("b"),
        x,
        y,
        sx: x,
        sy: y,
        bend: 0,
        hx,
        hy,
        seed: i * 1.93,
        phase: "idle" as Phase,
        t: 0,
        dur: 1,
        task: null,
      };
    });
    cursorEls.slice(count).forEach((el) => (el.style.display = "none"));
    boxEls.slice(count).forEach((el) => (el.style.display = "none"));

    leaving = -1;
    ioSeen = false;
    building = true;
    layer.dataset.on = "1";
    io = new IntersectionObserver(onIO, { rootMargin: "0px 0px -40px 0px" });
    for (const t of tasks) io.observe(t.el);
    kick();
  }

  function stopBuild() {
    io?.disconnect();
    io = null;
    building = false;
    for (const t of tasks) finish(t);
    for (const c of cursors) {
      c.task = null;
      c.phase = "idle";
      c.box.style.display = "none";
    }
    root.classList.remove("build-mode");
    layer.dataset.on = "0";
  }

  // ---- tour --------------------------------------------------------------
  function stopTour() {
    if (!tour) return;
    tour = null;
    window.removeEventListener("wheel", stopTour);
    window.removeEventListener("touchstart", stopTour);
    state.touring = false;
    emit();
  }

  function beginTour() {
    tour = {
      scrolling: false,
      t: 0,
      settle: 0,
      dist: 0,
      speed: 0,
      ramp: 0,
      total: 0,
      last: 0,
    };
    window.addEventListener("wheel", stopTour, { passive: true });
    window.addEventListener("touchstart", stopTour, { passive: true });
    state.touring = true;
    emit();
    kick();
  }

  function stepTour(dt: number) {
    const tr = tour as Tour;
    if (!tr.scrolling) {
      // wait until the hero has finished building, then settle for a beat
      const quiet =
        !building ||
        (ioSeen && !tasks.some((t) => t.state === QUEUED || t.state === ACTIVE));
      tr.settle = quiet ? tr.settle + dt : 0;
      if (tr.settle < 800) return;
      tr.dist = document.documentElement.scrollHeight - window.innerHeight;
      if (tr.dist < 4) return stopTour();
      tr.speed = clamp(window.innerHeight * 0.15, 90, 160) / 1000; // px per ms
      tr.ramp = Math.min(1800, tr.dist / tr.speed);
      tr.total = tr.dist / tr.speed + tr.ramp;
      tr.t = 0;
      tr.last = window.scrollY;
      tr.scrolling = true;
      return;
    }
    // manual scroll (scrollbar drag, keyboard, etc.) cancels the tour
    if (Math.abs(window.scrollY - tr.last) > 8) return stopTour();
    tr.t += dt;
    const { speed, ramp: r, total, dist } = tr;
    const eased = (x: number) =>
      speed * (x / 2 - (r / (2 * Math.PI)) * Math.sin((Math.PI * x) / r));
    let pos: number;
    if (tr.t >= total) pos = dist;
    else if (tr.t < r) pos = eased(tr.t);
    else if (tr.t > total - r) pos = dist - eased(total - tr.t);
    else pos = (speed * r) / 2 + speed * (tr.t - r);
    window.scrollTo({ top: pos, behavior: "instant" });
    tr.last = window.scrollY;
    if (tr.t >= total) stopTour();
  }

  // ---- main loop ---------------------------------------------------------
  function frame(now: number) {
    raf = 0;
    const dt = state.paused ? 0 : Math.min(48, now - last);
    last = now;
    if (dt > 0) {
      clock += dt;
      if (building) stepBuild(dt);
      if (tour) stepTour(dt);
    }
    if (building || tour) raf = requestAnimationFrame(frame);
  }

  function kick() {
    if (raf || destroyed) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  // ---- controls ----------------------------------------------------------
  function togglePause() {
    if (!state.ready) return;
    state.paused = !state.paused;
    root.classList.toggle("paused", state.paused);
    emit();
  }

  function toggleAgents() {
    if (!state.ready) return;
    state.agents = !state.agents;
    try {
      localStorage.setItem("agents", state.agents ? "on" : "off");
      const url = new URL(window.location.href);
      if (url.searchParams.has("agents")) {
        url.searchParams.delete("agents");
        history.replaceState(null, "", url);
      }
    } catch {
      /* storage unavailable: the toggle still works for this visit */
    }
    if (state.agents) startBuild();
    else stopBuild();
    emit();
  }

  function toggleTour() {
    if (!state.ready) return;
    if (tour) return stopTour();
    try {
      sessionStorage.setItem("tour", "1");
      window.scrollTo({ top: 0, behavior: "instant" });
      window.location.reload();
    } catch {
      // no sessionStorage: run the tour in place instead of reloading
      window.scrollTo({ top: 0, behavior: "instant" });
      if (state.agents) startBuild();
      beginTour();
    }
  }

  function onKey(e: KeyboardEvent) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const el = e.target as HTMLElement | null;
    if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) {
      return;
    }
    if (tour && (e.key === "Escape" || SCROLL_KEYS.has(e.key))) {
      stopTour();
      return;
    }
    if (e.repeat) return;
    const k = e.key.toLowerCase();
    if (k === "t") toggleTour();
    else if (k === "a") toggleAgents();
    else if (k === "p") togglePause();
  }

  // ---- boot --------------------------------------------------------------
  function go() {
    if (destroyed) return;
    window.__agentsReady = true;
    root.classList.add("booted");
    state.ready = true;
    if (window.__tour) {
      window.__tour = false;
      window.scrollTo({ top: 0, behavior: "instant" });
      try {
        history.scrollRestoration = "auto";
      } catch {
        /* ignore */
      }
    }
    const wantTour = tourRequested;
    if (state.agents) startBuild();
    emit();
    if (wantTour) beginTour();
  }

  const tourRequested = window.__tour === true;
  const t0 = performance.now();
  const minBoot = state.agents ? 750 : 0;
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fonts, new Promise((res) => setTimeout(res, 2500))]).then(() => {
    if (destroyed) return;
    bootTimer = window.setTimeout(go, Math.max(0, minBoot - (performance.now() - t0)));
  });

  window.addEventListener("keydown", onKey);
  emit();

  return {
    togglePause,
    toggleAgents,
    toggleTour,
    destroy() {
      destroyed = true;
      window.clearTimeout(bootTimer);
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      window.removeEventListener("keydown", onKey);
      if (tour) {
        // keep the request alive for a remount (React strict mode)
        window.__tour = tourRequested;
        stopTour();
      }
      io?.disconnect();
      io = null;
      building = false;
      for (const t of tasks) restore(t);
      for (const c of cursors) c.box.style.display = "none";
      root.classList.remove("paused");
    },
  };
}
