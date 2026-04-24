const PATHS = {
  // Playback controls
  play:          'M5 3l14 9-14 9V3z',
  pause:         'M6 4h4v16H6zm8 0h4v16h-4z',
  skipBack:      'M19 20L9 12l10-8v16zM5 4v16',
  skipFwd:       'M5 4l10 8-10 8V4zM19 4v16',
  reset:         'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8',
  // Common UI
  plus:          'M12 5v14M5 12h14',
  trash:         'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  edit:          'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  link:          'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  menu:          'M3 6h18M3 12h18M3 18h18',
  zap:           'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  undo:          'M3 7v6h6M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13',
  redo:          'M21 7v6h-6M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13',
  info:          'M12 16v-4M12 8h.01',
  x:             'M18 6 6 18M6 6l12 12',
  check:         'M20 6 9 17l-5-5',
  shuffle:       'M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5',
  // Graph canvas icons
  nodes:         'M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM3 16a3 3 0 1 0 6 0 3 3 0 0 0-6 0zM15 16a3 3 0 1 0 6 0 3 3 0 0 0-6 0zM12 8v4M7.5 14.5l3 1.5M16.5 14.5l-3 1.5',
  // Badges
  clock:         'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2',
  layers:        'M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  // Copy button
  clipboard:     'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 2h6v4H9z',
  // Mode toggle
  hexagon:       'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  barChart:      'M18 20V10M12 20V4M6 20v-6',
  // Sidebar algo icons
  star:          'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  gitFork:       'M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 9v3a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9',
  arrowUpDown:   'M12 2v20M5 9l7-7 7 7M5 15l7 7 7-7',
  scope:         'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0z',
  logIn:         'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3',
  search:        'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35',
  splitH:        'M8 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3M12 3v18',
  // Step-type icons (used in step callout & step bar)
  eye:           'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  turnRight:     'M15 14l5-5-5-5M4 20v-7a4 4 0 0 1 4-4h12',
  turnLeft:      'M9 14l-5-5 5-5M20 20v-7a4 4 0 0 0-4-4H4',
  checkCircle:   'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
  xCircle:       'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM15 9l-6 6M9 9l6 6',
  arrowDown:     'M12 5v14M5 12l7 7 7-7',
  arrowLeft:     'M19 12H5M12 19l-7-7 7-7',
  arrowRight:    'M5 12h14M12 5l7 7-7 7',
  swapArrows:    'M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4',
  key:           'M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 11v8M11 15H8M11 13H8',
  pin:           'M12 22V12M8 8a4 4 0 0 0 8 0M6 8h12',
  sparkles:      'M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z',
  plusCircle:    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 8v8M8 12h8',
  chevronsRight: 'M13 17l5-5-5-5M6 17l5-5-5-5',
  circle:        'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z',
  activity:      'M22 12h-4l-3 9L9 3l-3 9H2',
  // Drag handle
  gripVertical:  'M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01',
}

export default function Icon({ name, size = 14, color = 'currentColor', strokeWidth = 2, filled = false }) {
  const d = PATHS[name]
  if (!d) return null
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? color : 'none'}
      stroke={filled ? 'none' : color}
      strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path d={d} />
    </svg>
  )
}
