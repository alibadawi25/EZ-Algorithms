import { useEffect, useRef } from 'react'
import Icon from './Icon'

function ModalBase({ onClose, children }) {
  useEffect(() => {
    const h = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export function AddNodeModal({ pos, onConfirm, onClose }) {
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus() }, [])

  function submit(e) {
    e.preventDefault()
    const val = ref.current?.value?.trim()
    if (val) onConfirm(val)
  }

  return (
    <ModalBase onClose={onClose}>
      <div className="modal-header">
        <h3>Add Node</h3>
        <button className="btn btn-ghost btn-icon" onClick={onClose}><Icon name="x" size={14} /></button>
      </div>
      <p className="modal-hint">Position: ({Math.round(pos.x)}, {Math.round(pos.y)})</p>
      <form onSubmit={submit}>
        <input ref={ref} className="modal-input" placeholder="Label (e.g. A, 42, start)" autoFocus />
        <div className="modal-actions">
          <button type="submit" className="btn btn-success" style={{ flex: 1 }}>Add Node</button>
          <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        </div>
      </form>
    </ModalBase>
  )
}

export function EditNodeModal({ value, onConfirm, onClose }) {
  const ref = useRef(null)
  useEffect(() => { if (ref.current) { ref.current.value = value; ref.current.select() } }, [value])

  function submit(e) {
    e.preventDefault()
    const val = ref.current?.value?.trim()
    if (val) onConfirm(val)
  }

  return (
    <ModalBase onClose={onClose}>
      <div className="modal-header">
        <h3>Edit Node</h3>
        <button className="btn btn-ghost btn-icon" onClick={onClose}><Icon name="x" size={14} /></button>
      </div>
      <form onSubmit={submit}>
        <input ref={ref} className="modal-input" defaultValue={value} autoFocus />
        <div className="modal-actions">
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
          <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        </div>
      </form>
    </ModalBase>
  )
}

export function ContextMenu({ x, y, onSetStart, onEdit, onConnect, onDelete, onClose }) {
  useEffect(() => {
    const h = () => onClose()
    window.addEventListener('click', h)
    return () => window.removeEventListener('click', h)
  }, [onClose])

  return (
    <div className="ctx-menu" style={{ left: x, top: y }} onClick={e => e.stopPropagation()}>
      <button className="ctx-item ctx-green"  onClick={onSetStart}><Icon name="target" size={14} color="#34d399" /> Set as Start</button>
      <button className="ctx-item ctx-blue"   onClick={onEdit}>    <Icon name="edit"   size={14} color="#38bdf8" /> Edit Value</button>
      <button className="ctx-item ctx-purple" onClick={onConnect}>  <Icon name="link"   size={14} color="#a78bfa" /> Connect from Here</button>
      <div className="ctx-sep" />
      <button className="ctx-item ctx-red"    onClick={onDelete}>   <Icon name="trash"  size={14} color="#f87171" /> Delete Node</button>
    </div>
  )
}
