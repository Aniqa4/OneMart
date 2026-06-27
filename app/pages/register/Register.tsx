import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAuthStore from "~/store/auth/useAuthStore";
import { MdOutlineMarkEmailRead } from "react-icons/md";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resending, setResending] = useState(false);

  const { signUp, signInWithGoogle, resendVerificationByEmail, loading, error, clearError, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) navigate("/dashboard", { replace: true });
  }, []);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const initGSI = () => {
      // @ts-ignore
      if (!window.google?.accounts) return;
      // @ts-ignore
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      // @ts-ignore
      window.google.accounts.id.renderButton(
        document.getElementById("google-btn-register"),
        { theme: "outline", size: "large", width: "100%" }
      );
    };

    const existing = document.getElementById("google-gsi-script");
    if (existing) {
      initGSI();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.id = "google-gsi-script";
      script.async = true;
      script.onload = initGSI;
      document.body.appendChild(script);
    }
  }, []);

  const handleGoogleResponse = async (response: any) => {
    clearError();
    try {
      await signInWithGoogle(response.credential);
      toast.success("Signed in with Google!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Google sign in failed");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await signUp(name, email, password, confirmPassword);
      setRegisteredEmail(email);
      setRegistered(true);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerificationByEmail(registeredEmail);
      toast.success("Verification email resent!");
    } catch {
      toast.error("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  if (registered) {
    return (
      <main className="flex items-center justify-center px-4 py-20">
        <section className="w-full max-w-sm bg-white p-8 rounded-lg shadow text-center">
          <MdOutlineMarkEmailRead className="mx-auto text-gray-700 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h2>
          <p className="text-sm text-gray-500 mb-1">
            We sent a verification link to
          </p>
          <p className="text-sm font-medium text-gray-800 mb-6">{registeredEmail}</p>
          <p className="text-xs text-gray-400 mb-6">
            Click the link in the email to activate your account, then sign in.
          </p>
          <Link
            to="/login"
            className="block w-full bg-gray-900 text-white py-2 rounded-md text-sm hover:bg-gray-700 transition mb-3"
          >
            Go to Sign In
          </Link>
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-sm text-gray-500 hover:text-gray-800 disabled:opacity-50 transition"
          >
            {resending ? "Sending…" : "Didn't get it? Resend"}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center px-4 py-20">
      <section className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-semibold text-center mb-6">Create Account</h1>

        {GOOGLE_CLIENT_ID ? (
          <div id="google-btn-register" className="mb-4" />
        ) : (
          <p className="text-xs text-center text-gray-400 mb-4">
            Google sign-in not configured (VITE_GOOGLE_CLIENT_ID missing)
          </p>
        )}

        <div className="flex items-center gap-3 mb-4">
          <hr className="flex-1 border-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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
              placeholder="Confirm Password"
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

          <p className="text-xs text-gray-400">
            Min. 8 characters with one uppercase letter and one number.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-2 rounded-md text-sm hover:bg-gray-900 disabled:opacity-60 transition"
          >
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-gray-800 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
