import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  useContext
} from "react";

import { AuthContext }
from "../context/auth-context";

function Navbar() {

  const navigate = useNavigate();

  const { user, logout } =
    useContext(AuthContext);

  const handleLogout = () => {

    logout();

    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg font-semibold duration-300 ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
    }`;

  return (

    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200 px-5 md:px-12 py-4 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center shadow-sm">

      <Link to="/" className="group">

        <h1 className="text-2xl md:text-3xl font-black text-gray-950 group-hover:text-blue-700 duration-300">
          Quiz System
        </h1>

        {user?.name && (
          <p className="text-sm text-gray-500 mt-1">
            Xin Chào , {user.name}
          </p>
        )}

      </Link>

      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">

        <NavLink
          to="/"
          className={linkClass}
        >
          Home
        </NavLink>

        <NavLink
          to="/join"
          className={linkClass}
        >
          Join
        </NavLink>

        <NavLink
          to="/create"
          className={linkClass}
        >
          Create Test
        </NavLink>

        <NavLink
          to="/history"
          className={linkClass}
        >
          History
        </NavLink>

        <NavLink
          to="/profile"
          className={linkClass}
        >
          Profile
        </NavLink>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold duration-300 shadow-sm"
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Navbar;
