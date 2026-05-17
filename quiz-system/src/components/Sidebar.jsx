import {
  FaHome,
  FaQuestionCircle,
  FaClipboardList
} from "react-icons/fa";

import { Link } from "react-router-dom";

function Sidebar() {

  return (

    <div className="w-[280px] min-h-screen bg-gradient-to-b from-[#111827] to-[#030712] text-white p-8">

      <h1 className="text-4xl font-bold mb-14">
        Quiz Admin
      </h1>

      <div className="flex flex-col gap-5">

        <Link
          to="/admin"
          className="flex items-center gap-4 bg-white/10 hover:bg-white/20 p-4 rounded-2xl duration-300"
        >
          <FaHome />
          Dashboard
        </Link>

        <Link
          to="/admin/quizzes"
          className="flex items-center gap-4 bg-white/10 hover:bg-white/20 p-4 rounded-2xl duration-300"
        >
          <FaClipboardList />
          Manage Quiz
        </Link>

        <Link
          to="/admin/questions"
          className="flex items-center gap-4 bg-white/10 hover:bg-white/20 p-4 rounded-2xl duration-300"
        >
          <FaQuestionCircle />
          Questions
        </Link>

      </div>

    </div>
  );
}

export default Sidebar;