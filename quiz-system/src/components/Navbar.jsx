import { Link, useNavigate } from "react-router-dom";

import {
  useContext
} from "react";

import { AuthContext }
from "../context/AuthContext";

function Navbar() {

  const navigate = useNavigate();

  const { logout } =
    useContext(AuthContext);

  const handleLogout = () => {

    logout();

    navigate("/login");
  };

  return (

    <div className="bg-white border-b border-gray-200 px-12 py-5 flex justify-between items-center">

      <div>

        <h1 className="text-3xl font-bold">
          Quiz System
        </h1>

      </div>

      <div className="flex items-center gap-6">

        <Link
          to="/"
          className="font-medium hover:text-blue-500 duration-300"
        >
          Home
        </Link>

        <Link
          to="/history"
          className="font-medium hover:text-blue-500 duration-300"
        >
          History
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl duration-300"
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Navbar;