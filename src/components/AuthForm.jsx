import { useState } from 'react'
import { apiFetch } from '../utils/api'

export default function AuthForm({ mode, onSuccess }) {
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

