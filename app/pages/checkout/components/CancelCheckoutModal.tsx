interface Props {
  onConfirm: () => void;
  onClose: () => void;
}

export default function CancelCheckoutModal({ onConfirm, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Cancel Checkout?</h3>
        <p className="text-sm text-gray-500 mb-6">
          Your cart items will be saved. Are you sure you want to go back?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border text-sm hover:bg-gray-50 transition"
          >
            Keep Checking Out
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition"
          >
            Yes, Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
