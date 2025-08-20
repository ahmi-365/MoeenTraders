import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserStatus = "guest" | "registered" | null;

export interface User {
  id: number;
  role_id?: number;
  name: string;
  email: string;
  mobile?: string | null;
  username?: string;
  image?: string;
  status?: number | string;
  created_at?: string | null;
  updated_at?: string | null;
  token?: string;
}

interface UserState {
  user: User | null;
  status: UserStatus;
  setUser: (user: User, status?: Exclude<UserStatus, null>) => Promise<void>;
  clearUser: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  status: null,

  setUser: async (user, status = "registered") => {
    await AsyncStorage.setItem("userData", JSON.stringify(user));
    await AsyncStorage.setItem("userStatus", status);
    set({ user, status });
  },

  clearUser: async () => {
    await AsyncStorage.removeItem("userData");
    await AsyncStorage.removeItem("userStatus");
    set({ user: null, status: null });
  },

  loadUser: async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      const storedStatus = await AsyncStorage.getItem("userStatus");

      if (userData) {
        set({ user: JSON.parse(userData), status: storedStatus as UserStatus });
      } else if (storedStatus === "guest") {
        set({ user: null, status: "guest" });
      } else {
        set({ user: null, status: null });
      }
    } catch (error) {
      console.error("Error loading user from storage:", error);
      set({ user: null, status: null });
    }
  },
}));
