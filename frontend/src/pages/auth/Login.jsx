import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login: contextLogin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Vui Lòng Nhập Email Và Password");
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      contextLogin(data.user, data.token);
      toast.success("Đăng Nhập Thành Công");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Đăng Nhập Thất Bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 px-5">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 md:p-8 rounded-2xl w-full max-w-md border border-white/40 shadow-2xl"
      >
        <h1 className="text-4xl font-black text-gray-950 mb-3">Đăng Nhập</h1>
        <p className="text-gray-500 mb-8">vào hệ thống để tạo và làm bài test.</p>

        <label className="block font-semibold text-gray-800 mb-2">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
          className="w-full p-4 rounded-xl mb-5 bg-slate-50 border border-gray-300 outline-none focus:border-blue-500 disabled:opacity-50"
        />

        <label className="block font-semibold text-gray-800 mb-2">Password</label>
        <input
          type="password"
          placeholder="Nhap Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={loading}
          className="w-full p-4 rounded-xl mb-8 bg-slate-50 border border-gray-300 outline-none focus:border-blue-500 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 duration-300 disabled:bg-gray-400 shadow-sm"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <p className="text-gray-600 text-center mt-6">
          Chưa có tài khoản?
          <Link to="/register" className="font-bold ml-2 text-blue-600 hover:underline">
            Đăng ký
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
