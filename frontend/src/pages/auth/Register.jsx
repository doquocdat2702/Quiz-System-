import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";

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
      toast.error("Vui long dien day du thong tin");
      return;
    }

    if (password.length < 6) {
      toast.error("Mat khau phai co it nhat 6 ky tu");
      return;
    }

    setLoading(true);
    try {
      const data = await register(name, email, password);
      contextLogin(data.user, data.token);
      toast.success("Dang ky thanh cong");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Dang ky that bai");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 px-5">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 md:p-8 rounded-2xl w-full max-w-md border border-white/40 shadow-2xl"
      >
        <h1 className="text-4xl font-black text-gray-950 mb-3">Dang ky</h1>
        <p className="text-gray-500 mb-8">Tao tai khoan de bat dau voi Quiz System.</p>

        <label className="block font-semibold text-gray-800 mb-2">Ho ten</label>
        <input
          type="text"
          placeholder="Nguyen Van A"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={loading}
          className="w-full p-4 rounded-xl mb-5 bg-slate-50 border border-gray-300 outline-none focus:border-blue-500 disabled:opacity-50"
        />

        <label className="block font-semibold text-gray-800 mb-2">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
          className="w-full p-4 rounded-xl mb-5 bg-slate-50 border border-gray-300 outline-none focus:border-blue-500 disabled:opacity-50"
        />

        <label className="block font-semibold text-gray-800 mb-2">Mat khau</label>
        <input
          type="password"
          placeholder="Toi thieu 6 ky tu"
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
          {loading ? "Dang dang ky..." : "Dang ky"}
        </button>

        <p className="text-gray-600 text-center mt-6">
          Da co tai khoan?
          <Link to="/login" className="font-bold ml-2 text-blue-600 hover:underline">
            Dang nhap
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
