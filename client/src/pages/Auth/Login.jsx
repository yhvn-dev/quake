import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  login,
  verifyLoginCode,
  resendVerification,
} from "../../services/userService";
import { Mail, Lock } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // verification modal state
  const [showModal, setShowModal] = useState(false);
  const [loginToken, setLoginToken] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setInfoMessage("");

    try {
      // Get reCAPTCHA token
      const recaptchaToken = await window.grecaptcha.execute(
        import.meta.env.VITE_RECAPTCHA_SITE_KEY,
        { action: "login" }
      );

      const response = await login(
        formData.email,
        formData.password,
        recaptchaToken
      );

      // show modal
      if (response.verificationRequired) {
        setLoginToken(response.loginToken);
        setShowModal(true);
        setInfoMessage("A verification code was sent to your email.");
      } else {
        // If server returns token directly (fallback), save and redirect
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setVerifying(true);

    try {
      const response = await verifyLoginCode(loginToken, codeInput);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setShowModal(false);
  
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid code. Please try again."
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!loginToken) return;
    setResendLoading(true);
    setError("");
    setInfoMessage("");

    try {
      await resendVerification(loginToken);
      setInfoMessage("Verification code resent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-[80%] flex items-center justify-center bg-gray-100">
      <div className="p-8 h-full rounded-lg shadow-md w-full max-w-md bg-[var(--main-white)] rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {infoMessage && (
          <div className="bg-blue-100 border border-blue-300   rounded-xl text-[var(--mainblue)] px-4 py-3 mb-4">
            {infoMessage}
          </div>
        )}

        <form className="h-full" onSubmit={handleSubmit}>
          <div className="mb-4 input-box relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300  rounded-xl focus:outline-[var(--purpluish)]"
              placeholder=""
            />
            <label className="absolute left-4 top-2  text-[var(--metal-dark4)] pointer-events-none bg-[var(--main-white)] px-1">
              Email
            </label>
            <Mail size={18} className="absolute right-4 top-2" />
          </div>

          <div className="mb-6 input-box relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-[var(--main-white)] focus:outline-[var(--purpluish)] "
              placeholder=""
            />

            <label className="absolute left-4 top-2  text-[var(--metal-dark4)] pointer-events-none bg-[var(--main-white)] px-1">
              Password
            </label>
            <Lock size={18} className="absolute right-4 top-2" />
          </div>

          <div className="mb-4 text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-[var(--purpluish)] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-[var(--purpluish)] bg-[var(--purpluish)] rounded-xl  text-white font-bold py-2 px-4 rounded-xl 
            hover:bg-[var(--bluis)] shadow-lg disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[var(--purpluish)]  hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>

      {/* Verification Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={() => {}}
          />
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10">
            <h3 className="text-xl font-semibold mb-4">Email Verification</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter the 6-digit code we sent to your email.
            </p>

            <form onSubmit={handleVerify}>
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                maxLength={6}
                required
                className="w-full px-3 py-2 border rounded-xl border-gray-300 mb-4 focus:outline-none hover:bg-[var(--bluish)] text-center tracking-widest text-lg"
                placeholder="123456"
              />

              <div className="flex items-center justify-between gap-2">
                <button
                  type="submit"
                  disabled={verifying}
                  className="flex-1 bg-[var(--color-success-b)] shadow-lg rounded-xl text-white font-bold py-2 px-4  hover:bg-[var(--color-success-a)] disabled:bg-gray-400"
                >
                  {verifying ? "Verifying..." : "Verify"}
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="rounded-xl bg-[var(--moon-phases-e)] text-gray-700 font-bold py-2 px-3  hover:bg-gray-500  text-white disabled:opacity-60"
                >
                  {resendLoading ? "Sending..." : "Resend"}
                </button>
              </div>
            </form>

            <div className="mt-3 text-sm text-gray-500 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setLoginToken("");
                  setCodeInput("");
                }}
                className="underline text-sm text-gray-600 rounded-xl hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
