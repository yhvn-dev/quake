import { NavLink } from "react-router-dom";
import { Settings, FileText, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {Darkmode} from "../features/darkmode"

function DashboardSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="container row-span-full h-full bg-white shadow-lg flex flex-col">
      <div className="p-6 center border-b border-[var(--moon-phases-c)]">

        <div>
          <h2 className="logo-text text-xl text-start font-bold my-2 text-gray-800">Hello!</h2>
            {user && <p className="text-sm text-start my-2  text-gray-600 mt-1">{user.name}</p>}
            <Darkmode/>
        </div>
       
      </div>

      <nav className="flex-1 p-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg my-4 transition-colors ${
              isActive
                ? "bg-[var(--moon-phases-d)] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FileText size={20} />
          <span className="font-medium">Report</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg my-4 transition-colors ${
              isActive
                ? "bg-[var(--moon-phases-d)] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </nav>

      
    </aside>
  );
}

export default DashboardSidebar;
