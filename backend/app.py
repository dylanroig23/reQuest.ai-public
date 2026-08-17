
# app.py
from flask import Flask
# from flask_cors import CORS
from flask_session import Session
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os

load_dotenv()

app = Flask(
   __name__,
   static_folder="static/web",
   static_url_path=""
)

# Enable CORS (allow frontend to talk to backend)
# CORS(app, supports_credentials=True)

# Flask session setup (store user session in memory for now)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'your-secret')
app.config.update(
   SESSION_TYPE='filesystem',
   SESSION_PERMANENT=False,
   SESSION_COOKIE_HTTPONLY=True,
   SESSION_COOKIE_SAMESITE='Lax'
)
Session(app)

# Register blueprints
from routes import register_blueprints
register_blueprints(app)

# Database configuration
from database import db
migrate = Migrate()

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
migrate.init_app(app, db)

# Import models after db is initialized (avoids circular import)
from database import models

if __name__ == "__main__":
   app.run(debug=True)