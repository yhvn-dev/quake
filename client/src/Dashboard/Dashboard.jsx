// eq/client/src/pages/Dashboard/Dashboard.jsx
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardSidebar from "../../components/DashboardSidebar";
import Navbar from "../../components/Navbar";

function Dashboard() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-16">
        <Navbar />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
