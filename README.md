![Static Badge](https://img.shields.io/badge/build-passing-brightgreen?style=plastic)
![Static Badge](https://img.shields.io/badge/github-repo-blue?logo=github)

# reQuest.ai

An AI-powered gaming assistant that helps Steam users get intelligent, context-aware answers about their game library. [Application Images](https://github.com/dylanroig23/reQuest.ai-public/tree/main/images)

## 🎮 Overview

reQuest.ai allows gamers to have natural conversations about their Steam games, receiving tailored assistance, tips, and information. By integrating Steam authentication with OpenAI's GPT models, the application provides personalized gaming advice based on the specific games users own and play. The AI assistant is scoped to individual games, ensuring responses are relevant and accurate to the user's current gaming context.

**Watch the Demo Below!**

[![Watch the demo](https://img.youtube.com/vi/rd4QnQ0i9wU/maxresdefault.jpg)](https://www.youtube.com/watch?v=rd4QnQ0i9wU)

---

## 🖥️ Frontend

The frontend is built as a **cross-platform React Native application** using **Expo**, providing native experiences on iOS, Android, and web platforms.

### Key Technologies

- **Framework:** React Native with Expo (~53.0.20)
- **Navigation:** Expo Router for file-based routing
- **UI:** React 19.0.0 with TypeScript
- **State Management:** React Context API (AuthContext)

### Architecture

- File-based routing system using Expo Router (`app/` directory)
- Responsive design that adapts between mobile and web platforms
- Theming system with custom color schemes and dark mode support
- Integration with Steam API for game library display

### Key Components

- **`Chat.tsx`**: Main chat interface with message history
- **`ConversationPanel.tsx`**: Manages game-specific conversations
- **`InstructionsPanel.tsx` & `InstructionsModal.tsx`**: User onboarding
- **`Profile.tsx` & `Login.tsx`**: Authentication flows

---

## ⚙️ Backend

The backend is a **Flask REST API** that handles authentication, chat processing, and data persistence.

### Key Technologies

- **Framework:** Flask 3.1.1 with Python
- **Database:** PostgreSQL with SQLAlchemy ORM
- **AI Integration:** OpenAI API (GPT-5-nano with reasoning capabilities)
- **Authentication:** Steam OpenID authentication
- **Session Management:** Flask-Session with filesystem storage
- **Database Migrations:** Flask-Migrate with Alembic

### Architecture

#### Modular Blueprint-Based Routing

- **`routes/chat.py`**: AI chat endpoints with conversation history
- **`routes/steam.py`**: Steam authentication and game library integration
- **`routes/user.py`**: User management
- **`routes/frontend.py`**: Static file serving

#### Database Models

- **`User`**: Stores Steam user information
- **`Conversation`**: Game-specific conversation threads
- **`Message`**: Individual chat messages with role-based storage

#### Intelligent Context Management

- Retrieves last 6 messages for conversation continuity
- Includes game metadata (name, playtime) in AI prompts
- Scoped AI responses to prevent off-topic conversations

### Core Features

- Steam OpenID authentication flow
- Retrieval of user's game library and recently played games
- Persistent conversation history per game
- Context-aware AI responses using game-specific data
- Session-based user state management

---

## 🚀 Deployment

The application uses a **dual deployment strategy** for unified hosting.

### Backend Deployment

- Configured for **AWS Elastic Beanstalk** deployment
- Uses **Gunicorn** WSGI server (2 workers, 120s timeout)
- Entry point: `application.py` (references main Flask app)
- `Procfile` defines web process configuration

### Frontend Deployment

- Built using Expo's static export feature (`expo-router` with Metro bundler)
- Generates static web build in `static/web/` directory
- Served directly by Flask backend for unified deployment
- Supports Progressive Web App (PWA) capabilities

### Database

- PostgreSQL database (local or cloud-hosted)
- Managed schema migrations using Flask-Migrate
- Existing migration files in `backend/migrations/versions/`

### Environment Variables

Required environment variables in `.env` file:

```env
FLASK_SECRET_KEY=flask-secret-key
DATABASE_URL=database-url
STEAM_API_KEY=your-steam-api-key
OPENAI_API_KEY=your-openai-api-key
BACKEND_URL=your-backend-url
FRONTEND_URL=your-frontend-url
EXPO_PUBLIC_BACKEND_URL=url-for-hosted-backend
ALLOWED_ORIGINS=allow-origins-for-local-dev

reQuest.ai/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── application.py         # Elastic Beanstalk entry point
│   ├── requirements.txt       # Python dependencies
│   ├── Procfile              # Deployment configuration
│   ├── database/
│   │   ├── models.py         # SQLAlchemy models
│   │   └── database_functions.py
│   ├── routes/               # API endpoints
│   │   ├── chat.py
│   │   ├── steam.py
│   │   ├── user.py
│   │   └── frontend.py
│   └── migrations/           # Database migrations
└── frontend/
    ├── app.json              # Expo configuration
    ├── package.json          # Node dependencies
    ├── app/                  # Expo Router pages
    ├── components/           # React components
    ├── constants/            # Theme and config
    └── contexts/             # React Context providers
```
