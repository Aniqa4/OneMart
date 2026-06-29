import React, { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import useAuthStore from "~/store/auth/useAuthStore";

const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuthStore();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="flex items-center justify-center px-4 py-20">
        <section className="w-full max-w-sm bg-white p-6 rounded-lg shadow text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold mb-2">Check your email</h1>
          <p className="text-sm text-gray-500 mb-6">
            If an account exists for <span className="font-medium text-gray-700">{email}</span>, we've
            sent a password reset link. Check your inbox and spam folder.
          </p>
          <Link to="/login" className="text-sm text-gray-800 font-medium hover:underline">
            Back to Sign In
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center px-4 py-20">
      <section className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-semibold text-center mb-2">Forgot Password</h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          Enter your email and we'll send you a reset link.
        </p>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-2 rounded-md text-sm hover:bg-gray-900 disabled:opacity-60 transition"
          >
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-5">
          Remember your password?{" "}
          <Link to="/login" className="text-gray-800 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </section>
    </main>
  );
};

export default ForgotPassword;
