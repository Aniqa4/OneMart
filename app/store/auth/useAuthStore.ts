import { create } from "zustand";
import axiosInstance from "~/utilities/axiosInstance";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  profilePicture: string;
  authProvider: "local" | "google";
  phone?: string;
  address?: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  profileFetched: boolean;
  signUp: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<Pick<AuthUser, "name" | "phone" | "address">>) => Promise<void>;
  changePassword: (current: string, next: string, confirm: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  resendVerificationByEmail: (email: string) => Promise<void>;
  isAuthenticated: () => boolean;
  clearError: () => void;
}

const load = (key: string): string | null =>
  typeof window !== "undefined" ? localStorage.getItem(key) : null;

const save = (at: string, rt: string) => {
  localStorage.setItem("accessToken", at);
  localStorage.setItem("refreshToken", rt);
};

const clear = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: load("accessToken"),
  refreshToken: load("refreshToken"),
  user: null,
  loading: false,
  error: null,
  profileFetched: false,

  clearError: () => set({ error: null }),

  signUp: async (name, email, password, confirmPassword) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.post("/signup", { name, email, password, confirmPassword });
      set({ loading: false });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Sign up failed";
      set({ loading: false, error: msg });
      throw new Error(msg);
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.post("/signin", { email, password });
      save(data.accessToken, data.refreshToken);
      set({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user, loading: false });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Sign in failed";
      set({ loading: false, error: msg });
      throw err;
    }
  },

  signInWithGoogle: async (credential) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.post("/google-signin", { token: credential });
      save(data.accessToken, data.refreshToken);
      set({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user, loading: false });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Google sign in failed";
      set({ loading: false, error: msg });
      throw new Error(msg);
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/logout", { refreshToken: get().refreshToken });
    } catch {
      // clear locally even if server errors
    }
    clear();
    set({ accessToken: null, refreshToken: null, user: null, profileFetched: false });
  },

  fetchProfile: async () => {
    if (!get().accessToken) {
      set({ profileFetched: true });
      return;
    }
    try {
      const { data } = await axiosInstance.get("/profile");
      // Sync tokens from localStorage in case the interceptor silently refreshed them
      const accessToken = localStorage.getItem("accessToken") ?? get().accessToken;
      const refreshToken = localStorage.getItem("refreshToken") ?? get().refreshToken;
      set({ user: data.user, accessToken, refreshToken, profileFetched: true });
    } catch {
      if (!localStorage.getItem("accessToken")) {
        set({ accessToken: null, refreshToken: null, user: null, profileFetched: false });
        return;
      }
      // Temporary failure (network error, 500) — unblock the spinner
      set({ profileFetched: true });
    }
  },

  updateProfile: async (profileData) => {
    const { data } = await axiosInstance.put("/profile", profileData);
    set({ user: data.user });
  },

  changePassword: async (currentPassword, newPassword, confirmNewPassword) => {
    await axiosInstance.put("/change-password", { currentPassword, newPassword, confirmNewPassword });
  },

  resendVerification: async () => {
    await axiosInstance.post("/resend-verification");
  },

  resendVerificationByEmail: async (email) => {
    await axiosInstance.post("/resend-verification", { email });
  },

  isAuthenticated: () => !!get().accessToken,
}));

export default useAuthStore;
