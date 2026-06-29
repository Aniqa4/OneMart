import React, { useState } from "react";
import type { FormEvent } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import useAuthStore from "~/store/auth/useAuthStore";

const ResetPassword: React.FC = () => {
  const { resetPassword } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <main className="flex items-center justify-center px-4 py-20">
        <section className="w-full max-w-sm bg-white p-6 rounded-lg shadow text-center">
          <p className="text-sm text-red-500 mb-4">Invalid or missing reset link.</p>
          <Link to="/forgot-password" className="text-sm text-gray-800 font-medium hover:underline">
            Request a new link
          </Link>
        </section>
      </main>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password, confirmPassword);
      toast.success("Password reset successfully! Please sign in.");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center px-4 py-20">
      <section className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-semibold text-center mb-2">Reset Password</h1>
        <p className="text-sm text-center text-gray-500 mb-6">Choose a new password for your account.</p>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded-md text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded-md text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
            >
              {showConfirm ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <p className="text-xs text-gray-400">Min 8 characters, 1 uppercase letter, 1 number.</p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-2 rounded-md text-sm hover:bg-gray-900 disabled:opacity-60 transition"
          >
            {loading ? "Resetting…" : "Reset Password"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-5">
          <Link to="/forgot-password" className="text-gray-800 font-medium hover:underline">
            Request a new link
          </Link>
        </p>
      </section>
    </main>
  );
};

export default ResetPassword;
