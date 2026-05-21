import { Routes, Route }
from "react-router-dom";

import Login
from "./pages/auth/Login";

import Register
from "./pages/auth/Register";

import Home
from "./pages/quiz/Home";

import QuizPage
from "./pages/quiz/QuizPage";

import ResultPage
from "./pages/quiz/ResultPage";

import HistoryPage
from "./pages/quiz/HistoryPage";

import CreateQuizPage
from "./pages/quiz/CreateQuizPage";

import JoinQuizPage
from "./pages/quiz/JoinQuizPage";

import EditQuizPage
from "./pages/quiz/EditQuizPage";

import ProfilePage
from "./pages/quiz/ProfilePage";

import ProtectedRoute
from "./routes/ProtectedRoute";

function App() {

  return (

    <Routes>

      {/* AUTH */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* QUIZ */}

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quiz/:id"
        element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/result"
        element={
          <ProtectedRoute>
            <ResultPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/result/:attemptId"
        element={
          <ProtectedRoute>
            <ResultPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateQuizPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit/:id"
        element={
          <ProtectedRoute>
            <EditQuizPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/join"
        element={
          <ProtectedRoute>
            <JoinQuizPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

    </Routes>

  );
}

export default App;
