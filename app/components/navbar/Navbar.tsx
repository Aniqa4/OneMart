import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { IoBagHandleSharp } from "react-icons/io5";
import useCountCartItems from "~/store/cart/countCartItems";
import useManageCart from "~/store/cart/manageCart";
import useAuthStore from "~/store/auth/useAuthStore";
import useNotificationStore from "~/store/notifications/useNotificationStore";
import Cart from "./Cart";
import NotificationPanel from "./NotificationPanel";
import SearchBar from "./SearchBar";

function Navbar() {
  const { toggleCart } = useManageCart();
  const { cartItems } = useCountCartItems();
  const { user, accessToken, fetchProfile, profileFetched, logout, isAuthenticated } =
    useAuthStore();
  const { unreadCount, fetchUnreadCount, fetchNotifications } = useNotificationStore();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (accessToken && !profileFetched) fetchProfile(); }, [accessToken]);
  useEffect(() => { if (accessToken) fetchUnreadCount(); }, [accessToken]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNotifToggle = () => {
    const next = !notifOpen;
    setNotifOpen(next);
    setMenuOpen(false);
    if (next) fetchNotifications();
  };

  const handleLogout = async () => {
    setLogoutConfirm(false);
    setMenuOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <header className="brand-bg text-white">
      <div className="max-w-[1280px] px-5 lg:px-10 mx-auto h-16 grid grid-cols-3 items-center">
        <Link to="/" className="flex items-center">
          <span className="font-bold text-[1.2rem] tracking-tight">eCommerce</span>
        </Link>

        <div className="flex justify-center">
          <SearchBar />
        </div>

        <div className="flex items-center gap-1 justify-end">
          {/* Cart */}
          <button
            onClick={toggleCart}
            aria-label="Open cart"
            className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/15 transition"
          >
            <IoBagHandleSharp size={21} />
            {cartItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] text-[10px] font-bold bg-red-500 rounded-full flex items-center justify-center px-1 leading-none">
                {cartItems > 99 ? "99+" : cartItems}
              </span>
            )}
          </button>

          {/* Notifications */}
          {isAuthenticated() && (
            <div className="relative" ref={notifRef}>
              <button
                onClick={handleNotifToggle}
                aria-label="Notifications"
                className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/15 transition"
              >
                <svg className="w-[21px] h-[21px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] text-[10px] font-bold bg-red-500 rounded-full flex items-center justify-center px-1 leading-none">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
            </div>
          )}

          {/* User menu */}
          {isAuthenticated() && user ? (
            <div className="relative ml-1" ref={menuRef}>
              <button
                onClick={() => { setMenuOpen((o) => !o); setNotifOpen(false); }}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl hover:bg-white/15 transition"
              >
                <div className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center text-sm font-semibold overflow-hidden shrink-0">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-7 h-7 object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-sm font-medium hidden sm:block max-w-[110px] truncate leading-none">
                  {user.name}
                </span>
                <svg
                  className={`w-3 h-3 opacity-60 transition-transform duration-200 hidden sm:block ${menuOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="px-4 py-3.5 border-b border-gray-50">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                  </div>
                  <div className="p-1.5">
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Dashboard
                    </Link>
                    <button
                      onClick={() => { setMenuOpen(false); setLogoutConfirm(true); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-1 text-sm font-medium bg-white/15 hover:bg-white/25 px-4 py-2 rounded-xl transition"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      <Cart />

      {logoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Sign out</h3>
                <p className="text-xs text-gray-400 mt-0.5">Are you sure you want to sign out?</p>
              </div>
            </div>
            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setLogoutConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
