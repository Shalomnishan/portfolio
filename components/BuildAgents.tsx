"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Clapperboard, Pause, Play } from "lucide-react";
import { agents } from "@/lib/data";
import { createEngine, type Engine, type EngineState } from "./engine";

function RobotHead({ delay }: { delay: number }) {
  return (
    <svg
      className="bot"
      viewBox="0 0 16 16"
      width="13"
      height="13"
      aria-hidden="true"
      style={{ ["--d" as string]: `${delay}s` }}
    >
      <line x1="8" y1="2" x2="8" y2="4.5" stroke="#09090b" strokeWidth="1.2" />
      <circle className="bot-ant" cx="8" cy="1.7" r="1.4" fill="#09090b" />
      <rect x="1.5" y="4.5" width="13" height="10" rx="3" fill="#09090b" />
      <rect className="bot-eye" x="4.6" y="7.6" width="2.2" height="3.4" rx="1.1" fill="#fff" />
      <rect className="bot-eye" x="9.2" y="7.6" width="2.2" height="3.4" rx="1.1" fill="#fff" />
    </svg>
  );
}

export default function BuildAgents() {
  const layerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const [s, setS] = useState<EngineState>({
    ready: false,
    agents: false,
    paused: false,
    touring: false,
  });

  useEffect(() => {
    if (!layerRef.current) return;
    const engine = createEngine(layerRef.current, setS);
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  return (
    <>
      {/* Boot loader: only visible in build mode, before the engine is ready */}
      <div className="boot" aria-hidden="true">
        <div className="boot-inner">
          <p>
            <span className="boot-dot" />
            Booting build agents
          </p>
          <div className="boot-bar">
            <i />
          </div>
        </div>
      </div>

      {/* Cursors + wireframe boxes */}
      <div ref={layerRef} className="agents-layer" data-on="0" aria-hidden="true">
        {agents.map((a) => (
          <div key={`w-${a.name}`} data-wire className="wire">
            <i className="tl" />
            <i className="tr" />
            <i className="bl" />
            <i className="br" />
            <b />
          </div>
        ))}
        {agents.map((a, i) => (
          <div key={a.name} data-agent className="agent">
            <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true">
              <path
                d="M1.2 1.2l5.4 16 2.7-6.5 6.6-2.5z"
                fill={a.color}
                stroke="#09090b"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>
            <span className="agent-tag" style={{ background: a.color }}>
              <RobotHead delay={i * 0.47} />
              {a.name}
            </span>
          </div>
        ))}
      </div>

      {/* Dock */}
      <div
        className="dock"
        role="toolbar"
        aria-label="Animation controls"
        data-hidden={s.touring ? "" : undefined}
      >
        <button
          type="button"
          className="dock-btn"
          onClick={() => engineRef.current?.togglePause()}
          disabled={!s.ready}
          aria-pressed={s.paused}
          title="Pause or resume all motion (P)"
        >
          {s.paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          <span>{s.paused ? "Play" : "Pause"}</span>
          <kbd>P</kbd>
        </button>
        <button
          type="button"
          className="dock-btn"
          onClick={() => engineRef.current?.toggleAgents()}
          disabled={!s.ready}
          aria-pressed={s.agents}
          title="Turn the build agents on or off (A)"
        >
          <Bot size={14} aria-hidden="true" />
          <span>Agents</span>
          <span className="dock-led" data-on={s.agents ? "" : undefined} />
          <span className="sr-only">{s.agents ? "on" : "off"}</span>
          <kbd>A</kbd>
        </button>
        <button
          type="button"
          className="dock-btn"
          onClick={() => engineRef.current?.toggleTour()}
          disabled={!s.ready}
          title="Reload and auto-scroll the whole site (T)"
        >
          <Clapperboard size={14} aria-hidden="true" />
          <span>Tour</span>
          <kbd>T</kbd>
        </button>
      </div>
    </>
  );
}
