import os


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'a_super_secret_key_that_is_hard_to_guess')
    
    # Handle DATABASE_URL from Railway/Render (postgres://) or other cloud services
    # Railway/Render will provide DATABASE_URL automatically
    _db_url = os.environ.get('DATABASE_URL')
    
    if not _db_url:
        raise ValueError(
            "DATABASE_URL environment variable is required. "
            "Railway/Render will set this automatically when you add a PostgreSQL database."
        )
    # Convert postgres:// to postgresql+psycopg2:// for SQLAlchemy
    if _db_url.startswith('postgres://'):
        _db_url = _db_url.replace('postgres://', 'postgresql+psycopg2://', 1)
    
    SQLALCHEMY_DATABASE_URI = _db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Session persistence
    SESSION_PERMANENT = True
    # 7 days default if framework reads timedelta via PERMANENT_SESSION_LIFETIME env elsewhere
    # You can tune lifetime in app if needed


class DevConfig(Config):
    DEBUG = True


config_by_name = {
    'development': DevConfig,
    'default': DevConfig,
}


