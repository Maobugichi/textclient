import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  userId: string ;
  userEmail:string;
  username: string;
  userNumber:string
  avatar_url?: string;
}

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (data: { user: User; cartId: number; token: string }) => void;
  logout: () => void;
  getToken: () => string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
   const queryClient = useQueryClient(); 

  useEffect(() => {
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth) {
      try {
        const { user } = JSON.parse(savedAuth);
        setUser(user);
      } catch (error) {
        console.error("Failed to parse auth data:", error);
        localStorage.removeItem("auth");
      }
    }
  }, []);

  const login = (data: { user: User; cartId: number; token: string }) => {
    setUser(data.user);
    localStorage.setItem("auth", JSON.stringify({ user: data.user }));
    localStorage.setItem("authToken", data.token);
  };

  const logout = () => {
    setUser(null);
    queryClient.clear(); 
    localStorage.removeItem("auth");
    localStorage.removeItem("authToken");
  };

  const getToken = (): string | null => localStorage.getItem("authToken");

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
