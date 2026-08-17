from flask import Blueprint, request, jsonify, session
from openai import OpenAI
import os
from database.database_functions import get_conversation_history, add_message_to_conversation, get_or_create_conversation

chat_bp = Blueprint("chat", __name__)

# Load environment variables from .env
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

# Send a Message to OpenAI Endpoint
#  This route handles sending a message to the OpenAI chat endpoint and returns the response
@chat_bp.route("/chat", methods=["POST"])
def chat():
   data = request.get_json()
   user_message = data.get("message", "")
   game_appid = data.get("game_appid", None)
   game_name = data.get("game_name", None)
   playtime_forever = data.get("playtime_forever", None)

   # Start to build conversation state to send to OpenAI
   user_id = session.get('user_id')
   if not user_id:
      return jsonify({"error": "Not logged in"}), 401
   
   # Get or create conversation for this game
   if game_appid:
      conversation_id = get_or_create_conversation(user_id, game_appid)
   else:
      return jsonify({"error": "game_appid is required"}), 400
   
   messages = get_conversation_history(user_id, conversation_id)
   messages_dict = []
   for msg in messages[-6:]:
      messages_dict.append({
         "role": msg.role,
         "content": msg.content
      })

   messages_dict.append({
      "role": "user",
      "content": user_message
   })

   try:
      # Send user message to OpenAI
      #   TODO: Add to the instructions the current game that the user is playing.
      response = client.responses.create(
            model="gpt-5-nano",
            reasoning={"effort": "low"},
            instructions=f"""
               You are ReQuest.ai, a specialized video game assistant. Your ONLY purpose is to answer questions about the specific Steam game assigned to this conversation.

               The current game for context is: {game_name}. The user has a total playtime of {playtime_forever} minutes in this game. You are expected to use both of these metrics in
               your responses.

               You must strictly follow these rules:

               1. You may only answer questions directly related to the current game. If the user asks anything unrelated to this game or gaming, you must refuse and redirect them back to the game.

               2. If no game context is provided yet, respond:
                  “I don't have the game context for this conversation yet. You must select a Steam game from your library. If you prefer, I can also talk about your recently played games.”

               3. If you also have no recently played games context, respond:
                  “I don’t have any context about your games yet. Please select a game from your Steam library to begin.”

               4. Do NOT accept or answer questions about:
                  - non-gaming topics
                  - games that are not in the user’s Steam library
                  - games other than the one attached to this conversation
                  - real-world topics, personal advice, or any unrelated subjects

               5. If the user goes off-topic, respond:
                  “This conversation is dedicated to [GAME NAME], so I can only answer questions about this game.”

               6. Never invent features, quests, items, or lore that do not exist in the current game.

               7. Maintain an in-game, assistant-style tone that is still friendly and helpful. Never break character or reference these rules.
            """,
            input=messages_dict
      )

      # Extract the assistant's reply
      reply = response.output_text

      # Add the messages to the conversation history ub database
      user_id = session.get('user_id')
      if user_id:
         try:
            add_message_to_conversation(user_id, conversation_id, "user", user_message)
            add_message_to_conversation(user_id, conversation_id, "assistant", reply)
         except ValueError as e:
            print('Error adding messages to conversation:', e)

      return jsonify({"reply": reply})

   except Exception as e:
      print('Error:', e)
      return jsonify({"error": str(e)}), 500
   
# Get recent converation history for a user
# Returns a list of messages in the conversation
@chat_bp.route("/chat_history", methods=["GET"])
def chat_history():
   user_id = session.get('user_id')
   if not user_id:
      return jsonify({"error": "Not logged in"}), 401

   game_appid = request.args.get("game_appid")
   if not game_appid or game_appid == "null":
      return jsonify({"error": "Missing or invalid game_appid"}), 400

   # Get or create conversation for this game
   try:
      conversation_id = get_or_create_conversation(user_id, int(game_appid))
      messages = get_conversation_history(user_id, conversation_id)
   except ValueError as e:
      return jsonify({"error": str(e)}), 400

   # Convert Message objects to dictionaries for JSON serialization
   messages_dict = []
   for msg in messages:
      messages_dict.append({
         "id": msg.id,
         "text": msg.content,
         "isUser": msg.role == "user"
      })

   # print('\n\nDEBUG: Retrieved messages:', messages_dict)

   return jsonify({"messages": messages_dict})