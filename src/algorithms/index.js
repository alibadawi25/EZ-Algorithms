// ── BFS ────────────────────────────────────────────────────────────────────
export function genBFS(nodes, edges, startId) {
  const adj = {}
  nodes.forEach(n => { adj[n.id] = [] })
  edges.forEach(e => { adj[e.from]?.push(e.to); adj[e.to]?.push(e.from) })
  const lbl = id => nodes.find(n => n.id === id)?.value ?? id
  const steps = []
  const visited = new Set([startId])
  const queue = [startId]

  steps.push({ visited: new Set(visited), queue: [...queue], current: startId,
    desc: `Start BFS at "${lbl(startId)}". Mark visited, add to queue.`, type: 'init', line: 1 })

  while (queue.length) {
    const curr = queue.shift()
    steps.push({ visited: new Set(visited), queue: [...queue], current: curr,
      desc: `Dequeue "${lbl(curr)}". Queue: [${queue.map(lbl).join(', ') || 'empty'}]`,
      type: 'process', line: 4 })

    for (const nb of [...(adj[curr] || [])].sort()) {
      if (!visited.has(nb)) {
        visited.add(nb); queue.push(nb)
        steps.push({ visited: new Set(visited), queue: [...queue], current: curr, exploring: nb,
          desc: `"${lbl(nb)}" not visited — enqueue it. Queue: [${queue.map(lbl).join(', ')}]`,
          type: 'enqueue', line: 8 })
      } else {
        steps.push({ visited: new Set(visited), queue: [...queue], current: curr, skipped: nb,
          desc: `"${lbl(nb)}" already visited — skip.`, type: 'skip', line: 7 })
      }
    }
  }
  steps.push({ visited: new Set(visited), queue: [], current: null,
    desc: 'BFS complete! All reachable nodes visited.', type: 'done', line: 10 })
  return steps
}

// ── DFS ────────────────────────────────────────────────────────────────────
export function genDFS(nodes, edges, startId) {
  const adj = {}
  nodes.forEach(n => { adj[n.id] = [] })
  edges.forEach(e => { adj[e.from]?.push(e.to); adj[e.to]?.push(e.from) })
  const lbl = id => nodes.find(n => n.id === id)?.value ?? id
  const steps = []
  const visited = new Set()
  const stk = []

  function dfs(id, depth) {
    visited.add(id); stk.push(id)
    steps.push({ visited: new Set(visited), current: id, backtracking: false, stack: [...stk],
      desc: `Visit "${lbl(id)}" (depth ${depth}). Stack: [${stk.map(lbl).join(' → ')}]`,
      type: 'visit', line: 1 })

    for (const nb of [...(adj[id] || [])].sort()) {
      if (!visited.has(nb)) {
        steps.push({ visited: new Set(visited), current: id, exploring: nb, stack: [...stk],
          desc: `From "${lbl(id)}" — dive into "${lbl(nb)}"`, type: 'recurse', line: 4 })
        dfs(nb, depth + 1)
      } else {
        steps.push({ visited: new Set(visited), current: id, skipped: nb, stack: [...stk],
          desc: `"${lbl(nb)}" already visited — skip.`, type: 'skip', line: 3 })
      }
    }
    stk.pop()
    steps.push({ visited: new Set(visited), current: id, backtracking: true, stack: [...stk],
      desc: `Backtrack from "${lbl(id)}"${stk.length ? ` → return to "${lbl(stk[stk.length - 1])}"` : ' (done)'}`,
      type: 'backtrack', line: 6 })
  }

  dfs(startId, 0)
  steps.push({ visited: new Set(visited), current: null,
    desc: 'DFS complete! All reachable nodes visited.', type: 'done', line: 7 })
  return steps
}

// ── Bubble Sort ────────────────────────────────────────────────────────────
export function genBubble(arr) {
  const steps = []
  const a = [...arr]
  const n = a.length
  const sorted = new Set()

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ array: [...a], comparing: [j, j + 1], swapped: null, sorted: new Set(sorted),
        desc: `Compare a[${j}]=${a[j]} and a[${j + 1}]=${a[j + 1]}`, type: 'compare', line: 4 })
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        steps.push({ array: [...a], comparing: [], swapped: [j, j + 1], sorted: new Set(sorted),
          desc: `${a[j + 1]} > ${a[j]} — swap! Array: [${a.join(', ')}]`, type: 'swap', line: 5 })
      }
    }
    sorted.add(n - 1 - i)
    steps.push({ array: [...a], comparing: [], swapped: null, sorted: new Set(sorted),
      desc: `${a[n - 1 - i]} is now in its final position`, type: 'place', line: 2 })
  }
  sorted.add(0)
  steps.push({ array: [...a], comparing: [], swapped: null,
    sorted: new Set(Array.from({ length: n }, (_, i) => i)),
    desc: 'Array is fully sorted!', type: 'done', line: 6 })
  return steps
}

// ── Selection Sort ─────────────────────────────────────────────────────────
export function genSelectionSort(arr) {
  const steps = []
  const a = [...arr]
  const n = a.length
  const sorted = new Set()

  for (let i = 0; i < n - 1; i++) {
    let minI = i
    steps.push({ array: [...a], minIdx: minI, scanIdx: null, swapped: null, sorted: new Set(sorted),
      desc: `Pass ${i + 1}: assume a[${i}]=${a[i]} is the minimum.`, type: 'init', line: 3 })

    for (let j = i + 1; j < n; j++) {
      steps.push({ array: [...a], minIdx: minI, scanIdx: j, swapped: null, sorted: new Set(sorted),
        desc: `Scan a[${j}]=${a[j]}. Current min: a[${minI}]=${a[minI]}`, type: 'compare', line: 4 })
      if (a[j] < a[minI]) {
        minI = j
        steps.push({ array: [...a], minIdx: minI, scanIdx: j, swapped: null, sorted: new Set(sorted),
          desc: `New minimum found! a[${j}]=${a[j]} is smaller`, type: 'newMin', line: 6 })
      }
    }

    if (minI !== i) {
      ;[a[i], a[minI]] = [a[minI], a[i]]
      steps.push({ array: [...a], minIdx: i, scanIdx: minI, swapped: [i, minI], sorted: new Set(sorted),
        desc: `Swap a[${i}] and a[${minI}]. Minimum ${a[i]} goes to position ${i}.`, type: 'swap', line: 7 })
    } else {
      steps.push({ array: [...a], minIdx: i, scanIdx: null, swapped: null, sorted: new Set(sorted),
        desc: `a[${i}]=${a[i]} is already the minimum — no swap needed.`, type: 'place', line: 7 })
    }
    sorted.add(i)
  }
  sorted.add(n - 1)
  steps.push({ array: [...a], minIdx: null, scanIdx: null, swapped: null,
    sorted: new Set(Array.from({ length: n }, (_, i) => i)),
    desc: 'Array is fully sorted!', type: 'done', line: 8 })
  return steps
}

// ── Insertion Sort ─────────────────────────────────────────────────────────
export function genInsertionSort(arr) {
  const steps = []
  const a = [...arr]
  const n = a.length
  const sorted = new Set([0])

  steps.push({ array: [...a], keyIdx: null, shiftIdx: null, sorted: new Set(sorted),
    desc: `Start: a[0]=${a[0]} is already sorted by itself.`, type: 'init', line: 1 })

  for (let i = 1; i < n; i++) {
    const key = a[i]
    steps.push({ array: [...a], keyIdx: i, shiftIdx: null, sorted: new Set(sorted),
      desc: `Pick key = a[${i}] = ${key}. Insert it into the sorted left portion.`, type: 'pick', line: 2 })

    let j = i - 1
    let shifted = false
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j]
      steps.push({ array: [...a], keyIdx: i, shiftIdx: j, sorted: new Set(sorted),
        desc: `a[${j}]=${a[j + 1]} > ${key} — shift it one step right.`, type: 'shift', line: 5 })
      j--
      shifted = true
    }
    a[j + 1] = key
    sorted.add(i)
    steps.push({ array: [...a], keyIdx: j + 1, shiftIdx: null, sorted: new Set(sorted),
      desc: shifted
        ? `Place key ${key} at position ${j + 1}. Sorted: [${a.slice(0, i + 1).join(', ')}]`
        : `Key ${key} is already in place.`,
      type: 'insert', line: 7 })
  }

  steps.push({ array: [...a], keyIdx: null, shiftIdx: null,
    sorted: new Set(Array.from({ length: n }, (_, i) => i)),
    desc: 'Array is fully sorted!', type: 'done', line: 8 })
  return steps
}

// ── Linear Search ──────────────────────────────────────────────────────────
export function genLinearSearch(arr, target) {
  const steps = []
  const a = [...arr]
  const checked = new Set()

  steps.push({ array: a, current: -1, found: false, notFound: false, checked: new Set(), target,
    desc: `Search for ${target} in [${a.join(', ')}]. Check each element left to right.`,
    type: 'init', line: 1 })

  for (let i = 0; i < a.length; i++) {
    steps.push({ array: a, current: i, found: false, notFound: false, checked: new Set(checked), target,
      desc: `Check a[${i}] = ${a[i]}${a[i] === target ? ' — match!' : ' ≠ ' + target + ', keep going'}`,
      type: 'check', line: 2 })

    if (a[i] === target) {
      steps.push({ array: a, current: i, found: true, notFound: false, checked: new Set(checked), target,
        desc: `Found ${target} at index ${i}!`, type: 'found', line: 3 })
      return steps
    }
    checked.add(i)
  }

  steps.push({ array: a, current: -1, found: false, notFound: true, checked: new Set(checked), target,
    desc: `${target} is not in the array. Searched all ${a.length} elements.`,
    type: 'not-found', line: 4 })
  return steps
}

// ── Binary Search ──────────────────────────────────────────────────────────
export function genBinarySearch(arr, target) {
  const steps = []
  const a = [...arr].sort((x, y) => x - y)
  let lo = 0, hi = a.length - 1

  steps.push({ array: a, lo, hi, mid: -1, target, found: false, notFound: false,
    desc: `Binary search for ${target}. Array sorted. lo=0, hi=${a.length - 1}`,
    type: 'init', line: 1 })

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    steps.push({ array: a, lo, hi, mid, target, found: false, notFound: false,
      desc: `mid = (${lo}+${hi})÷2 = ${mid}. Check a[${mid}] = ${a[mid]}`,
      type: 'check', line: 3 })

    if (a[mid] === target) {
      steps.push({ array: a, lo, hi, mid, target, found: true, notFound: false,
        desc: `Found ${target} at index ${mid}!`, type: 'found', line: 4 })
      return steps
    } else if (a[mid] < target) {
      steps.push({ array: a, lo, hi, mid, target, found: false, notFound: false,
        desc: `a[${mid}]=${a[mid]} < ${target} — search right half. lo = ${mid + 1}`,
        type: 'right', line: 6 })
      lo = mid + 1
    } else {
      steps.push({ array: a, lo, hi, mid, target, found: false, notFound: false,
        desc: `a[${mid}]=${a[mid]} > ${target} — search left half. hi = ${mid - 1}`,
        type: 'left', line: 8 })
      hi = mid - 1
    }
  }

  steps.push({ array: a, lo, hi, mid: -1, target, found: false, notFound: true,
    desc: `${target} not found in the array.`, type: 'not-found', line: 9 })
  return steps
}
