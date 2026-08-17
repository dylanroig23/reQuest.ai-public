from flask import Blueprint, redirect, request, session
import os
import requests
from urllib.parse import urlencode

user_bp = Blueprint('user', __name__)

STEAM_API_KEY = os.getenv("STEAM_API_KEY")

@user_bp.route("/user/logged-in")
def is_logged_in():
   steam_id = session.get('steam_id')
   if steam_id:
      return {"logged_in": True}, 200
   else:
      return {"logged_in": False}, 200

@user_bp.route("/user/username")
def get_username():
   steam_id = session.get('steam_id')
   if not steam_id:
      return {"error": "Not logged in"}, 401
   
   try:
      url = f"http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={STEAM_API_KEY}&steamids={steam_id}"
      response = requests.get(url)
      
      if response.status_code == 200:
         data = response.json()
         
         players = data.get('response', {}).get('players', [])
         if players:
            username = players[0].get('personaname', 'Unknown')
            return {"username": username}, 200
         else:
            return {"error": "Player not found"}, 404
      else:
         return {"error": "Failed to fetch from Steam API"}, 500
   except Exception as e:
      return {"error": f"Failed to fetch Steam username: {str(e)}"}, 500