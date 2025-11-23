from datetime import datetime
from flask import Blueprint, request, session, jsonify
from functools import wraps
from extensions import db
from models import Todo

todos_bp = Blueprint('todos', __name__, url_prefix='/api/todos')


def require_api_authentication(f):
    """Decorator to ensure user is authenticated"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated_function


@todos_bp.post('')
@require_api_authentication
def create_todo_item():
    data = request.get_json(silent=True) or {}
    title = (data.get('title') or '').strip()
    due_date_str = data.get('dueDate')

    if not title or len(title) > 255:
        return jsonify({"error": "invalid_title"}), 400

    due_date = None
    if due_date_str:
        try:
            due_date = datetime.strptime(due_date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"error": "invalid_due_date"}), 400

    todo = Todo(
        user_id=session['user_id'],
        title=title,
        due_date=due_date,
    )
    db.session.add(todo)
    db.session.commit()
    return jsonify({
        "id": todo.id,
        "title": todo.title,
        "dueDate": todo.due_date.isoformat() if todo.due_date else None,
        "isCompleted": bool(todo.is_completed),
    }), 201


@todos_bp.get('')
@require_api_authentication
def get_user_todos():
    todos = Todo.query.filter_by(user_id=session['user_id']).order_by(Todo.created_at.desc()).all()
    return jsonify([
        {
            "id": t.id,
            "title": t.title,
            "dueDate": t.due_date.isoformat() if t.due_date else None,
            "isCompleted": bool(t.is_completed),
        } for t in todos
    ])


@todos_bp.patch('/<int:todo_id>')
@require_api_authentication
def update_todo_item(todo_id: int):
    todo = Todo.query.filter_by(id=todo_id, user_id=session['user_id']).first()
    if not todo:
        return jsonify({"error": "not_found"}), 404

    data = request.get_json(silent=True) or {}
    if 'title' in data:
        title = (data.get('title') or '').strip()
        if not title or len(title) > 255:
            return jsonify({"error": "invalid_title"}), 400
        todo.title = title
    if 'dueDate' in data:
        due_date_str = data.get('dueDate')
        if due_date_str is None or due_date_str == "":
            todo.due_date = None
        else:
            try:
                todo.due_date = datetime.strptime(due_date_str, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({"error": "invalid_due_date"}), 400
    if 'isCompleted' in data:
        todo.is_completed = bool(data.get('isCompleted'))

    db.session.commit()
    return jsonify({
        "id": todo.id,
        "title": todo.title,
        "dueDate": todo.due_date.isoformat() if todo.due_date else None,
        "isCompleted": bool(todo.is_completed),
    })


@todos_bp.delete('/<int:todo_id>')
@require_api_authentication
def delete_todo_item(todo_id: int):
    todo = Todo.query.filter_by(id=todo_id, user_id=session['user_id']).first()
    if not todo:
        return jsonify({"error": "not_found"}), 404
    db.session.delete(todo)
    db.session.commit()
    return ("", 204)
