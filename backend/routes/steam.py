from flask import Blueprint, redirect, request, session, jsonify
import os
import requests
from urllib.parse import urlencode
from database.database_functions import get_or_create_user

steam_bp = Blueprint('steam', __name__)

STEAM_API_KEY = os.getenv("STEAM_API_KEY")
BACKEND_URL = os.getenv("BACKEND_URL")
STEAM_OPENID_URL = "https://steamcommunity.com/openid/login"
FRONTEND_URL = os.getenv("FRONTEND_URL")

# Authentication to Steam Route
#  This route initiates the OpenID login process with Steam
@steam_bp.route("/steam/auth", methods=["GET"])
def steam_login():
   params = {
      "openid.ns": "http://specs.openid.net/auth/2.0",
      "openid.mode": "checkid_setup",
      "openid.return_to": f"{BACKEND_URL}/steam/auth/return",
      "openid.realm": f"{BACKEND_URL}/",
      "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
      "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
   }
   return redirect(f"{STEAM_OPENID_URL}?{urlencode(params)}")

# Callback Route for Steam Authentication
#  This route handles the return from Steam after authentication
@steam_bp.route("/steam/auth/return", methods=["GET"])
def steam_return():
   # Get Steam ID from OpenID response
   steam_id = request.args.get('openid.claimed_id', '').split('/')[-1]
   
   if not steam_id:
      return {"error": "No Steam ID received"}, 400
   
   # Make API call to get Steam username
   try:
      url = f"http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={STEAM_API_KEY}&steamids={steam_id}"
      response = requests.get(url)
      
      if response.status_code == 200:
         data = response.json()
         players = data.get('response', {}).get('players', [])
         if players:
            username = players[0].get('personaname', '')
         else:
            return {"error": "Steam user not found"}, 404
      else:
         return {"error": f"Steam API error: {response.status_code}"}, 502
         
   except Exception as e:
      return {"error": f"Failed to fetch Steam username: {str(e)}"}, 500
   
   # Create or find user in database
   try:
      user = get_or_create_user(steam_id, username)
      
      # Store both steam_id and user_id in session
      session['steam_id'] = steam_id
      session['user_id'] = user.id
      
      return redirect(f"{FRONTEND_URL}")
      
   except Exception as e:
      return {"error": f"Database error: {str(e)}"}, 500

# GETs the Logout of a User
@steam_bp.route("/steam/logout", methods=["GET"])
def steam_logout():
   session.pop('steam_id', None)
   session.pop('user_id', None)
   return {"message": "Logged out successfully"}

# GETs the Current Game a User is Playing
@steam_bp.route("/steam/current-game", methods=["GET"])
def current_game():
   steam_id = session.get('steam_id')
   if not steam_id:
      return {"error": "Not logged in"}, 401
   url = f"http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={STEAM_API_KEY}&steamids={steam_id}"
   r = requests.get(url)
   data = r.json()
   player = data['response']['players'][0]
   current_game = player.get('gameextrainfo', 'No game running')
   return {"current_game": current_game}

# GETs the Recently Played Game of a User
@steam_bp.route("/steam/recently-played", methods=["GET"])
def recently_played():
   # grab the steam id from the session, no steam id means not logged in
   steam_id = session.get('steam_id')
   if not steam_id:
      return {"error": "Not logged in"}, 401
   
   # make callout to Steam API endpoint to get recently played game.
   url = f"http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key={STEAM_API_KEY}&steamid={steam_id}&format=json"
   r = requests.get(url)
   if r.status_code != 200:
      return {"error": f"Steam API error: {r.status_code}", "details": r.text}, 502
   try:
      data = r.json()
   except Exception as e:
      return {"error": "Invalid response from Steam API", "details": str(e), "raw": r.text}, 502
   
   # get the information about the most recently played game
   games = data.get('response', {}).get('games', [])
   if not games:
      return {"recent_game": "No recent games"}
   most_recent = games[0]
   return {
      "recent_game": most_recent.get("name"),
      "appid": most_recent.get("appid"),
      "playtime_2weeks": most_recent.get("playtime_2weeks", 0)
   }

#GETs the Game Library of the User
@steam_bp.route("/steam/user-game-library", methods=["GET"])
def user_game_library():
   # grab the steam id from the session, no steam id means not logged in
   steam_id = session.get('steam_id')
   if not steam_id:
      return {"error": "Not logged in"}, 401

   # make callout to Steam API endpoint to get a library of the users games
   url = f"http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key={STEAM_API_KEY}&steamid={steam_id}&include_appinfo=true&include_played_free_games=true&format=json"
   r = requests.get(url)
   if r.status_code != 200:
      return {"error": f"Steam API error: {r.status_code}", "details": r.text}, 502
   
   try:
      data = r.json()
   except Exception as e:
      return {"error": "Invalid response from Steam API", "details": str(e), "raw": r.text}, 502
   # get the information about the most recently played game
   games = data.get('response', {}).get('games', [])
   if not games:
      return []

   # Sorted game library by playtime in the last 2 weeks
   sorted_game_library = sorted(
      [
         {
            "game_name": game.get("name"),
            "game_appid": game.get("appid"),
            "playtime_forever": game.get("playtime_forever", 0),
            "playtime_2weeks": game.get("playtime_2weeks", 0),
            "game_image": f"http://media.steampowered.com/steamcommunity/public/images/apps/{game.get('appid')}/{game.get('img_logo_url')}.jpg" if game.get('img_logo_url') else f"http://media.steampowered.com/steamcommunity/public/images/apps/{game.get('appid')}/{game.get('img_icon_url')}.jpg" if game.get('img_icon_url') else None
         }
         for game in games
      ],
      key=lambda x: x["playtime_2weeks"],
      reverse=True
   )

   return jsonify({"games": sorted_game_library})