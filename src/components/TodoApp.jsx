import { useEffect, useState } from 'react'
import { apiFetch } from '../utils/api'
import TodoForm from './TodoForm'
import TodoItem from './TodoItem'

export default function TodoApp({ user, onLoggedOut }) {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
 // ป้องกันกรณี todos ไม่ใช่ array (เช่น เป็น null)
  const safeTodos = Array.isArray(todos) ? todos : []
  
  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/api/todos')

      // กันไว้ ไม่ให้เราเอาของที่ไม่ใช่ array ไป map
      let list = Array.isArray(data) ? data : []

      // เผื่อกรณี backend ส่งรูปแบบ { todos: [...] }
      if (!Array.isArray(list) && data && Array.isArray(data.todos)) {
        list = data.todos
      }

      setTodos(list)
    } catch (err) {
      setError('โหลดรายการไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    load()
  }, [])

  async function addTodo({ title, dueDate }) {
    setError('')
    try {
      const created = await apiFetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ title, dueDate }),
      })
      setTodos((prev) => [created, ...prev])
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

      <TodoForm onSubmit={addTodo} error={error} />

      {loading ? (
        <div>กำลังโหลด...</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={toggle} onDelete={removeTodo} />
          ))}
        </ul>
      )}
    </div>
  )
}

