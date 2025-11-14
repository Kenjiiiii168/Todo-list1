import { useState } from 'react'

export default function TodoForm({ onSubmit, error }) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ title, dueDate: dueDate || null })
    setTitle('')
    setDueDate('')
  }

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
        <input
          placeholder="สิ่งที่ต้องทำ"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1 }}
        />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button type="submit">เพิ่ม</button>
      </form>
      {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}
    </>
  )
}

