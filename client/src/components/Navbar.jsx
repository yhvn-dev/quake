import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, UserPlus, LayoutDashboard } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // <-- Get current route
  const { isAuthenticated, user } = useAuth();

  // Check if current path is /dashboard or any nested dashboard route
  const isDashboardActive = location.pathname.startsWith("/dashboard");

  return (
    <nav className="w-full h-full flex items-center justify-between px-6 bg-white ">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="text-xl font-bold text-[var(--moon-phases-d)]">
          LOMI-LIN-DOL
        </div>
      </div>

      <div className="flex items-center gap-4">
        {!isAuthenticated ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[var(--moon-phases-d)] transition-colors"
            >
              <LogIn size={18} />
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--moon-phases-d)] hover:bg-[var(--moon-phases-e)] rounded-lg transition-colors"
            >
              <UserPlus size={18} />
              Signup
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate(isDashboardActive ? "/" : "/dashboard")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--moon-phases-d)] hover:bg-[var(--moon-phases-e)] rounded-lg transition-colors"
          >
            <LayoutDashboard size={18} />
            {isDashboardActive ? "Feed" : "Dashboard"}
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
