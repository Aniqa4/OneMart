import { useNavigate } from "react-router";

interface Props {
  orderId: string;
}

export default function OrderSuccessScreen({ orderId }: Props) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md p-10 max-w-md w-full text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Order Placed!</h2>
        <p className="text-gray-500 text-sm">
          Thank you for your purchase. We'll process your order shortly.
        </p>
        <p className="text-xs text-gray-400 font-mono break-all">Order ID: {orderId}</p>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="border border-gray-300 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
