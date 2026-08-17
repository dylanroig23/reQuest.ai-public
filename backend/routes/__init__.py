from .steam import steam_bp
from .user import user_bp
from .chat import chat_bp
from .frontend import frontend_bp

def register_blueprints(app):
	app.register_blueprint(steam_bp)
	app.register_blueprint(user_bp)
	app.register_blueprint(chat_bp)
	app.register_blueprint(frontend_bp)
