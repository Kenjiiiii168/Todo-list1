from datetime import datetime
from sqlalchemy import func
from extensions import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.BigInteger, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now())

    todos = db.relationship('Todo', back_populates='user', cascade='all, delete-orphan')


class Todo(db.Model):
    __tablename__ = 'todos'

    id = db.Column(db.BigInteger, primary_key=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    due_date = db.Column(db.Date)
    is_completed = db.Column(db.Boolean, nullable=False, server_default=db.text('false'))
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    user = db.relationship('User', back_populates='todos')


