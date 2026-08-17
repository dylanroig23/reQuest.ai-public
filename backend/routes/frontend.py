from flask import Blueprint, send_from_directory, current_app
import os

frontend_bp = Blueprint('frontend', __name__)

@frontend_bp.route('/')
def serve_frontend():
   return send_from_directory(current_app.static_folder, 'index.html')

@frontend_bp.route('/<path:path>')
def serve_static_file(path):
   try:
      return send_from_directory(current_app.static_folder, path)
   except:
      # For SPA routing - serve index.html for non-existent routes
      return send_from_directory(current_app.static_folder, 'index.html')