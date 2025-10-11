import { useEffect } from "react";

export const useTokenManager = (userData: any) => {
  useEffect(() => {
    if (userData?.token) {
      const expiry = Date.now() + 60 * 60 * 1000; // 1 hour
      localStorage.setItem("token", userData.token);
      localStorage.setItem("token_expiry", expiry.toString());
    } else {
      const token = localStorage.getItem("token");
      const expiry = localStorage.getItem("token_expiry");
      
      if (token && expiry && Date.now() > parseInt(expiry, 10)) {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
      }
    }
  }, [userData?.token]);
};