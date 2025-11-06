import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`
  const resp = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const isJson = resp.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await resp.json() : null
  if (!resp.ok) {
    const err = new Error('Request failed')
    err.status = resp.status
    err.body = data
    throw err
  }
  return data
}

function AuthForm({ mode, onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const title = mode === 'register' ? 'Register' : 'Login'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'register') {
        await apiFetch('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ username, password }),
        })
      }
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })
      onSuccess(res)
    } catch (err) {
      setError(err.body?.error || 'Failed')
    }
  }

  return (
    <div className="card auth-card">
      <h2 style={{ marginBottom: 12 }}>{title}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">{title}</button>
          {error && <div style={{ color: 'crimson' }}>{error}</div>}
        </div>
      </form>
    </div>
  )
}

function TodoApp({ user, onLoggedOut }) {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/api/todos')
      setTodos(data)
    } catch (err) {
      setError('โหลดรายการไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function addTodo(e) {
    e.preventDefault()
    setError('')
    try {
      const created = await apiFetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ title, dueDate: dueDate || null }),
      })
      setTodos((prev) => [created, ...prev])
      setTitle('')
      setDueDate('')
    } catch (err) {
      setError('เพิ่มงานไม่สำเร็จ')
    }
  }

  async function toggle(id, isCompleted) {
    try {
      const updated = await apiFetch(`/api/todos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isCompleted: !isCompleted }),
      })
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch {}
  }

  async function removeTodo(id) {
    try {
      await apiFetch(`/api/todos/${id}`, { method: 'DELETE' })
      setTodos((prev) => prev.filter((t) => t.id !== id))
    } catch {}
  }

  async function logout() {
    await apiFetch('/api/auth/logout', { method: 'POST' })
    onLoggedOut()
  }

  return (
    <div style={{ maxWidth: 700, margin: '24px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>สวัสดี, {user.username}</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <form onSubmit={addTodo} style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
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
      {loading ? (
        <div>กำลังโหลด...</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {todos.map((t) => (
            <li key={t.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="checkbox" checked={t.isCompleted} onChange={() => toggle(t.id, t.isCompleted)} />
              <span style={{ textDecoration: t.isCompleted ? 'line-through' : 'none' }}>{t.title}</span>
              <span style={{ color: '#888', marginLeft: 'auto' }}>{t.dueDate || '-'}</span>
              <button onClick={() => removeTodo(t.id)} aria-label="delete" title="ลบงาน">ลบ</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [mode, setMode] = useState('login')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const me = await apiFetch('/api/auth/me')
        setUser(me)
      } catch {}
      setChecking(false)
    })()
  }, [])

  if (checking) return <div style={{ padding: 24 }}>กำลังตรวจสอบสถานะ...</div>

  if (!user) {
    return (
      <div className="auth-wrap" style={{ padding: 24 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setMode('login')} disabled={mode === 'login'}>
            Login
          </button>
          <button onClick={() => setMode('register')} disabled={mode === 'register'}>
            Register
          </button>
        </div>
        <AuthForm mode={mode} onSuccess={setUser} />
      </div>
    )
  }

  return <TodoApp user={user} onLoggedOut={() => setUser(null)} />
}

export default App
