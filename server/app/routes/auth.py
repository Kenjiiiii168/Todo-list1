from flask import Blueprint, request, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db
from models import User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.post('/register')
def register_new_user():
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


@auth_bp.post('/login')
def login_user():
    data = request.get_json(silent=True) or {}
    username = (data.get('username') or '').strip()
    password = data.get('password') or ''

    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "invalid_credentials"}), 401

    session['user_id'] = user.id
    session.permanent = True
    return jsonify({"message": "logged_in", "username": user.username})


@auth_bp.post('/logout')
def logout_user():
    session.pop('user_id', None)
    return jsonify({"message": "logged_out"})


@auth_bp.get('/me')
def get_current_user_profile():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "unauthorized"}), 401
    user = User.query.get(user_id)
    if not user:
        session.pop('user_id', None)
        return jsonify({"error": "unauthorized"}), 401
    return jsonify({"id": user.id, "username": user.username})
