import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAuthStore from "~/store/auth/useAuthStore";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, signInWithGoogle, loading, error, clearError, isAuthenticated } = useAuthStore();
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
        document.getElementById("google-btn-login"),
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
      toast.success("Signed in successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Google sign in failed");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await signIn(email, password);
      toast.success("Signed in successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <main className="flex items-center justify-center px-4 py-20">
      <section className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-semibold text-center mb-6">Sign In</h1>

        {GOOGLE_CLIENT_ID ? (
          <div id="google-btn-login" className="mb-4" />
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-2 rounded-md text-sm hover:bg-gray-900 disabled:opacity-60 transition"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-5">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-gray-800 font-medium hover:underline">
            Register
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
