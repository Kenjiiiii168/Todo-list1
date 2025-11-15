from flask import Flask, request, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from config import config_by_name
from extensions import init_extensions, db
from models import User, Todo

app = Flask(__name__)
app.config.from_object(config_by_name.get('default'))
init_extensions(app)

# --- In-memory users legacy removed; DB is the source of truth ---
with app.app_context():
    db.create_all()

@app.after_request
def add_cors_headers(response):
    # origin ของ frontend ที่ Railway ให้มา
    response.headers["Access-Control-Allow-Origin"] = "https://todo-frontend-production-a24d.up.railway.app"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response

# --- API auth guard ---
def api_login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated_function

# --- Health/Index ---
@app.get('/')
def index():
    return jsonify({"status": "ok", "service": "todo-api"})

# =========================== API (JSON) ===========================

@app.post('/api/auth/register')
def api_register():
    data = request.get_json(silent=True) or {}
    username = (data.get('username') or '').strip()
    password = data.get('password') or ''

    if not username or not password or len(username) < 3 or len(password) < 8:
        return jsonify({"error": "invalid_input"}), 400

    existing = User.query.filter_by(username=username).first()
    if existing:
        return jsonify({"error": "username_taken"}), 400

    user = User(
        username=username,
        password_hash=generate_password_hash(password, method='pbkdf2:sha256')
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"id": user.id, "username": user.username}), 201


@app.post('/api/auth/login')
def api_login():
    data = request.get_json(silent=True) or {}
    username = (data.get('username') or '').strip()
    password = data.get('password') or ''

    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "invalid_credentials"}), 401

    session['user_id'] = user.id
    session.permanent = True
    return jsonify({"message": "logged_in", "username": user.username})


@app.post('/api/auth/logout')
def api_logout():
    session.pop('user_id', None)
    return jsonify({"message": "logged_out"})


@app.get('/api/auth/me')
def api_me():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "unauthorized"}), 401
    user = User.query.get(user_id)
    if not user:
        session.pop('user_id', None)
        return jsonify({"error": "unauthorized"}), 401
    return jsonify({"id": user.id, "username": user.username})


@app.post('/api/todos')
@api_login_required
def api_create_todo():
    data = request.get_json(silent=True) or {}
    title = (data.get('title') or '').strip()
    due_date_str = data.get('dueDate')

    if not title or len(title) > 255:
        return jsonify({"error": "invalid_title"}), 400

    due_date = None
    if due_date_str:
        try:
            from datetime import datetime
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


@app.get('/api/todos')
@api_login_required
def api_list_todos():
    todos = Todo.query.filter_by(user_id=session['user_id']).order_by(Todo.created_at.desc()).all()
    return jsonify([
        {
            "id": t.id,
            "title": t.title,
            "dueDate": t.due_date.isoformat() if t.due_date else None,
            "isCompleted": bool(t.is_completed),
        } for t in todos
    ])


@app.patch('/api/todos/<int:todo_id>')
@api_login_required
def api_update_todo(todo_id: int):
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
                from datetime import datetime
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


@app.delete('/api/todos/<int:todo_id>')
@api_login_required
def api_delete_todo(todo_id: int):
    todo = Todo.query.filter_by(id=todo_id, user_id=session['user_id']).first()
    if not todo:
        return jsonify({"error": "not_found"}), 404
    db.session.delete(todo)
    db.session.commit()
    return ("", 204)

## Legacy template routes removed: login/register/profile (use React frontend)


if __name__ == '__main__':
    app.run(debug=True)
