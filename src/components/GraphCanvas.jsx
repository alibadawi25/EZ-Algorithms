import { useRef, useState, useCallback } from 'react'
import { NODE_STATES } from '../theme'

const NODE_R = 28
const DRAG_THRESHOLD = 5 // px before treating mousedown as drag

function nodeStateKey(id, step, vizActive) {
  if (!vizActive || !step) return 'default'
  if (step.current === id && !step.backtracking) return 'current'
  if (step.current === id && step.backtracking)  return 'backtrack'
  if (step.exploring === id) return 'exploring'
  if (step.skipped   === id) return 'skipped'
  if (step.visited?.has(id)) return 'visited'
  return 'inactive'
}

export default function GraphCanvas({
  nodes, edges,
  startId, vizActive, step,
  connecting, onConnect,
  onAddNode,
  onNodeCtx,
  onMoveNode,
  onSelect,
  selected,
}) {
  const svgRef   = useRef(null)
  const dragRef  = useRef(null)  // { id, ox, oy, startX, startY }
  const panRef   = useRef(null)  // { startX, startY, ox, oy }
  const hasDragged = useRef(false)

  const [zoom,     setZoom]     = useState(1)
  const [pan,      setPan]      = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [hovered,  setHovered]  = useState(null)

  // Convert screen → SVG content coordinates
  const toContent = useCallback((screenX, screenY) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return {
      x: (screenX - rect.left  - pan.x) / zoom,
      y: (screenY - rect.top   - pan.y) / zoom,
    }
  }, [pan, zoom])

  // ── Wheel zoom ────────────────────────────────────────────────────
  const handleWheel = useCallback(e => {
    e.preventDefault()
    const delta = -e.deltaY * 0.0008
    setZoom(z => Math.max(0.25, Math.min(4, z + delta * z)))
  }, [])

  // ── SVG mouse down (pan or canvas click start) ────────────────────
  const handleSvgMouseDown = useCallback(e => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault()
      panRef.current = { startX: e.clientX, startY: e.clientY, ox: pan.x, oy: pan.y }
    }
  }, [pan])

  // ── Node mouse down ───────────────────────────────────────────────
  const handleNodeMouseDown = useCallback((e, nodeId) => {
    e.stopPropagation()
    if (e.button !== 0) return

    if (connecting) {
      onConnect(nodeId)
      return
    }

    const nd = nodes.find(n => n.id === nodeId)
    if (!nd) return
    const pos = toContent(e.clientX, e.clientY)

    dragRef.current = {
      id:      nodeId,
      ox:      pos.x - nd.x,
      oy:      pos.y - nd.y,
      startX:  e.clientX,
      startY:  e.clientY,
    }
    hasDragged.current = false
    onSelect(nodeId)
  }, [connecting, nodes, toContent, onConnect, onSelect])

  // ── Mouse move ────────────────────────────────────────────────────
  const handleMouseMove = useCallback(e => {
    setMousePos({ x: e.clientX, y: e.clientY })

    // Pan
    if (panRef.current) {
      setPan({
        x: panRef.current.ox + e.clientX - panRef.current.startX,
        y: panRef.current.oy + e.clientY - panRef.current.startY,
      })
      return
    }

    // Drag node
    if (dragRef.current) {
      const dx = e.clientX - dragRef.current.startX
      const dy = e.clientY - dragRef.current.startY
      if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
        hasDragged.current = true
      }
      if (hasDragged.current) {
        const pos = toContent(e.clientX, e.clientY)
        onMoveNode(dragRef.current.id, pos.x - dragRef.current.ox, pos.y - dragRef.current.oy)
      }
    }
  }, [toContent, onMoveNode])

  // ── Mouse up ──────────────────────────────────────────────────────
  const handleMouseUp = useCallback(() => {
    panRef.current = null
    dragRef.current = null
  }, [])

  // ── SVG click (add node) ──────────────────────────────────────────
  const handleSvgClick = useCallback(e => {
    if (hasDragged.current) { hasDragged.current = false; return }
    if (connecting)         { return }
    const tag = e.target.tagName
    if (tag === 'svg' || tag === 'rect' || tag === 'circle' && !e.target.dataset.isNode) {
      if (e.target.closest?.('.node-g')) return
      const pos = toContent(e.clientX, e.clientY)
      onAddNode(pos.x, pos.y)
    }
  }, [hasDragged, connecting, toContent, onAddNode])

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  const edgeVisited = (fromId, toId) =>
    vizActive && step?.visited?.has(fromId) && step?.visited?.has(toId)

  return (
    <div className="canvas-wrap">
      <svg
        ref={svgRef}
        className={`graph-svg${connecting ? ' cursor-crosshair' : ''}`}
        onClick={handleSvgClick}
        onMouseDown={handleSvgMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <defs>
          <pattern id="dots" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="18" cy="18" r="1.2" fill="#1e293b" />
          </pattern>
          <marker id="arr"     markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill="#334155" />
          </marker>
          <marker id="arr-vis" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill="#38bdf8" />
          </marker>
          <marker id="arr-con" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill="#a78bfa" />
          </marker>
          <filter id="glow-amber" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-cyan" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-green" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="url(#dots)" />

        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>

          {/* Edges */}
          {edges.map(e => {
            const f = nodes.find(n => n.id === e.from)
            const t = nodes.find(n => n.id === e.to)
            if (!f || !t) return null
            const dx = t.x - f.x, dy = t.y - f.y
            const dist = Math.hypot(dx, dy) || 1
            const x1 = f.x + (dx / dist) * NODE_R
            const y1 = f.y + (dy / dist) * NODE_R
            const x2 = t.x - (dx / dist) * (NODE_R + 5)
            const y2 = t.y - (dy / dist) * (NODE_R + 5)
            const active = edgeVisited(e.from, e.to)
            return (
              <g key={e.id}>
                {active && <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#38bdf8" strokeWidth={8} opacity={0.07} />}
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={active ? '#38bdf8' : '#334155'}
                  strokeWidth={active ? 2 : 1.5}
                  markerEnd={`url(#${active ? 'arr-vis' : 'arr'})`}
                  style={{ transition: 'stroke .3s, stroke-width .3s' }}
                />
              </g>
            )
          })}

          {/* Connection preview line */}
          {connecting && (() => {
            const src = nodes.find(n => n.id === connecting)
            if (!src || !svgRef.current) return null
            const pos = toContent(mousePos.x, mousePos.y)
            const dx = pos.x - src.x, dy = pos.y - src.y
            const dist = Math.hypot(dx, dy) || 1
            return (
              <line
                x1={src.x + (dx / dist) * NODE_R} y1={src.y + (dy / dist) * NODE_R}
                x2={pos.x} y2={pos.y}
                stroke="#a78bfa" strokeWidth={1.5} strokeDasharray="6 4" opacity={0.75}
                markerEnd="url(#arr-con)"
                style={{ pointerEvents: 'none' }}
              />
            )
          })()}

          {/* Nodes */}
          {nodes.map(nd => {
            const sk      = nodeStateKey(nd.id, step, vizActive)
            const col     = NODE_STATES[sk]
            const isStart = nd.id === startId && !vizActive
            const isSel   = nd.id === selected && !vizActive
            const isHov   = nd.id === hovered

            const filter =
              sk === 'current'   ? 'url(#glow-amber)' :
              sk === 'exploring' ? 'url(#glow-cyan)'  :
              sk === 'visited'   ? 'url(#glow-green)' : undefined

            return (
              <g key={nd.id} className="node-g"
                transform={`translate(${nd.x},${nd.y})`}
                onMouseDown={e => handleNodeMouseDown(e, nd.id)}
                onContextMenu={e => { e.preventDefault(); e.stopPropagation(); onNodeCtx(e, nd.id) }}
                onMouseEnter={() => setHovered(nd.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {col.glow && <circle r={44} fill="none" stroke={col.stroke} strokeWidth={1} opacity={0.18} />}
                {isStart && <circle r={40} fill="none" stroke="#34d399" strokeWidth={1.5} strokeDasharray="5 4" opacity={0.6} />}
                {isSel   && <circle r={35} fill="none" stroke={col.stroke} strokeWidth={2}   opacity={0.5} />}
                {isHov && !col.glow && <circle r={34} fill="none" stroke={col.stroke} strokeWidth={1.5} opacity={0.35} />}

                <circle r={NODE_R}
                  fill={col.fill} stroke={col.stroke} strokeWidth={isStart ? 2.5 : 2}
                  filter={filter}
                  style={{ transition: 'fill .3s, stroke .3s, filter .3s' }}
                />
                <text textAnchor="middle" dominantBaseline="middle"
                  fontSize={nd.value.length > 3 ? 10 : nd.value.length > 2 ? 12 : 15}
                  fontWeight="700" fontFamily="'JetBrains Mono', monospace"
                  fill={col.text}
                  style={{ pointerEvents: 'none', transition: 'fill .3s', userSelect: 'none' }}
                >{nd.value}</text>

                {isStart && (
                  <text y={43} textAnchor="middle" fontSize={8.5} fill="#34d399"
                    fontWeight="700" letterSpacing="0.6"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}>START</text>
                )}
              </g>
            )
          })}
        </g>

        {/* Empty state */}
        {nodes.length === 0 && (
          <g style={{ pointerEvents: 'none' }}>
            <text x="50%" y="42%" textAnchor="middle" fill="#1e293b" fontSize={60}>⬡</text>
            <text x="50%" y="52%" textAnchor="middle" fill="#475569" fontSize={15} fontFamily="Inter, sans-serif">
              Click anywhere to add a node
            </text>
            <text x="50%" y="57.5%" textAnchor="middle" fill="#334155" fontSize={12} fontFamily="Inter, sans-serif">
              Or pick a Template from the sidebar →
            </text>
          </g>
        )}
      </svg>

      {/* Zoom controls */}
      <div className="canvas-controls">
        <button className="btn btn-ghost btn-icon" title="Zoom in  (scroll up)" onClick={() => setZoom(z => Math.min(4, z * 1.2))}>+</button>
        <span className="zoom-label">{Math.round(zoom * 100)}%</span>
        <button className="btn btn-ghost btn-icon" title="Zoom out  (scroll down)" onClick={() => setZoom(z => Math.max(0.25, z / 1.2))}>−</button>
        <button className="btn btn-ghost btn-icon" title="Reset view" onClick={resetView} style={{ fontSize: 12 }}>⊡</button>
      </div>

      {/* Hint bar */}
      {!vizActive && (
        <div className="canvas-hint">
          <span>Click = add node</span>
          <span>·</span>
          <span>Drag = move node</span>
          <span>·</span>
          <span>Right-click = options</span>
          <span>·</span>
          <span>Alt+drag = pan</span>
          <span>·</span>
          <span>Scroll = zoom</span>
        </div>
      )}
    </div>
  )
}
