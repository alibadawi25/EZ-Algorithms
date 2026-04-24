import { useState } from "react";
import { PSEUDO, GRAPH_LEGENDS, ARRAY_LEGENDS } from "../data/config";
import Icon from "./Icon";

const STEP_EMOJI = {
  init: "🟢",
  process: "⚡",
  enqueue: "➕",
  skip: "⏭",
  done: "✅",
  visit: "👁",
  recurse: "↘",
  backtrack: "↩",
  compare: "⚖",
  swap: "🔄",
  place: "📌",
  shift: "➡",
  insert: "📥",
  pick: "🔑",
  check: "👀",
  found: "✅",
  "not-found": "❌",
  right: "➡",
  left: "⬅",
  newMin: "⬇",
  init: "🔍",
};

export default function RightPanel({
  algorithm,
  canvasMode,
  activeLine,
  stepType,
  stepDesc,
  nodes,
  startId,
  setStartId,
  vizActive,
  open,
  setOpen,
}) {
  const [copied, setCopied] = useState(false);
  const pseudo = PSEUDO[algorithm] ?? PSEUDO.bfs;
  const legends =
    canvasMode === "graph"
      ? GRAPH_LEGENDS
      : (ARRAY_LEGENDS[algorithm] ?? ARRAY_LEGENDS["bubble-sort"]);

  function copyCode() {
    const code = pseudo.lines.join("\n");
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // Collapsed state — just show a slim bar with toggle button
  if (!open) {
    return (
      <aside className="right-panel right-panel-closed">
        <button
          className="rp-toggle-btn"
          onClick={() => setOpen(true)}
          title="Open code panel"
        >
          <Icon name="arrowLeft" size={15} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="right-panel right-panel-open">
      {/* Header */}
      <div className="rp-header">
        <div>
          <div className="rp-algo-title">{pseudo.title}</div>
          <div className="rp-badges">
            <span className="badge badge-blue">⏱ {pseudo.complexity.time}</span>
            <span className="badge badge-purple">
              💾 {pseudo.complexity.space}
            </span>
          </div>
        </div>
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => setOpen(false)}
          title="Close panel"
        >
          <Icon name="x" size={14} />
        </button>
      </div>

      {/* Current step callout */}
      {vizActive && stepDesc && (
        <div className="rp-step-box" key={stepDesc}>
          <span className="rp-step-emoji">{STEP_EMOJI[stepType] ?? "▸"}</span>
          <p className="rp-step-text">{stepDesc}</p>
        </div>
      )}

      {/* Pseudocode */}
      <div className="rp-code-wrap">
        <div className="rp-code-header">
          <span className="rp-label">Python Pseudocode</span>
          <button
            className={`btn btn-ghost ${copied ? "btn-copied" : ""}`}
            style={{ fontSize: 11, padding: "3px 10px" }}
            onClick={copyCode}
            title="Copy code to clipboard"
          >
            {copied ? "✓ Copied!" : "⎘ Copy"}
          </button>
        </div>
        <div className="code-block">
          {pseudo.lines.map((line, i) => {
            const ln = i + 1;
            const active = activeLine === ln;
            return (
              <div
                key={i}
                className={`code-line${active ? " code-line-active" : ""}`}
              >
                <span className="code-ln">{ln}</span>
                <span className="code-text">{line}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="rp-section">
        <div className="rp-label">Legend</div>
        {legends.map(({ col, label }) => (
          <div key={label} className="legend-row">
            <span
              className="legend-dot"
              style={{ background: col, boxShadow: `0 0 6px ${col}88` }}
            />
            <span className="legend-label">{label}</span>
          </div>
        ))}
      </div>

      {/* Start node */}
      {canvasMode === "graph" && nodes.length > 0 && (
        <div className="rp-section">
          <div className="rp-label">Start Node</div>
          <select
            className="start-select"
            value={startId ?? ""}
            onChange={(e) => setStartId(+e.target.value)}
          >
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.value} (id {n.id})
              </option>
            ))}
          </select>
          <p className="rp-hint">Or right-click a node → Set as Start</p>
        </div>
      )}
    </aside>
  );
}
