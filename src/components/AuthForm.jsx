import { useState } from 'react'
import { apiFetch } from '../utils/api'
const API_URL = "https://todo-backend-production-261e.up.railway.app";

export default function AuthForm({ mode, onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const title = mode === 'register' ? 'Register' : 'Login'

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      // ถ้าอยู่โหมดสมัครสมาชิก → เรียก register ที่ backend
      if (mode === 'register') {
        await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
          credentials: 'include', // ถ้า backend ใช้ session/cookie
        });
      }

      // จากนั้นเรียก login ที่ backend ตัวเดียวกัน
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      onSuccess(res);
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
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

