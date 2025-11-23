import { useEffect, useState } from 'react'
import { authenticatedFetch } from '../../../services/apiService'

export default function TodoDashboard({ currentUser, onLogout }) {
    const [todoList, setTodoList] = useState([])
    const [newTodoTitle, setNewTodoTitle] = useState('')
    const [newTodoDueDate, setNewTodoDueDate] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    async function fetchUserTodos() {
        setIsLoading(true)
        setErrorMessage('')
        try {
            const data = await authenticatedFetch('/api/todos')
            setTodoList(data)
        } catch (err) {
            setErrorMessage('Failed to load todos')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUserTodos()
    }, [])

    async function handleCreateTodo(e) {
        e.preventDefault()
        setErrorMessage('')
        try {
            const createdTodo = await authenticatedFetch('/api/todos', {
                method: 'POST',
                body: JSON.stringify({ title: newTodoTitle, dueDate: newTodoDueDate || null }),
            })
            setTodoList((prevTodos) => [createdTodo, ...prevTodos])
            setNewTodoTitle('')
            setNewTodoDueDate('')
        } catch (err) {
            setErrorMessage('Failed to create todo')
        }
    }

    async function handleToggleTodoCompletion(todoId, isCompleted) {
        try {
            const updatedTodo = await authenticatedFetch(`/api/todos/${todoId}`, {
                method: 'PATCH',
                body: JSON.stringify({ isCompleted: !isCompleted }),
            })
            setTodoList((prevTodos) => prevTodos.map((t) => (t.id === todoId ? updatedTodo : t)))
        } catch (err) {
            console.error('Failed to update todo', err)
        }
    }

    async function handleDeleteTodo(todoId) {
        try {
            await authenticatedFetch(`/api/todos/${todoId}`, { method: 'DELETE' })
            setTodoList((prevTodos) => prevTodos.filter((t) => t.id !== todoId))
        } catch (err) {
            console.error('Failed to delete todo', err)
        }
    }

    async function handleLogout() {
        await authenticatedFetch('/api/auth/logout', { method: 'POST' })
        onLogout()
    }

    return (
        <div style={{ maxWidth: 700, margin: '24px auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Hello, {currentUser.username}</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <form onSubmit={handleCreateTodo} style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
                <input
                    placeholder="What needs to be done?"
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    style={{ flex: 1 }}
                />
                <input type="date" value={newTodoDueDate} onChange={(e) => setNewTodoDueDate(e.target.value)} />
                <button type="submit">Add</button>
            </form>
            {errorMessage && <div style={{ color: 'crimson', marginBottom: 8 }}>{errorMessage}</div>}
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {todoList.map((todo) => (
                        <li key={todo.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                checked={todo.isCompleted}
                                onChange={() => handleToggleTodoCompletion(todo.id, todo.isCompleted)}
                            />
                            <span style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none' }}>{todo.title}</span>
                            <span style={{ color: '#888', marginLeft: 'auto' }}>{todo.dueDate || '-'}</span>
                            <button onClick={() => handleDeleteTodo(todo.id)} aria-label="delete" title="Delete Todo">Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
