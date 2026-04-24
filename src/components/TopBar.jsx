import { PSEUDO } from "../data/config";
import Icon from "./Icon";

export default function TopBar({
  algorithm,
  setAlgorithm,
  canvasMode,
  setCanvasMode,
  onVisualize,
  onReset,
  connecting,
  setConnecting,
  leftOpen,
  setLeftOpen,
  rightOpen,
  setRightOpen,
  vizActive,
  nodes,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onShuffle,
}) {
  const pseudo = PSEUDO[algorithm];

  return (
    <header className="topbar">
      {/* Left sidebar toggle */}
      <button
        className="btn btn-ghost btn-icon"
        title="Toggle sidebar  B"
        onClick={() => setLeftOpen((o) => !o)}
      >
        <Icon name="menu" size={15} />
      </button>

      {/* Logo */}
      <div className="logo">
        <div className="logo-mark">EZ</div>
        <div className="logo-text">
          <span className="logo-title">EZ Algorithms</span>
          <span className="logo-sub">Interactive Visualizer</span>
        </div>
      </div>

      <div className="tb-sep" />

      {/* Algorithm select */}
      <select
        className="algo-select"
        value={algorithm}
        onChange={(e) => {
          setAlgorithm(e.target.value);
        }}
      >
        <optgroup label="── Graph ──">
          <option value="bfs">BFS — Breadth-First</option>
          <option value="dfs">DFS — Depth-First</option>
        </optgroup>
        <optgroup label="── Sorting ──">
          <option value="bubble-sort">Bubble Sort</option>
          <option value="selection-sort">Selection Sort</option>
          <option value="insertion-sort">Insertion Sort</option>
        </optgroup>
        <optgroup label="── Searching ──">
          <option value="linear-search">Linear Search</option>
          <option value="binary-search">Binary Search</option>
        </optgroup>
      </select>

      {/* Visualize */}
      <button
        className="btn btn-success"
        onClick={onVisualize}
        title="Run visualization  V"
      >
        <Icon name="zap" size={13} color="#fff" /> Visualize
      </button>

      <button className="btn btn-ghost" onClick={onReset} title="Reset  R">
        <Icon name="reset" size={13} /> Reset
      </button>

      <div className="tb-sep" />

      {/* Mode toggle */}
      <div className="mode-toggle">
        {["graph", "array"].map((m) => (
          <button
            key={m}
            className={`mode-btn${canvasMode === m ? " active" : ""}`}
            data-mode={m}
            onClick={() => {
              setCanvasMode(m);
              onReset();
            }}
          >
            {m === "graph" ? "⬡ Graph / Tree" : "▦ Array"}
          </button>
        ))}
      </div>

      {/* Connect nodes */}
      {canvasMode === "graph" && (
        <button
          className={`btn ${connecting ? "btn-connecting" : "btn-ghost"}`}
          onClick={setConnecting}
          title="Draw edge between nodes  C"
        >
          <Icon
            name="link"
            size={13}
            color={connecting ? "#a78bfa" : "currentColor"}
          />
          {connecting ? "Click a target…" : "Connect"}
        </button>
      )}

      {/* Undo / Redo */}
      {canvasMode === "graph" && (
        <>
          <button
            className="btn btn-ghost btn-icon"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo  Ctrl+Z"
          >
            <Icon name="undo" size={13} />
          </button>
          <button
            className="btn btn-ghost btn-icon"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo  Ctrl+Y"
          >
            <Icon name="redo" size={13} />
          </button>
        </>
      )}

      {/* Shuffle (array mode) */}
      {onShuffle && (
        <button
          className="btn btn-ghost"
          onClick={onShuffle}
          title="Shuffle array randomly"
        >
          <Icon name="shuffle" size={13} /> Shuffle
        </button>
      )}

      <div style={{ flex: 1 }} />

      {/* Complexity badges */}
      {pseudo && (
        <div className="complexity-row">
          <span className="badge badge-blue" title="Time complexity">
            ⏱ {pseudo.complexity.time}
          </span>
          <span className="badge badge-purple" title="Space complexity">
            💾 {pseudo.complexity.space}
          </span>
        </div>
      )}

      {/* Node count */}
      {canvasMode === "graph" && nodes.length > 0 && (
        <span className="node-count">{nodes.length} nodes</span>
      )}
    </header>
  );
}
