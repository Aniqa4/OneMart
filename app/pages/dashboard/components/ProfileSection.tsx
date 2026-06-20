import { useState } from "react";
import { toast } from "react-toastify";
import type { AuthUser } from "~/store/auth/useAuthStore";

interface Props {
  user: AuthUser;
  updateProfile: (data: Partial<Pick<AuthUser, "name" | "phone" | "address">>) => Promise<void>;
}

export default function ProfileSection({ user, updateProfile }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, phone: user.phone || "", address: user.address || "" });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
      toast.success("Profile updated");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setForm({ name: user.name, phone: user.phone || "", address: user.address || "" });
  };

  const FIELDS = [
    { label: "Full Name", value: user.name },
    { label: "Email Address", value: user.email },
    { label: "Phone Number", value: user.phone || "—" },
    { label: "Delivery Address", value: user.address || "—" },
    {
      label: "Email Verified",
      value: (
        <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${user.isEmailVerified ? "text-green-600" : "text-amber-600"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${user.isEmailVerified ? "bg-green-500" : "bg-amber-500"}`} />
          {user.isEmailVerified ? "Verified" : "Not verified"}
        </span>
      ),
    },
    { label: "Auth Provider", value: user.authProvider === "google" ? "Google" : "Email & Password" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
          <p className="text-sm text-gray-400 mt-0.5">Your personal details and contact info</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-4 py-2 rounded-lg transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-5 max-w-lg">
          {[
            { key: "name" as const, label: "Full Name", type: "text", required: true },
            { key: "phone" as const, label: "Phone Number", type: "tel", required: false },
          ].map(({ key, label, type, required }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required={required}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Address</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-60 transition"
            >
              {loading ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="divide-y divide-gray-50">
          {FIELDS.map(({ label, value }) => (
            <div key={label} className="flex flex-col sm:flex-row sm:items-center py-4 gap-1">
              <span className="text-sm text-gray-400 sm:w-44 shrink-0">{label}</span>
              <span className="text-sm text-gray-900 font-medium">{value as any}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
