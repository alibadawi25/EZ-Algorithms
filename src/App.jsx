import { useState, useEffect, useCallback, useRef } from "react";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import GraphCanvas from "./components/GraphCanvas";
import ArrayCanvas from "./components/ArrayCanvas";
import RightPanel from "./components/RightPanel";
import FloatingControls from "./components/FloatingControls";
import Toast from "./components/Toast";
import { AddNodeModal, EditNodeModal, ContextMenu } from "./components/Modals";

import { usePlayback } from "./hooks/usePlayback";
import { useGraph } from "./hooks/useGraph";
import {
  genBFS,
  genDFS,
  genBubble,
  genBinarySearch,
  genLinearSearch,
  genSelectionSort,
  genInsertionSort,
} from "./algorithms/index";
import { TEMPLATES } from "./data/templates";

export default function App() {
  const GRAPH_ALGOS = ["bfs", "dfs"];

  // ── mode / algo ──────────────────────────────────────────────────
  const [canvasMode, setCanvasMode] = useState("graph");
  const [algorithm, setAlgorithm] = useState("bfs");

  // ── array ────────────────────────────────────────────────────────
  const [array, setArray] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [rawArr, setRawArr] = useState("38, 27, 43, 3, 9, 82, 10");
  const [searchTgt, setSearchTgt] = useState(43);
  const arrayRef = useRef(array);

  const updateArray = useCallback((next) => {
    setArray((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      arrayRef.current = resolved;
      return resolved;
    });
  }, []);

  // ── UI ───────────────────────────────────────────────────────────
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [toast, setToast] = useState(null); // { msg, type }

  // ── modals ───────────────────────────────────────────────────────
  const [addModal, setAddModal] = useState(null); // { x, y }
  const [editModal, setEditModal] = useState(null); // { nodeId, value }
  const [ctxMenu, setCtxMenu] = useState(null); // { x, y, nodeId, value }

  // ── playback ─────────────────────────────────────────────────────
  const pb = usePlayback();
  const prevSearchTarget = useRef(searchTgt);

  // ── graph ────────────────────────────────────────────────────────
  const tpl = TEMPLATES.bst;
  const graph = useGraph(tpl.nodes, tpl.edges, tpl.startId);

  // ── Toast helper ─────────────────────────────────────────────────
  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  // ── Keyboard shortcuts ───────────────────────────────────────────
  useEffect(() => {
    const h = (e) => {
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      if (e.key === " ") {
        e.preventDefault();
        if (pb.active) pb.togglePlay();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        pb.stepForward();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        pb.stepBack();
      }
      if (e.key === "r" || e.key === "R") handleReset();
      if (e.key === "v" || e.key === "V") handleVisualize();
      if (e.key === "c" || e.key === "C") {
        if (canvasMode === "graph") handleToggleConnect();
      }
      if (e.key === "b" || e.key === "B") setLeftOpen((o) => !o);
      if (e.key === "Escape") {
        setCtxMenu(null);
        setAddModal(null);
        setEditModal(null);
        graph.setConnecting(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        graph.undo();
        showToast("Undone");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        graph.redo();
        showToast("Redone");
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [pb.active, canvasMode]);

  // ── Visualize ────────────────────────────────────────────────────
  function handleVisualize() {
    const currentArray = arrayRef.current;
    if (canvasMode === "graph" && graph.nodes.length === 0) {
      showToast("Add some nodes first!", "warn");
      return;
    }
    pb.clear();
    let s = [];

    if (algorithm === "bfs") {
      s = genBFS(graph.nodes, graph.edges, graph.startId);
    } else if (algorithm === "dfs") {
      s = genDFS(graph.nodes, graph.edges, graph.startId);
    } else if (algorithm === "bubble-sort") {
      s = genBubble(currentArray);
    } else if (algorithm === "selection-sort") {
      s = genSelectionSort(currentArray);
    } else if (algorithm === "insertion-sort") {
      s = genInsertionSort(currentArray);
    } else if (algorithm === "binary-search") {
      const sorted = [...currentArray].sort((a, b) => a - b);
      updateArray(sorted);
      setRawArr(sorted.join(", "));
      s = genBinarySearch(sorted, searchTgt);
    } else if (algorithm === "linear-search") {
      s = genLinearSearch(currentArray, searchTgt);
    }

    pb.load(s);
    showToast(
      "Running " +
        algorithm.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) +
        "…",
      "info",
    );
  }

  function handleReset() {
    pb.clear();
  }

  // ── Sidebar click ────────────────────────────────────────────────
  function handleSidebarItem(item) {
    handleReset();
    if (item.algo) {
      setAlgorithm(item.algo);
      setCanvasMode(GRAPH_ALGOS.includes(item.algo) ? "graph" : "array");
    }
    if (item.canvasMode) setCanvasMode(item.canvasMode);
    if (item.tpl === "bst") {
      graph.load(
        TEMPLATES.bst.nodes,
        TEMPLATES.bst.edges,
        TEMPLATES.bst.startId,
      );
      setCanvasMode("graph");
      showToast("BST template loaded");
    }
    if (item.tpl === "graph") {
      graph.load(
        TEMPLATES.graph.nodes,
        TEMPLATES.graph.edges,
        TEMPLATES.graph.startId,
      );
      setCanvasMode("graph");
      showToast("Graph template loaded");
    }
    if (item.tpl === "array") {
      updateArray([38, 27, 43, 3, 9, 82, 10]);
      setRawArr("38, 27, 43, 3, 9, 82, 10");
      setCanvasMode("array");
    }
  }

  // ── Graph callbacks ──────────────────────────────────────────────
  function handleAddNode(x, y) {
    setAddModal({ x: Math.round(x), y: Math.round(y) });
  }

  function handleConnect(targetId) {
    if (!graph.connecting) return;
    graph.addEdge(graph.connecting, targetId);
    graph.setConnecting(null);
    showToast("Edge added");
  }

  function handleNodeCtx(e, nodeId) {
    const nd = graph.nodes.find((n) => n.id === nodeId);
    setCtxMenu({ x: e.clientX, y: e.clientY, nodeId, value: nd?.value });
  }

  function handleToggleConnect() {
    const next = graph.connecting ? null : (graph.selected ?? null);
    graph.setConnecting(next);
    if (next !== null) showToast("Click a target node to connect");
  }

  // ── Shuffle array ────────────────────────────────────────────────
  function handleShuffle() {
    const a = [...arrayRef.current];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    updateArray(a);
    setRawArr(a.join(", "));
    handleReset();
  }

  useEffect(() => {
    const isSearchAlgo =
      algorithm === "linear-search" || algorithm === "binary-search";
    if (!isSearchAlgo) {
      prevSearchTarget.current = searchTgt;
      return;
    }
    if (prevSearchTarget.current === searchTgt) return;
    prevSearchTarget.current = searchTgt;
    if (pb.active) handleVisualize();
  }, [algorithm, searchTgt, pb.active]);

  useEffect(() => {
    if (
      (algorithm === "linear-search" || algorithm === "binary-search") &&
      array.length > 0 &&
      !array.includes(searchTgt)
    ) {
      setSearchTgt(array[0]);
    }
  }, [algorithm, array, searchTgt]);

  useEffect(() => {
    const targetMode = GRAPH_ALGOS.includes(algorithm) ? "graph" : "array";
    setCanvasMode((prev) => (prev === targetMode ? prev : targetMode));
  }, [algorithm]);

  // ── Derived ──────────────────────────────────────────────────────
  const vizActive = pb.active;
  const step = pb.step;
  const activeLine = vizActive && step ? step.line : -1;

  // Completion effect
  useEffect(() => {
    if (vizActive && step?.type === "done") {
      showToast("Algorithm complete! 🎉", "success");
    }
  }, [step?.type, vizActive]);

  return (
    <div className="app">
      <TopBar
        algorithm={algorithm}
        setAlgorithm={(v) => {
          setAlgorithm(v);
          handleReset();
        }}
        canvasMode={canvasMode}
        setCanvasMode={(v) => {
          setCanvasMode(v);
          handleReset();
          if (v === "array" && GRAPH_ALGOS.includes(algorithm))
            setAlgorithm("bubble-sort");
          if (v === "graph" && !GRAPH_ALGOS.includes(algorithm))
            setAlgorithm("bfs");
        }}
        onVisualize={handleVisualize}
        onReset={handleReset}
        connecting={graph.connecting}
        setConnecting={handleToggleConnect}
        leftOpen={leftOpen}
        setLeftOpen={setLeftOpen}
        rightOpen={rightOpen}
        setRightOpen={setRightOpen}
        vizActive={vizActive}
        nodes={graph.nodes}
        canUndo={graph.canUndo}
        canRedo={graph.canRedo}
        onUndo={() => {
          graph.undo();
          showToast("Undone");
        }}
        onRedo={() => {
          graph.redo();
          showToast("Redone");
        }}
        onShuffle={canvasMode === "array" ? handleShuffle : null}
      />

      <div className="main-layout">
        <Sidebar
          open={leftOpen}
          algorithm={algorithm}
          canvasMode={canvasMode}
          onItem={handleSidebarItem}
        />

        <main className="canvas-area">
          {/* Step description */}
          <div
            className={`step-bar${vizActive && step?.desc ? " step-bar-active" : ""}`}
          >
            {vizActive && step?.desc ? (
              <>
                <span className="step-dot" />
                <span className="step-text" key={step.desc}>
                  {step.desc}
                </span>
              </>
            ) : (
              <span className="step-hint">
                {canvasMode === "graph"
                  ? "Click canvas to add nodes · right-click nodes for options · drag to reposition"
                  : "Edit the array below · click Visualize to run"}
              </span>
            )}
          </div>

          {/* Progress */}
          {vizActive && (
            <div className="progress-bar-wrap">
              <div
                className="progress-bar-fill"
                style={{ width: `${pb.pct}%` }}
              />
            </div>
          )}

          {/* Canvas */}
          <div className="canvas-inner">
            {canvasMode === "graph" ? (
              <GraphCanvas
                nodes={graph.nodes}
                edges={graph.edges}
                startId={graph.startId}
                vizActive={vizActive}
                step={step}
                connecting={graph.connecting}
                onConnect={handleConnect}
                onAddNode={handleAddNode}
                onNodeCtx={handleNodeCtx}
                onMoveNode={graph.moveNode}
                onSelect={graph.setSelected}
                selected={graph.selected}
              />
            ) : (
              <ArrayCanvas
                array={array}
                step={step}
                algorithm={algorithm}
                vizActive={vizActive}
                searchTarget={searchTgt}
                setSearchTarget={setSearchTgt}
                rawArr={rawArr}
                setRawArr={setRawArr}
                setArray={updateArray}
                onShuffle={handleShuffle}
                onReset={handleReset}
              />
            )}

            {/* Floating controls */}
            {vizActive && (
              <FloatingControls
                algorithm={algorithm}
                array={array}
                searchTarget={searchTgt}
                setSearchTarget={setSearchTgt}
                playing={pb.playing}
                onTogglePlay={pb.togglePlay}
                onStepBack={pb.stepBack}
                onStepFwd={pb.stepForward}
                onReset={handleReset}
                idx={pb.idx}
                total={pb.total}
                preset={pb.preset}
                setPreset={pb.setPreset}
                onJump={pb.jumpTo}
                isDone={step?.type === "done"}
              />
            )}
          </div>
        </main>

        <RightPanel
          algorithm={algorithm}
          canvasMode={canvasMode}
          activeLine={activeLine}
          stepType={step?.type}
          stepDesc={step?.desc}
          nodes={graph.nodes}
          startId={graph.startId}
          setStartId={graph.setStartId}
          vizActive={vizActive}
          open={rightOpen}
          setOpen={setRightOpen}
        />
      </div>

      {/* Modals */}
      {addModal && (
        <AddNodeModal
          pos={addModal}
          onConfirm={(val) => {
            graph.addNode(val, addModal.x, addModal.y);
            setAddModal(null);
            showToast(`Node "${val}" added`);
          }}
          onClose={() => setAddModal(null)}
        />
      )}
      {editModal && (
        <EditNodeModal
          value={editModal.value}
          onConfirm={(val) => {
            graph.updateNode(editModal.nodeId, val);
            setEditModal(null);
            showToast("Node updated");
          }}
          onClose={() => setEditModal(null)}
        />
      )}
      {ctxMenu && (
        <ContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          onSetStart={() => {
            graph.setStartId(ctxMenu.nodeId);
            setCtxMenu(null);
            showToast("Start node set");
          }}
          onEdit={() => {
            setEditModal({ nodeId: ctxMenu.nodeId, value: ctxMenu.value });
            setCtxMenu(null);
          }}
          onConnect={() => {
            graph.setConnecting(ctxMenu.nodeId);
            setCtxMenu(null);
            showToast("Click a target node");
          }}
          onDelete={() => {
            graph.deleteNode(ctxMenu.nodeId);
            setCtxMenu(null);
            showToast("Node deleted");
          }}
          onClose={() => setCtxMenu(null)}
        />
      )}

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
