from flask import Flask, jsonify
from config import config_by_name
from extensions import init_extensions, db


def create_app(config_name='default'):
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(config_by_name.get(config_name))
    
    # Initialize extensions
    init_extensions(app)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.todos import todos_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(todos_bp)
    
    # Health check endpoint
    @app.get('/')
    def index():
        return jsonify({"status": "ok", "service": "todo-api"})
    
    return app


# For running directly (development)
if __name__ == "__main__":
    import os
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
