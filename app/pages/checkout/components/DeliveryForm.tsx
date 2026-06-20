import type { CheckoutForm } from "../interface/checkout.types";
import { DELIVERY_OPTIONS } from "../interface/checkout.types";

interface Props {
  form: CheckoutForm;
  placing: boolean;
  total: number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function DeliveryForm({ form, placing, total, onChange, onSubmit, onCancel }: Props) {
  return (
    <section className="md:w-1/2 bg-white rounded-xl lg:shadow lg:p-6 flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Delivery Details</h2>

      <form onSubmit={onSubmit} className="space-y-4 flex flex-col flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              required
              placeholder="Your full name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={onChange}
            placeholder="+880..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
          <textarea
            name="address"
            value={form.address}
            onChange={onChange}
            required
            rows={3}
            placeholder="Street, City, District, Postal Code"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Location <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            {DELIVERY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex-1 flex items-center justify-between border rounded-lg px-3 py-2.5 cursor-pointer text-sm transition ${
                  form.deliveryLocation === opt.value
                    ? "border-black bg-gray-50 font-medium"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="deliveryLocation"
                    value={opt.value}
                    checked={form.deliveryLocation === opt.value}
                    onChange={onChange}
                    className="accent-black"
                  />
                  {opt.label}
                </span>
                <span className="text-gray-500">৳{opt.charge}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <div className="flex items-center gap-2 border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-700">
            <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2M5 9h14l1 11H4L5 9z" />
            </svg>
            Cash on Delivery
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (optional)</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={onChange}
            rows={2}
            placeholder="Special instructions, colour preferences, etc."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex gap-3 mt-auto pt-4">
          <button
            type="submit"
            disabled={placing}
            className="flex-1 bg-black text-white py-3 rounded-lg text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {placing
              ? "Placing Order…"
              : total !== null
              ? `Place Order · BDT ${total.toFixed(2)}`
              : "Place Order"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
