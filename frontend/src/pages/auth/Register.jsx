import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../../services/authService";
import { AuthContext } from "../../context/auth-context";

function Register() {
  const navigate = useNavigate();
  const { login: contextLogin } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!name || !email || !password) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      const data = await register(name, email, password);
      contextLogin(data.user, data.token);
      toast.success("Đăng ký thành công!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Đăng ký thất bại");
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
            Tham gia cộng đồng<br />học tập ngay hôm nay
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed">
            Đăng ký miễn phí, tạo và làm bài test không giới hạn, theo dõi tiến trình của bạn.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "✅ Tạo bài test không giới hạn",
              "✅ Chia sẻ bằng mã bài test",
              "✅ Xem lịch sử và kết quả chi tiết",
              "✅ Hoàn toàn miễn phí",
            ].map((item) => (
              <p key={item} className="text-blue-100 font-medium">{item}</p>
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
            <h1 className="text-3xl font-black text-gray-900 mb-2">Tạo tài khoản</h1>
            <p className="text-gray-500">Điền thông tin để bắt đầu ngay.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Họ và tên</label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 disabled:opacity-50 text-gray-900 placeholder-gray-400 transition"
              />
            </div>

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
                placeholder="Tối thiểu 6 ký tự"
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
                  Đang đăng ký...
                </>
              ) : "Tạo tài khoản"}
            </button>
          </form>

          <p className="text-gray-500 text-sm text-center mt-6">
            Đã có tài khoản?{" "}
            <Link to="/login" className="font-bold text-blue-600 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
