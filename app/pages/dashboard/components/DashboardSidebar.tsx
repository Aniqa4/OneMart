import React from "react";
import type { AuthUser } from "~/store/auth/useAuthStore";
import type { Section } from "../interface/dashboard.types";

const NAV_ITEMS: { key: Section; label: string; icon: React.ReactNode }[] = [
  {
    key: "profile",
    label: "Profile",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    key: "orders",
    label: "My Orders",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    key: "security",
    label: "Security",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
];

interface Props {
  user: AuthUser;
  section: Section;
  onSectionChange: (s: Section) => void;
}

export default function DashboardSidebar({ user, section, onSectionChange }: Props) {
  return (
    <aside className="lg:w-64 shrink-0">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white text-xl font-bold mb-3 overflow-hidden">
            {user.profilePicture
              ? <img src={user.profilePicture} alt={user.name} className="w-14 h-14 object-cover" />
              : user.name.charAt(0).toUpperCase()
            }
          </div>
          <p className="font-semibold text-gray-900 leading-tight">{user.name}</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{user.email}</p>
        </div>

        <nav className="p-3">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => onSectionChange(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 last:mb-0 ${
                section === item.key
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
