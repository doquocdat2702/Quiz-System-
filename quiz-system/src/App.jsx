import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Home from "./pages/quiz/Home";
import QuizPage from "./pages/quiz/QuizPage";
import ResultPage from "./pages/quiz/ResultPage";
import HistoryPage from "./pages/quiz/HistoryPage";

import Dashboard from "./pages/admin/Dashboard";
import ManageQuiz from "./pages/admin/ManageQuiz";
import ManageQuestion from "./pages/admin/ManageQuestion";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

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

      {/* USER */}

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
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/quizzes"
        element={
          <AdminRoute>
            <ManageQuiz />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/questions"
        element={
          <AdminRoute>
            <ManageQuestion />
          </AdminRoute>
        }
      />

    </Routes>

  );
}

export default App;