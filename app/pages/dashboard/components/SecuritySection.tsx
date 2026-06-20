import { useState } from "react";
import { toast } from "react-toastify";
import type { AuthUser } from "~/store/auth/useAuthStore";

interface Props {
  user: AuthUser;
  changePassword: (current: string, next: string, confirm: string) => Promise<void>;
}

const PW_FIELDS = [
  { field: "currentPassword" as const, label: "Current Password", key: "current" as const },
  { field: "newPassword" as const, label: "New Password", key: "next" as const },
  { field: "confirmNewPassword" as const, label: "Confirm New Password", key: "confirm" as const },
];

export default function SecuritySection({ user, changePassword }: Props) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState({ current: false, next: false, confirm: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await changePassword(form.currentPassword, form.newPassword, form.confirmNewPassword);
      toast.success("Password changed successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900">Security</h2>
        <p className="text-sm text-gray-400 mt-0.5">Manage your password and account security</p>
      </div>

      {user.authProvider === "google" ? (
        <div className="flex items-start gap-4 p-5 rounded-xl bg-blue-50 border border-blue-100">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-blue-700">
            You signed in with Google. Password management is handled through your Google account.
          </p>
        </div>
      ) : (
        <div className="max-w-lg">
          <h3 className="text-base font-semibold text-gray-900 mb-5">Change Password</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {PW_FIELDS.map(({ field, label, key }) => (
              <div key={field} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input
                  type={show[key] ? "text" : "password"}
                  value={form[field]}
                  onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm pr-14 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((p) => ({ ...p, [key]: !p[key] }))}
                  className="absolute right-3.5 bottom-2.5 text-xs text-gray-400 hover:text-gray-600 transition"
                >
                  {show[key] ? "Hide" : "Show"}
                </button>
              </div>
            ))}
            <p className="text-xs text-gray-400 pt-1">Minimum 8 characters with one uppercase letter and one number.</p>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-60 transition mt-2"
            >
              {loading ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
