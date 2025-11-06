import os


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'a_super_secret_key_that_is_hard_to_guess')
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        # Default for local Postgres; change user/pass/db as needed
        'postgresql+psycopg2://postgres:postgres@localhost:5432/todo_app'
    )
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


