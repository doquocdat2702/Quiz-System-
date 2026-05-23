import { useContext, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/auth-context";
import { updateProfile } from "../../services/authService";

function ProfilePage() {
  const { user, updateUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Tên và email không được để trống");
      return;
    }

    setSaving(true);
    try {
      const data = await updateProfile({
        name: name.trim(),
        email: email.trim(),
        currentPassword,
        newPassword,
      });

      updateUser(data.user, data.token);
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Đã cập nhật hồ sơ");
    } catch (error) {
      toast.error(error.message || "Không cập nhật được hồ sơ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="px-5 py-10">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl mb-5">
            {(user?.name || "U").slice(0, 1).toUpperCase()}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-950 mb-3">Hồ sơ cá nhân</h1>
          <p className="text-gray-500 mb-8">Cập nhật tên, email hoặc đổi mật khẩu của bạn.</p>

          <label className="block font-semibold text-gray-800 mb-2">Họ tên</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 mb-5 bg-slate-50"
          />

          <label className="block font-semibold text-gray-800 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 mb-8 bg-slate-50"
          />

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-2xl font-bold mb-2">Đổi mật khẩu</h2>
            <p className="text-gray-500 mb-5">Để trống nếu bạn không muốn đổi mật khẩu .</p>

            <label className="block font-semibold text-gray-800 mb-2">Mật khẩu hiện tại</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 mb-5 bg-slate-50"
            />

            <label className="block font-semibold text-gray-800 mb-2">Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 bg-slate-50"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-xl font-bold shadow-sm"
          >
            {saving ? "Đang lưu..." : "Lưu hồ sơ"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default ProfilePage;
