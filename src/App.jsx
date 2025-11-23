import { useEffect, useState } from 'react'
import './App.css'
import AuthenticationForm from './components/AuthenticationForm'
import TodoDashboard from './components/TodoDashboard'
import { authenticatedFetch } from './services/apiService'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [authMode, setAuthMode] = useState('login')
  const [isCheckingAuthStatus, setIsCheckingAuthStatus] = useState(true)

  useEffect(() => {
    ; (async () => {
      try {
        const userProfile = await authenticatedFetch('/api/auth/me')
        setCurrentUser(userProfile)
      } catch { }
      setIsCheckingAuthStatus(false)
    })()
  }, [])

  if (isCheckingAuthStatus) return <div style={{ padding: 24 }}>Checking authentication status...</div>

  if (!currentUser) {
    return (
      <div className="auth-wrap" style={{ padding: 24 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setAuthMode('login')} disabled={authMode === 'login'}>
            Login
          </button>
          <button onClick={() => setAuthMode('register')} disabled={authMode === 'register'}>
            Register
          </button>
        </div>
        <AuthenticationForm authMode={authMode} onAuthenticationSuccess={setCurrentUser} />
      </div>
    )
  }

  return <TodoDashboard currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
}

export default App
