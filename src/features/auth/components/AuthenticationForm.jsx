import { useState } from 'react'
import { authenticatedFetch } from '../../../services/apiService'

export default function AuthenticationForm({ authMode, onAuthenticationSuccess }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const title = authMode === 'register' ? 'Register' : 'Login'

    async function handleFormSubmit(e) {
        e.preventDefault()
        setErrorMessage('')
        try {
            if (authMode === 'register') {
                await authenticatedFetch('/api/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ username, password }),
                })
            }
            const userProfile = await authenticatedFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            })
            onAuthenticationSuccess(userProfile)
        } catch (err) {
            setErrorMessage(err.body?.error || 'Authentication Failed')
        }
    }

    return (
        <div className="card auth-card">
            <h2 style={{ marginBottom: 12 }}>{title}</h2>
            <form onSubmit={handleFormSubmit}>
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
                    {errorMessage && <div style={{ color: 'crimson' }}>{errorMessage}</div>}
                </div>
            </form>
        </div>
    )
}
