export const T = {
  bg:       '#020617',
  s1:       '#0f172a',
  s2:       '#1e293b',
  s3:       '#293548',
  border:   '#334155',
  border2:  '#475569',
  text:     '#f1f5f9',
  muted:    '#94a3b8',
  subtle:   '#64748b',
  blue:     '#38bdf8',
  blueDim:  '#0ea5e9',
  green:    '#34d399',
  greenDim: '#10b981',
  amber:    '#fbbf24',
  amberDim: '#d97706',
  red:      '#f87171',
  redDim:   '#ef4444',
  purple:   '#a78bfa',
  pink:     '#f472b6',
}

export const NODE_STATES = {
  default:   { fill: 'rgba(56,189,248,.1)',   stroke: '#38bdf8', text: '#38bdf8', glow: false },
  current:   { fill: 'rgba(251,191,36,.18)',  stroke: '#fbbf24', text: '#fbbf24', glow: true  },
  backtrack: { fill: 'rgba(217,119,6,.12)',   stroke: '#d97706', text: '#d97706', glow: false },
  exploring: { fill: 'rgba(56,189,248,.22)',  stroke: '#7dd3fc', text: '#7dd3fc', glow: true  },
  skipped:   { fill: 'rgba(248,113,113,.12)', stroke: '#f87171', text: '#f87171', glow: false },
  visited:   { fill: 'rgba(52,211,153,.15)',  stroke: '#34d399', text: '#34d399', glow: false },
  inactive:  { fill: 'rgba(100,116,139,.06)', stroke: '#475569', text: '#64748b', glow: false },
  hover:     { fill: 'rgba(56,189,248,.18)',  stroke: '#7dd3fc', text: '#f1f5f9', glow: false },
}

export const BAR_STATES = {
  default:   { bg: '#1e293b',                border: '#334155',  text: '#94a3b8' },
  comparing: { bg: 'rgba(251,191,36,.14)',   border: '#fbbf24',  text: '#fbbf24' },
  swapped:   { bg: 'rgba(248,113,113,.14)',  border: '#f87171',  text: '#f87171' },
  sorted:    { bg: 'rgba(52,211,153,.14)',   border: '#34d399',  text: '#34d399' },
  mid:       { bg: 'rgba(251,191,36,.14)',   border: '#fbbf24',  text: '#fbbf24' },
  found:     { bg: 'rgba(52,211,153,.22)',   border: '#34d399',  text: '#34d399' },
  inactive:  { bg: 'rgba(15,23,42,.6)',      border: '#1e293b',  text: '#334155' },
}
