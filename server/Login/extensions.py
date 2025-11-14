import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS


db = SQLAlchemy()
migrate = Migrate()


def init_extensions(app):
    # Allow dev hosts and any additional comma-separated ALLOWED_ORIGINS from env (for Render)
default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://todo-frontend-production-a24d.up.railway.app",  # 👈 ใส่ของโอนี่จังตรงนี้
]
    extra = [o.strip() for o in os.environ.get("ALLOWED_ORIGINS", "").split(",") if o.strip()]
    origins = default_origins + extra

    CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": origins}})
    db.init_app(app)
    migrate.init_app(app, db)


