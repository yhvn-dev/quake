// quake/client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { EarthquakeAlertProvider } from "./context/EarthquakeAlertContext";
import { Toaster } from "react-hot-toast";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import Feed from "./pages/Feed/feed";
import Dashboard from "./pages/Dashboard/Dashboard";
import Settings from "./pages/Settings/Settings";
import Report from "./pages/Dashboard/Report";

function App() {
  return (
    <AuthProvider>
      <EarthquakeAlertProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Dashboard routes with nested routes */}
            <Route path="/dashboard" element={<Dashboard />}>
            
            </Route>

              <Route path="settings" element={<Settings />} />
          </Routes>
        </BrowserRouter>

        {/* Toast notifications */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 5000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </EarthquakeAlertProvider>
    </AuthProvider>
  );
}

export default App;
