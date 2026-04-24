import Icon from "./Icon";

const PRESETS = [
  { id: "slow", label: "Slow", icon: "clock" },
  { id: "normal", label: "Normal", icon: "activity" },
  { id: "fast", label: "Fast", icon: "zap" },
];

export default function FloatingControls({
  algorithm,
  array,
  searchTarget,
  setSearchTarget,
  playing,
  onTogglePlay,
  onStepBack,
  onStepFwd,
  onReset,
  idx,
  total,
  preset,
  setPreset,
  onJump,
  isDone,
}) {
  const showsTarget =
    algorithm === "linear-search" || algorithm === "binary-search";
  const canEditTarget = showsTarget && idx === 0;
  const targetOptions = [...new Set(array)].filter(
    (value) => value !== undefined && value !== null,
  );

  return (
    <div className={`float-controls${isDone ? " float-controls-done" : ""}`}>
      {showsTarget && (
        <div className="fc-target" title="Current search target">
          <Icon name="search" size={12} color="#34d399" />
          <span>Target</span>
          {canEditTarget ? (
            <select
              className="fc-target-select"
              value={searchTarget}
              onChange={(e) => setSearchTarget(+e.target.value)}
              aria-label="Search target"
            >
              {targetOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          ) : (
            <strong>{searchTarget}</strong>
          )}
        </div>
      )}

      {/* Scrubber */}
      <div className="fc-scrubber">
        <input
          type="range"
          className="scrubber-input"
          min={0}
          max={Math.max(0, total - 1)}
          value={idx}
          onChange={(e) => onJump(+e.target.value)}
          title="Drag to jump to any step"
        />
        <span className="fc-count">
          {idx + 1}/{total}
        </span>
      </div>

      <div className="fc-sep" />

      <button
        className="btn btn-ghost btn-icon"
        onClick={onStepBack}
        disabled={idx === 0}
        title="Step back  ←"
      >
        <Icon name="skipBack" size={14} />
      </button>

      <button
        className={`btn fc-play-btn${playing ? " playing" : ""}${isDone ? " done" : ""}`}
        onClick={onTogglePlay}
        title={playing ? "Pause  Space" : "Play  Space"}
      >
        <Icon
          name={playing ? "pause" : "play"}
          size={14}
          color={isDone ? "#fbbf24" : playing ? "#f87171" : "#34d399"}
        />
        {isDone ? "🎉 Done" : playing ? "Pause" : "Play"}
      </button>

      <button
        className="btn btn-ghost btn-icon"
        onClick={onStepFwd}
        disabled={idx >= total - 1}
        title="Step forward  →"
      >
        <Icon name="skipFwd" size={14} />
      </button>

      <div className="fc-sep" />

      {/* Speed presets */}
      <div className="speed-presets" title="Animation speed">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            className={`speed-btn${preset === p.id ? " active" : ""}`}
            onClick={() => setPreset(p.id)}
          >
            <Icon name={p.icon} size={12} />
            {p.label}
          </button>
        ))}
      </div>

      <div className="fc-sep" />

      <button
        className="btn btn-ghost btn-icon"
        onClick={onReset}
        title="Reset  R"
      >
        <Icon name="reset" size={13} />
      </button>
    </div>
  );
}
