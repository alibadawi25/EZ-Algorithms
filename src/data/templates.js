export const TEMPLATES = {
  bst: {
    nodes: [
      { id: 1, value: '50', x: 440, y: 110 },
      { id: 2, value: '30', x: 280, y: 230 },
      { id: 3, value: '70', x: 600, y: 230 },
      { id: 4, value: '20', x: 190, y: 350 },
      { id: 5, value: '40', x: 370, y: 350 },
      { id: 6, value: '60', x: 510, y: 350 },
      { id: 7, value: '80', x: 690, y: 350 },
    ],
    edges: [
      { id: 1, from: 1, to: 2 }, { id: 2, from: 1, to: 3 },
      { id: 3, from: 2, to: 4 }, { id: 4, from: 2, to: 5 },
      { id: 5, from: 3, to: 6 }, { id: 6, from: 3, to: 7 },
    ],
    startId: 1,
  },
  graph: {
    nodes: [
      { id: 1, value: 'A', x: 170, y: 260 },
      { id: 2, value: 'B', x: 340, y: 150 },
      { id: 3, value: 'C', x: 340, y: 370 },
      { id: 4, value: 'D', x: 510, y: 260 },
      { id: 5, value: 'E', x: 680, y: 150 },
      { id: 6, value: 'F', x: 680, y: 370 },
    ],
    edges: [
      { id: 1, from: 1, to: 2 }, { id: 2, from: 1, to: 3 },
      { id: 3, from: 2, to: 4 }, { id: 4, from: 3, to: 4 },
      { id: 5, from: 4, to: 5 }, { id: 6, from: 4, to: 6 },
      { id: 7, from: 5, to: 6 },
    ],
    startId: 1,
  },
}
