import React, { useState } from "react";
import type { FormEvent } from "react";
import { FcGoogle } from "react-icons/fc";

const Login: React.FC = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleGoogleLogin = () => {
    alert("Google login triggered");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Credentials login triggered");
  };

  const handleForgotPasswordSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Password reset link sent!");
  };

  return (
    <main className="flex items-center justify-center px-4 py-20">
      <section className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-semibold text-center mb-4">
          {showForgotPassword ? "Reset Password" : "Login"}
        </h1>

        {!showForgotPassword ? (
          <>
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 border rounded-md py-2 text-sm hover:bg-gray-50 mb-4"
            >
              <FcGoogle className="text-lg" />
              Continue with Google
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full border px-3 py-2 rounded-md text-sm"
                required
              />
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border px-3 py-2 rounded-md text-sm"
                  required
                />
                <div className="text-right mt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-600 text-white py-2 rounded-md text-sm hover:bg-gray-700"
              >
                Log In
              </button>
            </form>
          </>
        ) : (
          <>
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border px-3 py-2 rounded-md text-sm"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Send Reset Link
              </button>
            </form>

            <p className="text-sm text-center text-gray-600 mt-4">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-blue-600 hover:underline"
              >
                Back to Login
              </button>
            </p>
          </>
        )}
      </section>
    </main>
  );
};

export default Login;
