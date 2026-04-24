import { useState } from "react";
import { SIDEBAR_SECTIONS } from "../data/config";
import Icon from "./Icon";

export default function Sidebar({ open, algorithm, canvasMode, onItem }) {
  const [tooltip, setTooltip] = useState(null); // item with description

  return (
    <aside className={`sidebar${open ? " sidebar-open" : " sidebar-closed"}`}>
      <div className="sidebar-inner">
        {SIDEBAR_SECTIONS.map((sec) => (
          <div key={sec.label} className="sb-section">
            <div className="sb-cat">{sec.label}</div>

            {sec.items.map((item) => {
              const isActive =
                (item.algo && item.algo === algorithm) ||
                (!item.algo && !item.tpl && item.canvasMode === canvasMode);

              return (
                <div key={item.id} className="sb-item-wrap">
                  <button
                    className={`sb-item${isActive ? " sb-item-active" : ""}`}
                    onClick={() => onItem(item)}
                    onMouseEnter={() => item.description && setTooltip(item)}
                    onMouseLeave={() => setTooltip(null)}
                    style={{ "--clr": item.color }}
                  >
                    <span
                      className="sb-icon"
                      style={{
                        color: item.color,
                        background: `${item.color}18`,
                        border: `1px solid ${item.color}28`,
                      }}
                    >
                      <Icon name={item.icon} size={16} color={item.color} />
                    </span>
                    <div className="sb-text">
                      <span className="sb-name">{item.name}</span>
                      <span className="sb-sub">{item.sub}</span>
                    </div>
                    {item.complexity && (
                      <span
                        className="sb-badge"
                        style={{
                          color: item.color,
                          borderColor: `${item.color}44`,
                          background: `${item.color}0e`,
                        }}
                      >
                        {item.complexity.time}
                      </span>
                    )}
                  </button>

                  {/* Hover info card */}
                  {tooltip?.id === item.id && item.description && (
                    <div className="sb-tooltip">
                      <p>{item.description}</p>
                      <div className="sb-tooltip-row">
                        <span>
                          Time: <strong>{item.complexity.time}</strong>
                        </span>
                        <span>
                          Space: <strong>{item.complexity.space}</strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Keyboard shortcuts (bottom) */}
        <div className="sb-section sb-shortcuts">
          <div className="sb-cat">Shortcuts</div>
          {[
            ["V", "Visualize"],
            ["Space", "Play / Pause"],
            ["← →", "Step"],
            ["R", "Reset"],
            ["C", "Connect mode"],
            ["B", "Toggle sidebar"],
            ["Ctrl+Z", "Undo"],
            ["Ctrl+Y", "Redo"],
            ["Esc", "Cancel"],
          ].map(([k, v]) => (
            <div key={k} className="shortcut-row">
              <span className="shortcut-label">{v}</span>
              <kbd>{k}</kbd>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
