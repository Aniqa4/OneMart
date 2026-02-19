import React, { useState } from "react";

const initialUser = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+1 234 567 890",
  address: "123 Main St, Cityville, USA",
};

const orders = [
  {
    id: "ORD123",
    date: "2025-08-01",
    status: "Delivered",
    total: "$120.00",
    details: "Delivered on time, no issues.",
  },
  {
    id: "ORD124",
    date: "2025-08-05",
    status: "Processing",
    total: "$75.00",
    details: "Preparing for shipment.",
  },
  {
    id: "ORD125",
    date: "2025-08-09",
    status: "Shipped",
    total: "$45.00",
    details: "Left warehouse, arriving soon.",
  },
];

function statusColor(status: string) {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function UserDashboard() {
  const [user, setUser] = useState(initialUser);
  const [formData, setFormData] = useState(initialUser);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[0] | null>(
    null
  );

  // Handle user form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Save user info changes
  const handleSave = () => {
    setUser(formData);
    setIsEditProfileOpen(false);
  };

  // Cancel editing and reset form
  const handleCancel = () => {
    setFormData(user);
    setIsEditProfileOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 md:px-6">
      <div className="grid gap-10">
        {/* User Info Card */}
        <section className="flex-1 bg-white rounded-xl md:border border-gray-100 md:shadow-md md:p-8">
          <div className="flex justify-between gap-5 items-center mb-6">
            <h2 className="text-2xl font-semibold border-b border-gray-200 pb-3 text-gray-800">
              User Information
            </h2>
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="text-sm text-gray-600 hover:underline cursor-pointer"
              aria-label="Edit Profile"
            >
              Edit Profile
            </button>
          </div>

          <p className="mb-4 text-gray-700">
            <span className="font-semibold text-gray-900">Name:</span>{" "}
            {user.name}
          </p>
          <p className="mb-4 text-gray-700">
            <span className="font-semibold text-gray-900">Email:</span>{" "}
            {user.email}
          </p>
          <p className="mb-4 text-gray-700">
            <span className="font-semibold text-gray-900">Phone:</span>{" "}
            {user.phone}
          </p>
          <p className="mb-4 text-gray-700">
            <span className="font-semibold text-gray-900">Address:</span>{" "}
            {user.address}
          </p>
        </section>

        {/* Orders Card */}
        <section className="flex-[2_1_600px] md:border border-gray-100 rounded-xl md:shadow-md md:p-8 overflow-x-auto">
          <h2 className="text-2xl font-semibold border-b border-gray-200 pb-3 mb-8 text-gray-800">
            Order Details
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-20 italic">
              No orders found.
            </p>
          ) : (
            <table className="w-full table-auto border-collapse text-gray-700">
              <thead>
                <tr className="text-left border-b border-gray-300 uppercase text-sm tracking-wide">
                  <th className="py-3 lg:px-5">Order ID</th>
                  <th className="py-3 lg:px-5">Date</th>
                  <th className="py-3 lg:px-5">Status</th>
                  <th className="py-3 lg:px-5">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setSelectedOrder(order);
                    }}
                    aria-label={`View details for order ${order.id}`}
                  >
                    <td className="py-4 lg:px-5 font-medium">{order.id}</td>
                    <td className="py-4 lg:px-5">{order.date}</td>
                    <td className="py-4 lg:px-5">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 lg:px-5 font-semibold">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div
          className="fixed inset-0 bg-[#a0a0a0cf] bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-title"
          onClick={handleCancel}
        >
          <div
            className="bg-white rounded-lg max-w-lg w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="edit-profile-title" className="text-xl font-semibold mb-4">
              Edit Profile
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-4"
            >
              <div>
                <label
                  className="block text-gray-700 font-semibold mb-1"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 font-semibold mb-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 font-semibold mb-1"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 font-semibold mb-1"
                  htmlFor="address"
                >
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-4 mt-4 justify-end">
                <button
                  type="submit"
                  className="bg-gray-600 text-white px-5 py-2 rounded-md hover:bg-gray-700 transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </form>

            <button
              onClick={handleCancel}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold leading-none"
              aria-label="Close edit profile modal"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-[#a0a0a0cf] bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-details-title"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-lg max-w-lg w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="order-details-title" className="text-xl font-semibold mb-4">
              Order Details - {selectedOrder.id}
            </h3>
            <p className="mb-2">
              <strong>Date:</strong> {selectedOrder.date}
            </p>
            <p className="mb-2">
              <strong>Status:</strong>{" "}
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                  selectedOrder.status
                )}`}
              >
                {selectedOrder.status}
              </span>
            </p>
            <p className="mb-2">
              <strong>Total:</strong> {selectedOrder.total}
            </p>
            <p className="mb-4">
              <strong>Details:</strong> {selectedOrder.details}
            </p>
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold leading-none"
              aria-label="Close order details modal"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
