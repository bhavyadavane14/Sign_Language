# API Documentation

## Authentication
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Authenticate and receive JWT token.

## Translation
- `POST /api/translate/predict`
  - Body: `{"landmarks": [[x,y,z], ...]}` (List of 21 landmarks)
  - Response: `{"class": "A", "confidence": 0.95}`

## Chatbot
- `POST /api/chat`
  - Body: `{"message": "What does this sign mean?"}`
  - Response: `{"reply": "..."}`

## User Data
- `GET /api/user/history`: Get user translation history.
