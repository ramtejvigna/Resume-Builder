"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "../utils/api";

// Define types for user data based on CustomUser model
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
  provider?: string;
}

// Define types for authentication context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  register: (userData: RegisterData) => Promise<RegisterResult>;
  socialLogin: (provider: string, token: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

// Define types for login result
interface LoginResult {
  success: boolean;
  error?: string;
}

// Define types for register data
interface RegisterData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}

// Define types for register result
interface RegisterResult {
  success: boolean;
  error?: Record<string, string | string[]>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async (): Promise<void> => {
    try {
      const response = await api.get("/auth/profile/");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to load user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResult> => {
    try {
      const response = await api.post("/auth/login/", { email, password });
      const { user, access, refresh } = response.data;

      Cookies.set("access_token", access, { expires: 1 });
      Cookies.set("refresh_token", refresh, { expires: 7 });

      setUser(user);
      router.push("/dashboard");
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  };

  const register = async (userData: RegisterData): Promise<RegisterResult> => {
    try {
      const response = await api.post("/auth/register/", userData);
      const { user, access, refresh } = response.data;

      Cookies.set("access_token", access, { expires: 1 });
      Cookies.set("refresh_token", refresh, { expires: 7 });

      setUser(user);
      router.push("/dashboard");
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || "Registration failed",
      };
    }
  };

  const socialLogin = async (
    provider: string,
    token: string
  ): Promise<LoginResult> => {
    try {
      let endpoint: string;
      let payload: any;

      if (provider === "google") {
        // For Google, we send the credential (JWT token) directly
        endpoint = "/auth/google/";
        payload = {
          credential: token, // Google sends a JWT credential
        };
      } else if (provider === "linkedin") {
        endpoint = "/auth/linkedin/";
        payload = {
          token: token, // LinkedIn sends an access token
        };
      } else {
        throw new Error(`Unsupported provider: ${provider}`);
      }

      console.log(`Attempting ${provider} login with endpoint: ${endpoint}`);
      
      const response = await api.post(endpoint, payload);
      const { user, access, refresh } = response.data;
      
      Cookies.set("access_token", access, { expires: 1 });
      Cookies.set("refresh_token", refresh, { expires: 7 });
      
      setUser(user);
      router.push("/dashboard");
      return { success: true };
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      
      // Check if the endpoint doesn't exist (404 error)
      if (error.response?.status === 404) {
        console.error(`Backend endpoint ${provider === "google" ? "/auth/google/" : "/auth/linkedin/"} not found. Make sure your backend has this endpoint implemented.`);
      }
      
      router.push(`/login?error=${provider}_login_failed`);
      return {
        success: false,
        error: error.response?.data?.error || `${provider} login failed`,
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const refreshToken = Cookies.get("refresh_token");
      if (refreshToken) {
        await api.post("/auth/logout/", { refresh: refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        socialLogin,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};