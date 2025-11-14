import { useEffect, useState } from 'react'
import './App.css'
import { apiFetch } from './utils/api'
import AuthWrapper from './components/AuthWrapper'
import TodoApp from './components/TodoApp'

function App() {
  const [user, setUser] = useState(null)
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
    return <AuthWrapper onSuccess={setUser} />
  }

  return <TodoApp user={user} onLoggedOut={() => setUser(null)} />
}

export default App
