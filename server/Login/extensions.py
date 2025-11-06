from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS


db = SQLAlchemy()
migrate = Migrate()


def init_extensions(app):
    # Enable CORS for local React (Vite dev: http://localhost:3000, 5173; 127.0.0.1 too)
    CORS(app, supports_credentials=True, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:5173",
                "http://127.0.0.1:5173",
            ]
        }
    })
    db.init_app(app)
    migrate.init_app(app, db)


