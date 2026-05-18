# Quick Start - Quiz System

## Terminal 1: Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:8081
http://localhost:8081/api/health
```

## Terminal 2: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Main Flow

1. Open `http://localhost:5173`.
2. Register a user account or log in with an existing account.
3. Use `Create Test` to create a quiz and receive a share code.
4. Use `Join` to enter a code and take a quiz.
5. Submit answers to get score and per-question feedback.
6. Open `History` to review past attempts and detailed results.

## Connected Features

- Login/Register with JWT auth.
- Quiz list fetched from MySQL.
- Any logged-in user can create a test.
- Each test has a unique code for sharing.
- Users can join by code.
- Backend scores submitted answers.
- History stores each user's attempts.
- Result page shows score and correct/wrong answer details.
