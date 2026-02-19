import { useNavigate } from "react-router";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
      <h1 className="text-5xl font-extrabold mb-6 text-gray-900">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Sorry, the page you are looking for does not exist.
      </p>

      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-black text-white rounded-md text-sm font-semibold hover:bg-gray-900 transition"
        aria-label="Go back to home page"
      >
        Go Back Home
      </button>
    </div>
  );
}