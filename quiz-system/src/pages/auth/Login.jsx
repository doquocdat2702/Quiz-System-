import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { user, token } = res.data.data;
      login(user, token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700">
      <form
        onSubmit={handleLogin}
        className="bg-white/20 backdrop-blur-xl p-10 rounded-[35px] w-[420px] border border-white/20 shadow-2xl"
      >
        <h1 className="text-5xl font-bold text-white text-center mb-10">Login</h1>

        {error && (
          <div className="bg-red-500/30 border border-red-400 text-white rounded-2xl p-3 mb-5 text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-4 rounded-2xl mb-5 bg-white/20 border border-white/20 text-white placeholder:text-gray-200 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-4 rounded-2xl mb-8 bg-white/20 border border-white/20 text-white placeholder:text-gray-200 outline-none"
        />

        <button
          disabled={loading}
          className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:scale-105 duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Đang đăng nhập..." : "Login"}
        </button>

        <p className="text-white text-center mt-6">
          Don't have an account?
          <Link to="/register" className="font-bold ml-2">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
