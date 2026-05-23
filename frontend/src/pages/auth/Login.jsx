import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../../services/authService";
import { AuthContext } from "../../context/auth-context";

function Login() {
  const navigate = useNavigate();
  const { login: contextLogin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Vui lòng nhập email và mật khẩu");
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      contextLogin(data.user, data.token);
      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-white font-black text-lg">
            Q
          </div>
          <span className="text-white font-black text-xl">Quiz System</span>
        </div>

        <div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Học tập &amp; thi thử<br />thông minh hơn
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed">
            Tạo bài kiểm tra, chia sẻ với bạn bè và theo dõi tiến trình học tập của bạn.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { icon: "📋", label: "Bài test", desc: "Đa dạng chủ đề" },
              { icon: "⚡", label: "Nhanh chóng", desc: "Tức thì có kết quả" },
              { icon: "📊", label: "Thống kê", desc: "Theo dõi điểm số" },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 rounded-xl p-4 backdrop-blur">
                <p className="text-2xl mb-1">{item.icon}</p>
                <p className="text-white font-semibold text-sm">{item.label}</p>
                <p className="text-blue-300 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-400 text-sm">© 2025 Quiz System</p>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm">
                Q
              </div>
              <span className="font-black text-gray-900">Quiz System</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Đăng nhập</h1>
            <p className="text-gray-500">Chào mừng trở lại! Vui lòng nhập thông tin.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 disabled:opacity-50 text-gray-900 placeholder-gray-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mật khẩu</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 disabled:opacity-50 text-gray-900 placeholder-gray-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3.5 rounded-xl font-bold shadow-sm duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Đang đăng nhập...
                </>
              ) : "Đăng nhập"}
            </button>
          </form>

          <p className="text-gray-500 text-sm text-center mt-6">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="font-bold text-blue-600 hover:underline">
              Đăng ký ngay
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;
