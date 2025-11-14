import { useState } from 'react'
import AuthForm from './AuthForm'

export default function AuthWrapper({ onSuccess }) {
  const [mode, setMode] = useState('login')

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
      <AuthForm mode={mode} onSuccess={onSuccess} />
    </div>
  )
}

