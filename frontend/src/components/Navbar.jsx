import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/auth-context";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-semibold duration-200 ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="px-5 md:px-10 py-0 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm">
            Q
          </div>
          <span className="text-lg font-black text-gray-900 hidden sm:block">Quiz System</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={linkClass}>Trang chủ</NavLink>
          <NavLink to="/join" className={linkClass}>Nhập mã</NavLink>
          <NavLink to="/history" className={linkClass}>Lịch sử</NavLink>
          <NavLink to="/create" className={linkClass}>Tạo bài</NavLink>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/profile" className="flex items-center gap-2.5 hover:opacity-80 duration-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              {(user?.name || "U").slice(0, 1).toUpperCase()}
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-800 leading-none">{user?.name}</p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 duration-200"
          >
            Đăng xuất
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 duration-200"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1.5">
            <span className={`block h-0.5 bg-gray-700 rounded transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 bg-gray-700 rounded transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 bg-gray-700 rounded transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-5 py-4 flex flex-col gap-1">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold">
              {(user?.name || "U").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{user?.name}</p>
              <p className="text-gray-400 text-xs">{user?.email}</p>
            </div>
          </div>

          <NavLink to="/" className={linkClass} onClick={() => setMenuOpen(false)}>Trang chủ</NavLink>
          <NavLink to="/join" className={linkClass} onClick={() => setMenuOpen(false)}>Nhập mã bài</NavLink>
          <NavLink to="/history" className={linkClass} onClick={() => setMenuOpen(false)}>Lịch sử làm bài</NavLink>
          <NavLink to="/profile" className={linkClass} onClick={() => setMenuOpen(false)}>Hồ sơ cá nhân</NavLink>
          <NavLink to="/create" className={linkClass} onClick={() => setMenuOpen(false)}>Tạo bài test</NavLink>

          <div className="h-px bg-gray-100 my-1" />
          <button
            onClick={() => { handleLogout(); setMenuOpen(false); }}
            className="px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 text-left duration-200"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
