import { useState, useRef, useCallback } from 'react'

let UID = 100
const uid = () => ++UID

export function useGraph(initialNodes = [], initialEdges = [], initialStart = null) {
  const [nodes,      setNodes]      = useState(initialNodes)
  const [edges,      setEdges]      = useState(initialEdges)
  const [startId,    setStartId]    = useState(initialStart ?? initialNodes[0]?.id ?? null)
  const [connecting, setConnecting] = useState(null)   // sourceNodeId
  const [selected,   setSelected]   = useState(null)
  const [dragging,   setDragging]   = useState(null)   // { id, ox, oy }
  const [mousePos,   setMousePos]   = useState({ x: 0, y: 0 }) // for connect preview
  const [hovered,    setHovered]    = useState(null)
  // undo stack
  const history = useRef([])
  const future  = useRef([])

  const snapshot = useCallback(() => {
    history.current.push({ nodes: nodes.map(n => ({...n})), edges: edges.map(e => ({...e})) })
    if (history.current.length > 40) history.current.shift()
    future.current = []
  }, [nodes, edges])

  const undo = useCallback(() => {
    if (!history.current.length) return
    future.current.push({ nodes: nodes.map(n => ({...n})), edges: edges.map(e => ({...e})) })
    const prev = history.current.pop()
    setNodes(prev.nodes)
    setEdges(prev.edges)
  }, [nodes, edges])

  const redo = useCallback(() => {
    if (!future.current.length) return
    history.current.push({ nodes: nodes.map(n => ({...n})), edges: edges.map(e => ({...e})) })
    const next = future.current.pop()
    setNodes(next.nodes)
    setEdges(next.edges)
  }, [nodes, edges])

  const addNode = useCallback((value, x, y) => {
    snapshot()
    const id = uid()
    setNodes(p => [...p, { id, value, x, y }])
    if (!startId) setStartId(id)
    return id
  }, [snapshot, startId])

  const updateNode = useCallback((id, value) => {
    snapshot()
    setNodes(p => p.map(n => n.id === id ? { ...n, value } : n))
  }, [snapshot])

  const deleteNode = useCallback((id) => {
    snapshot()
    setNodes(p => p.filter(n => n.id !== id))
    setEdges(p => p.filter(e => e.from !== id && e.to !== id))
    if (startId === id) setStartId(null)
    if (selected === id) setSelected(null)
    if (connecting === id) setConnecting(null)
  }, [snapshot, startId, selected, connecting])

  const addEdge = useCallback((from, to) => {
    if (from === to) return
    const exists = edges.some(e =>
      (e.from === from && e.to === to) || (e.from === to && e.to === from))
    if (exists) return
    snapshot()
    setEdges(p => [...p, { id: uid(), from, to }])
  }, [edges, snapshot])

  const deleteEdge = useCallback((edgeId) => {
    snapshot()
    setEdges(p => p.filter(e => e.id !== edgeId))
  }, [snapshot])

  const load = useCallback((newNodes, newEdges, newStart) => {
    history.current = []
    future.current  = []
    setNodes(newNodes.map(n => ({...n})))
    setEdges(newEdges.map(e => ({...e})))
    setStartId(newStart ?? newNodes[0]?.id ?? null)
    setSelected(null)
    setConnecting(null)
    setDragging(null)
  }, [])

  const moveNode = useCallback((id, x, y) => {
    setNodes(p => p.map(n => n.id === id ? { ...n, x, y } : n))
  }, [])

  const clearGraph = useCallback(() => {
    snapshot()
    setNodes([])
    setEdges([])
    setStartId(null)
  }, [snapshot])

  return {
    nodes, edges, startId, setStartId,
    connecting, setConnecting,
    selected,   setSelected,
    dragging,   setDragging,
    mousePos,   setMousePos,
    hovered,    setHovered,
    addNode, updateNode, deleteNode,
    addEdge, deleteEdge,
    load, moveNode, clearGraph,
    undo, redo,
    canUndo: history.current.length > 0,
    canRedo: future.current.length > 0,
  }
}
