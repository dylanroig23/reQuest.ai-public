def get_or_create_user(steam_id, username):
   """
   Find an existing user by Steam ID or create a new one.

   Args:
      steam_id (str): The Steam ID of the user
      username (str): The Steam username of the user
   Returns:
      User: The existing or newly created User object
   """
   # Import inside function to avoid circular import
   from .models import User
   from . import db
   
   # First try to find existing user by Steam ID
   user = User.query.filter_by(steam_id=steam_id).first()

   if user:
      # User exists, update username if it has changed
      if user.username != username:
         user.username = username
         db.session.commit()
      return user
   else:
      # Create new user
      user = User(steam_id=steam_id, username=username)
      db.session.add(user)
      db.session.commit()
      return user
   
def get_conversation_history(user_id, conversation_id):
   """
   Retrieve the conversation history for a specific conversation.

   Args:
      user_id (int): The ID of the user
      conversation_id (int): The ID of the conversation
   Returns:
      list: Messages from the specified conversation
   """
   from .models import Message, Conversation

   # Ensure the conversation belongs to the user
   conversation = Conversation.query.filter_by(id=conversation_id, user_id=user_id).first()
   if not conversation:
      raise ValueError("Conversation does not belong to user or does not exist.")

   # Query Message table directly for ordered messages
   messages = Message.query.filter_by(conversation_id=conversation_id).order_by(Message.created_at.asc()).all()

   return messages

def add_message_to_conversation(user_id, conversation_id, role, content):
   """
   Add a message to a specific conversation.

   Args:
      user_id (int): The ID of the user
      conversation_id (int): The ID of the conversation
      role (str): The role of the message sender ("user" or "assistant")
      content (str): The content of the message
   """
   from .models import Message, Conversation
   from . import db
   from datetime import datetime

   # Ensure the conversation belongs to the user
   conversation = Conversation.query.filter_by(id=conversation_id, user_id=user_id).first()
   if not conversation:
      raise ValueError("Conversation does not belong to user or does not exist.")

   # Add the new message to the conversation
   message = Message(conversation_id=conversation_id, role=role, content=content, created_at=datetime.utcnow())
   db.session.add(message)
   db.session.commit()

def create_new_conversation(user_id, game_appid):
   """
   Create a new conversation for a user.

   Args:
      user_id (int): The ID of the user
      game_appid (int): The App ID of the game associated with the conversation
   Returns:
      int: The ID of the newly created conversation
   """
   from .models import Conversation
   from . import db
   from datetime import datetime
   
   # Create a new conversation (id will be auto-generated)
   conversation = Conversation(user_id=user_id, game_appid=game_appid, created_at=datetime.utcnow())
   db.session.add(conversation)
   db.session.commit()

   return conversation.id

def get_or_create_conversation(user_id, game_appid):
   """
   Get an existing conversation for a user and game, or create a new one if it doesn't exist.

   Args:
      user_id (int): The ID of the user
      game_appid (int): The App ID of the game associated with the conversation
   Returns:
      int: The ID of the conversation
   """
   from .models import Conversation
   
   # Try to find existing conversation for this user and game
   conversation = Conversation.query.filter_by(user_id=user_id, game_appid=game_appid).first()
   
   if conversation:
      return conversation.id
   else:
      # Create new conversation
      return create_new_conversation(user_id, game_appid)
