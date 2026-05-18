import { useContext, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
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
      toast.error("Ten va email khong duoc de trong");
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
      toast.success("Da cap nhat ho so");
    } catch (error) {
      toast.error(error.message || "Khong cap nhat duoc ho so");
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
          <h1 className="text-3xl md:text-5xl font-black text-gray-950 mb-3">Ho so ca nhan</h1>
          <p className="text-gray-500 mb-8">Cap nhat ten, email hoac doi mat khau cua ban.</p>

          <label className="block font-semibold text-gray-800 mb-2">Ho ten</label>
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
            <h2 className="text-2xl font-bold mb-2">Doi mat khau</h2>
            <p className="text-gray-500 mb-5">De trong neu ban khong muon doi mat khau.</p>

            <label className="block font-semibold text-gray-800 mb-2">Mat khau hien tai</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 mb-5 bg-slate-50"
            />

            <label className="block font-semibold text-gray-800 mb-2">Mat khau moi</label>
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
            {saving ? "Dang luu..." : "Luu ho so"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default ProfilePage;
