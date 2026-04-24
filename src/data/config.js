// Sidebar sections — BST removed (use templates instead; graph mode covers it)
export const SIDEBAR_SECTIONS = [
  {
    label: "Graph Algorithms",
    items: [
      {
        id: "bfs",
        name: "BFS",
        sub: "Level-by-level traversal",
        icon: "nodes",
        color: "#38bdf8",
        algo: "bfs",
        canvasMode: "graph",
        description:
          "Visits every node closest to the start first, like ripples in a pond. Great for finding shortest paths.",
        complexity: { time: "O(V+E)", space: "O(V)" },
      },
      {
        id: "dfs",
        name: "DFS",
        sub: "Deep-dive then backtrack",
        icon: "gitFork",
        color: "#a78bfa",
        algo: "dfs",
        canvasMode: "graph",
        description:
          "Dives as deep as possible before backtracking. Like exploring a maze — keep going until you hit a dead end.",
        complexity: { time: "O(V+E)", space: "O(V)" },
      },
    ],
  },
  {
    label: "Sorting",
    items: [
      {
        id: "bubble",
        name: "Bubble Sort",
        sub: "Swap adjacent pairs",
        icon: "arrowUpDown",
        color: "#fbbf24",
        algo: "bubble-sort",
        canvasMode: "array",
        description:
          "Compares side-by-side elements and swaps them if out of order. Repeats until nothing swaps.",
        complexity: { time: "O(n²)", space: "O(1)" },
      },
      {
        id: "selection",
        name: "Selection Sort",
        sub: "Find & place minimum",
        icon: "scope",
        color: "#f472b6",
        algo: "selection-sort",
        canvasMode: "array",
        description:
          "Scans for the smallest element and places it at the front, then repeats for the rest.",
        complexity: { time: "O(n²)", space: "O(1)" },
      },
      {
        id: "insertion",
        name: "Insertion Sort",
        sub: "Build sorted left side",
        icon: "logIn",
        color: "#34d399",
        algo: "insertion-sort",
        canvasMode: "array",
        description:
          "Builds a sorted portion one element at a time, like sorting cards in your hand.",
        complexity: { time: "O(n²)", space: "O(1)" },
      },
    ],
  },
  {
    label: "Searching",
    items: [
      {
        id: "linear-search",
        name: "Linear Search",
        sub: "Check one by one",
        icon: "arrowRight",
        color: "#fb923c",
        algo: "linear-search",
        canvasMode: "array",
        description:
          "Checks every element in order until it finds the target. Simple but works on unsorted data.",
        complexity: { time: "O(n)", space: "O(1)" },
      },
      {
        id: "binary-search",
        name: "Binary Search",
        sub: "Halve the search space",
        icon: "search",
        color: "#34d399",
        algo: "binary-search",
        canvasMode: "array",
        description:
          "Cuts the array in half each step. Incredibly fast — but only works on sorted arrays.",
        complexity: { time: "O(log n)", space: "O(1)" },
      },
    ],
  },
  {
    label: "Templates",
    items: [
      {
        id: "tpl-bst",
        name: "BST",
        sub: "7-node binary tree",
        icon: "star",
        color: "#f472b6",
        tpl: "bst",
      },
      {
        id: "tpl-graph",
        name: "Sample Graph",
        sub: "6-node graph",
        icon: "star",
        color: "#f472b6",
        tpl: "graph",
      },
      {
        id: "tpl-array",
        name: "Sample Array",
        sub: "7 mixed values",
        icon: "star",
        color: "#f472b6",
        tpl: "array",
      },
    ],
  },
];

export const PSEUDO = {
  bfs: {
    title: "Breadth-First Search",
    complexity: { time: "O(V + E)", space: "O(V)" },
    lines: [
      "def bfs(graph, start):",
      "    visited = {start}",
      "    queue   = deque([start])",
      "    while queue:",
      "        node = queue.popleft()",
      "        visit(node)",
      "        for nb in graph[node]:",
      "            if nb not in visited:",
      "                visited.add(nb)",
      "                queue.append(nb)",
      "    return visited",
    ],
  },
  dfs: {
    title: "Depth-First Search",
    complexity: { time: "O(V + E)", space: "O(V)" },
    lines: [
      "def dfs(graph, node, visited=set()):",
      "    visited.add(node)",
      "    visit(node)",
      "    for nb in graph[node]:",
      "        if nb not in visited:",
      "            dfs(graph, nb, visited)",
      "    # backtrack",
      "    return visited",
    ],
  },
  "bubble-sort": {
    title: "Bubble Sort",
    complexity: { time: "O(n²)", space: "O(1)" },
    lines: [
      "def bubble_sort(arr):",
      "    n = len(arr)",
      "    for i in range(n - 1):",
      "        for j in range(n - i - 1):",
      "            if arr[j] > arr[j + 1]:",
      "                arr[j], arr[j+1] = arr[j+1], arr[j]",
      "    return arr",
    ],
  },
  "selection-sort": {
    title: "Selection Sort",
    complexity: { time: "O(n²)", space: "O(1)" },
    lines: [
      "def selection_sort(arr):",
      "    n = len(arr)",
      "    for i in range(n):",
      "        min_i = i",
      "        for j in range(i + 1, n):",
      "            if arr[j] < arr[min_i]:",
      "                min_i = j",
      "        arr[i], arr[min_i] = arr[min_i], arr[i]",
      "    return arr",
    ],
  },
  "insertion-sort": {
    title: "Insertion Sort",
    complexity: { time: "O(n²)", space: "O(1)" },
    lines: [
      "def insertion_sort(arr):",
      "    for i in range(1, len(arr)):",
      "        key = arr[i]",
      "        j = i - 1",
      "        while j >= 0 and arr[j] > key:",
      "            arr[j + 1] = arr[j]",
      "            j -= 1",
      "        arr[j + 1] = key",
      "    return arr",
    ],
  },
  "linear-search": {
    title: "Linear Search",
    complexity: { time: "O(n)", space: "O(1)" },
    lines: [
      "def linear_search(arr, target):",
      "    for i in range(len(arr)):",
      "        if arr[i] == target:",
      "            return i   # found!",
      "    return -1          # not found",
    ],
  },
  "binary-search": {
    title: "Binary Search",
    complexity: { time: "O(log n)", space: "O(1)" },
    lines: [
      "def binary_search(arr, target):",
      "    lo, hi = 0, len(arr) - 1",
      "    while lo <= hi:",
      "        mid = (lo + hi) // 2",
      "        if arr[mid] == target:",
      "            return mid",
      "        elif arr[mid] < target:",
      "            lo = mid + 1",
      "        else:",
      "            hi = mid - 1",
      "    return -1",
    ],
  },
};

export const GRAPH_LEGENDS = [
  { col: "#fbbf24", label: "Current node" },
  { col: "#34d399", label: "Visited" },
  { col: "#7dd3fc", label: "Being explored" },
  { col: "#f87171", label: "Skipped" },
  { col: "#475569", label: "Not yet reached" },
];

export const ARRAY_LEGENDS = {
  "bubble-sort": [
    { col: "#fbbf24", label: "Comparing" },
    { col: "#f87171", label: "Swapping" },
    { col: "#34d399", label: "Sorted (final pos.)" },
  ],
  "selection-sort": [
    { col: "#f472b6", label: "Current minimum" },
    { col: "#fbbf24", label: "Scanning" },
    { col: "#34d399", label: "Sorted" },
  ],
  "insertion-sort": [
    { col: "#38bdf8", label: "Key element" },
    { col: "#fbbf24", label: "Shifting right" },
    { col: "#34d399", label: "Sorted portion" },
  ],
  "linear-search": [
    { col: "#fbbf24", label: "Checking" },
    { col: "#34d399", label: "Found!" },
    { col: "#475569", label: "Already checked" },
  ],
  "binary-search": [
    { col: "#fbbf24", label: "Mid pointer" },
    { col: "#34d399", label: "Found!" },
    { col: "#475569", label: "Out of range" },
  ],
};
