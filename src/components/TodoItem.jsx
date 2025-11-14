export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li key={todo.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => onToggle(todo.id, todo.isCompleted)}
      />
      <span style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none' }}>
        {todo.title}
      </span>
      <span style={{ color: '#888', marginLeft: 'auto' }}>{todo.dueDate || '-'}</span>
      <button onClick={() => onDelete(todo.id)} aria-label="delete" title="ลบงาน">
        ลบ
      </button>
    </li>
  )
}

