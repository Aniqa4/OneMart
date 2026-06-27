import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import axiosInstance from "~/utilities/axiosInstance";

type Status = "loading" | "success" | "error";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the URL.");
      return;
    }

    axiosInstance
      .get(`/verify-email/${token}`)
      .then((res) => {
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully!");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Invalid or expired verification link.");
      });
  }, []);

  return (
    <main className="flex items-center justify-center px-4 py-32">
      <section className="w-full max-w-sm bg-white p-8 rounded-lg shadow text-center">
        {status === "loading" && (
          <>
            <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Verifying your email…</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold text-green-700 mb-2">Email Verified!</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link to="/login" className="inline-block bg-gray-800 text-white px-6 py-2 rounded-md text-sm hover:bg-gray-900">
              Sign In
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-5xl mb-4">✕</div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">Verification Failed</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link to="/dashboard" className="text-sm text-gray-600 hover:underline">
              Back to Dashboard
            </Link>
          </>
        )}
      </section>
    </main>
  );
};

export default VerifyEmail;
