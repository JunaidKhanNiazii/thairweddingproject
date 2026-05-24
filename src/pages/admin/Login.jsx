import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export default function Login() {
  const { login, user, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  if (user) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setResetSent(false);
    setResetLoading(true);
    try {
      await resetPassword(ADMIN_EMAIL);
      setResetSent(true);
    } catch {
      setError("Failed to send reset email. Try again.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <main className="bg-gray-50 px-4 md:px-8 dark:bg-neutral-900 min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md w-full">
        <a href="/">
          <div className="w-14 h-14 mb-8 mx-auto rounded-xl bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-extrabold text-xl">A</span>
          </div>
        </a>
        <div className="p-6 rounded-lg bg-white border border-slate-300 shadow-xs md:p-8 dark:bg-neutral-800 dark:border-neutral-700">
          <h1 className="text-slate-900 text-center text-3xl font-bold dark:text-slate-50">Sign in</h1>

          {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}

          {resetSent && (
            <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200 text-sm text-green-800 text-center space-y-1">
              <p className="font-semibold">Reset link sent to your email.</p>
              <p>Check your inbox at <span className="font-medium">{ADMIN_EMAIL}</span>.</p>
              <p className="text-green-600">If not in inbox, please check your <span className="font-semibold">Spam</span> folder.</p>
            </div>
          )}

          <form className="space-y-6 mt-10" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50">Email</label>
              <input
                type="email"
                id="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:text-slate-50 dark:bg-neutral-700 dark:outline-neutral-600"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:text-slate-50 dark:bg-neutral-700 dark:outline-neutral-600 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7a9.97 9.97 0 016.375 2.325M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                className="text-sm font-medium text-blue-700 dark:text-blue-500 hover:underline focus:outline-none disabled:opacity-50"
              >
                {resetLoading ? "Sending..." : "Forgot password?"}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
