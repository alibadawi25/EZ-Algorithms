export default function Toast({ msg, type = 'info' }) {
  const colors = {
    info:    { bg: 'rgba(56,189,248,.15)',  border: 'rgba(56,189,248,.4)',  text: '#38bdf8' },
    success: { bg: 'rgba(52,211,153,.15)',  border: 'rgba(52,211,153,.4)',  text: '#34d399' },
    warn:    { bg: 'rgba(251,191,36,.15)',  border: 'rgba(251,191,36,.4)',  text: '#fbbf24' },
    error:   { bg: 'rgba(248,113,113,.15)', border: 'rgba(248,113,113,.4)', text: '#f87171' },
  }
  const c = colors[type] ?? colors.info

  return (
    <div className="toast" style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
      {msg}
    </div>
  )
}
