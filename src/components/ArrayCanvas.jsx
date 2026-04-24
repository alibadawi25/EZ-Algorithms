import Icon from "./Icon";
import { BAR_STATES } from "../theme";

function barState(idx, step, algorithm, vizActive) {
  if (!vizActive || !step) return "default";

  if (algorithm === "bubble-sort") {
    if (step.sorted?.has(idx)) return "sorted";
    if (step.swapped?.includes(idx)) return "swapped";
    if (step.comparing?.includes(idx)) return "comparing";
  }
  if (algorithm === "selection-sort") {
    if (step.sorted?.has(idx)) return "sorted";
    if (step.swapped?.includes(idx)) return "swapped";
    if (idx === step.minIdx && step.scanIdx !== null) return "minIdx";
    if (idx === step.scanIdx) return "scanning";
  }
  if (algorithm === "insertion-sort") {
    if (step.sorted?.has(idx)) return "sorted";
    if (idx === step.keyIdx) return "key";
    if (idx === step.shiftIdx) return "shifting";
  }
  if (algorithm === "linear-search") {
    if (step.found && idx === step.current) return "found";
    if (idx === step.current) return "checking";
    if (step.checked?.has(idx)) return "checked";
  }
  if (algorithm === "binary-search") {
    if (step.found && idx === step.mid) return "found";
    if (idx === step.mid) return "mid";
    if (step.lo !== undefined && (idx < step.lo || idx > step.hi))
      return "inactive";
  }
  return "default";
}

// Extended bar state colors including new algorithms
const BAR_EXT = {
  ...BAR_STATES,
  minIdx: { bg: "rgba(244,114,182,.18)", border: "#f472b6", text: "#f472b6" },
  scanning: { bg: "rgba(251,191,36,.10)", border: "#fbbf24", text: "#fbbf24" },
  key: { bg: "rgba(56,189,248,.18)", border: "#38bdf8", text: "#38bdf8" },
  shifting: { bg: "rgba(251,191,36,.14)", border: "#fbbf24", text: "#fbbf24" },
  checking: { bg: "rgba(251,191,36,.14)", border: "#fbbf24", text: "#fbbf24" },
  checked: { bg: "rgba(71,85,105,.2)", border: "#475569", text: "#64748b" },
};

export default function ArrayCanvas({
  array,
  step,
  algorithm,
  vizActive,
  searchTarget,
  setSearchTarget,
  rawArr,
  setRawArr,
  setArray,
  onShuffle,
  onReset,
}) {
  const displayArr = vizActive && step?.array ? step.array : array;
  const maxVal = Math.max(...displayArr, 1);
  const needsTarget =
    algorithm === "binary-search" || algorithm === "linear-search";
  const targetOptions = [...new Set(array)].filter(
    (value) => value !== undefined && value !== null,
  );

  return (
    <div className="array-canvas">
      {/* Binary search / linear search pointer row */}
      {needsTarget && vizActive && step && step.lo !== undefined && (
        <div className="bs-pointers">
          {[
            { lbl: "lo", val: step.lo, col: "#38bdf8" },
            { lbl: "mid", val: step.mid >= 0 ? step.mid : "—", col: "#fbbf24" },
            { lbl: "hi", val: step.hi, col: "#f87171" },
            { lbl: "target", val: step.target, col: "#34d399" },
          ].map((p) => (
            <div key={p.lbl} className="bs-pointer" style={{ "--c": p.col }}>
              {p.lbl}: <strong>{p.val}</strong>
            </div>
          ))}
        </div>
      )}

      {/* Linear search current pointer */}
      {algorithm === "linear-search" &&
        vizActive &&
        step &&
        step.current >= 0 && (
          <div className="bs-pointers">
            <div className="bs-pointer" style={{ "--c": "#fbbf24" }}>
              checking index: <strong>{step.current}</strong>
            </div>
            <div className="bs-pointer" style={{ "--c": "#34d399" }}>
              target: <strong>{step.target}</strong>
            </div>
          </div>
        )}

      {/* Bars */}
      <div className="bars-row">
        {displayArr.map((val, idx) => {
          const st = barState(idx, step, algorithm, vizActive);
          const col = BAR_EXT[st] ?? BAR_EXT.default;
          const h = Math.max(
            48,
            Math.min(210, Math.round((val / maxVal) * 190) + 38),
          );

          let topLabel = null;
          if (algorithm === "binary-search" && vizActive && step) {
            if (idx === step.mid && step.mid >= 0) topLabel = "mid";
            else if (idx === step.lo) topLabel = "lo";
            else if (idx === step.hi) topLabel = "hi";
            if (idx === step.lo && idx === step.hi) topLabel = "lo=hi";
          }
          if (
            algorithm === "linear-search" &&
            vizActive &&
            step &&
            idx === step.current
          ) {
            topLabel = "▼";
          }
          if (
            algorithm === "selection-sort" &&
            vizActive &&
            step &&
            idx === step.minIdx &&
            step.scanIdx !== null
          ) {
            topLabel = "min";
          }
          if (
            algorithm === "insertion-sort" &&
            vizActive &&
            step &&
            idx === step.keyIdx
          ) {
            topLabel = "key";
          }

          return (
            <div key={idx} className="bar-wrap">
              <span className="bar-top-label" style={{ color: col.border }}>
                {topLabel || ""}
              </span>
              <div
                className="bar"
                style={{
                  height: h,
                  background: col.bg,
                  borderColor: col.border,
                  color: col.text,
                  boxShadow:
                    col.border !== "#334155"
                      ? `0 0 18px ${col.border}44`
                      : undefined,
                }}
              >
                {val}
              </div>
              <span className="bar-idx">[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Input bar */}
      <div className="array-input-bar">
        <label className="input-label">Array</label>
        <input
          className="array-input"
          value={rawArr}
          placeholder="e.g. 64, 34, 25, 12, 22, 11, 90"
          onChange={(e) => {
            setRawArr(e.target.value);
            const v = e.target.value
              .split(",")
              .map((s) => parseInt(s.trim(), 10))
              .filter((n) => !isNaN(n));
            if (v.length > 0) {
              setArray(v);
              onReset?.();
            }
          }}
        />

        {needsTarget && (
          <>
            <label className="input-label">Target</label>
            <select
              className="array-input array-target-select"
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
          </>
        )}

        {algorithm === "binary-search" && (
          <span className="input-hint">Auto-sorted before search</span>
        )}

        <button
          className="btn btn-ghost"
          style={{ marginLeft: "auto" }}
          onClick={onShuffle}
          title="Shuffle array"
        >
          <Icon name="shuffle" size={13} /> Shuffle
        </button>
      </div>
    </div>
  );
}
