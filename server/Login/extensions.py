import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()


def init_extensions(app):
    # Allow dev hosts and production frontend on Railway
    default_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://todo-frontend-production-a24d.up.railway.app",  # 👈 ของโอนี่จัง
    ]

    # เผื่ออนาคตอยากเพิ่ม origin ผ่าน env
    extra = [
        o.strip()
        for o in os.environ.get("ALLOWED_ORIGINS", "").split(",")
        if o.strip()
    ]
    origins = default_origins + extra

    # เปิด CORS ให้ทุก route แต่ origin ต้องอยู่ใน list ข้างบน
    CORS(
        app,
        origins=origins,
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    db.init_app(app)
    migrate.init_app(app, db)
