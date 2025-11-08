import { NavLink } from "react-router-dom";
import { Settings, FileText, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function DashboardSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-64 h-full bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
        {user && <p className="text-sm text-gray-600 mt-1">{user.name}</p>}
      </div>

      <nav className="flex-1 p-4">
        <NavLink
          to="/dashboard/report"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
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
          to="/dashboard/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              isActive
                ? "bg-[var(--moon-phases-d)] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
