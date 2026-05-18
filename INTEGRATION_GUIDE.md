# Quiz System - Full Stack Setup Guide

## Project Structure
```
Quiz-System/
├── backend/          # Node.js Express API
│   ├── src/
│   │   ├── app.js
│   │   ├── config/database.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── routes/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/         # React + Vite
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/authService.js
│   │   ├── api/axios.js
│   │   ├── context/AuthContext.jsx
│   │   └── routes/ProtectedRoute.jsx
│   ├── package.json
│   └── .env.local
└── README.md
```

## Setup Instructions

### 1. Backend Setup

**Prerequisites:**
- Node.js v16+
- MySQL Server running on localhost:3306

**Steps:**
```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your MySQL credentials
# DB_USER=root
# DB_PASSWORD=your_password

# Start the server
npm run dev
```

Server will run on: `http://localhost:8080`
Health check: `http://localhost:8080/api/health`

### 2. Frontend Setup

**Prerequisites:**
- Node.js v16+

**Steps:**
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

## API Integration Overview

### Authentication Flow
1. User registers/logs in via frontend forms
2. Credentials sent to backend: `POST /api/auth/login` or `/api/auth/register`
3. Backend returns JWT token + user data
4. Frontend stores token in localStorage
5. Token automatically included in all subsequent API requests

### Key Features Implemented

✅ **Authentication**
- User registration with email validation
- Login with JWT token generation
- Protected routes using AuthContext
- Auto-logout on token expiration

✅ **Quiz System**
- Fetch all available quizzes
- Get quiz details with questions
- Submit answers and calculate scores
- View quiz attempt history

✅ **API Integration**
- Axios interceptors for JWT token handling
- Automatic 401 redirect to login
- Error handling with toast notifications
- Real-time data fetching with loading states

## Test Credentials

**Admin Account:**
- Email: admin@gmail.com
- Password: 123456

This account is created automatically during database initialization.

## Database Schema

The backend automatically creates these tables:
- `users` - User accounts
- `quizzes` - Quiz metadata
- `questions` - Quiz questions with answers
- `quiz_attempts` - User quiz results/history

Sample data is seeded on first startup.

## Troubleshooting

### CORS Error
Make sure backend CORS is configured to allow frontend origin (default: `*`)

### MySQL Connection Error
- Check MySQL is running
- Verify DB credentials in backend/.env
- Ensure database can be created (check MySQL permissions)

### JWT Token Invalid
- Clear localStorage and login again
- Check JWT_SECRET in backend/.env matches

### API Calls Failing
- Verify backend is running on port 8080
- Check browser network tab for exact error
- Ensure frontend .env.local has correct API URL

## Production Deployment

Before deploying:
1. Change `JWT_SECRET` in backend/.env to a strong random string
2. Set `NODE_ENV=production`
3. Update frontend API URL to production backend URL
4. Use a production database (not localhost MySQL)
5. Build frontend: `npm run build`

## File Changes Summary

**Frontend Updates:**
- ✅ axios.js - Added JWT interceptors
- ✅ authService.js - Real API calls (login, register, getMe, quizzes, history, submit)
- ✅ Login.jsx - Connected to backend API
- ✅ Register.jsx - Connected to backend API
- ✅ Home.jsx - Fetches quizzes from backend
- ✅ QuizPage.jsx - Fetches quiz details and submits answers
- ✅ HistoryPage.jsx - Fetches user quiz history
- ✅ ProtectedRoute.jsx - Uses AuthContext instead of localStorage
- ✅ .env.local - Frontend API configuration

**Backend (Already Complete):**
- Server configuration
- Database auto-initialization
- Authentication routes with JWT
- Quiz management routes
- History tracking routes
- Error handling middleware

## Next Steps

1. Start MySQL server
2. Run backend: `npm run dev` (from backend/)
3. Run frontend: `npm run dev` (from frontend/)
4. Open http://localhost:5173
5. Register or login with admin@gmail.com / 123456
6. Take a quiz and check your history!
