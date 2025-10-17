import { useEffect, useState } from "react";
import checkAuth from "../components/checkauth";
import { useAuth } from "../context/authContext";

export const useCheckAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user: userData } = useAuth();

  useEffect(() => {
    async function fetchAuth() {
      const result = await checkAuth();
      // Ensure it's strictly boolean
      setIsAuthenticated(!!(result && userData?.userId));
    }
    fetchAuth();
  }, [userData?.userId]); // Re-run when user changes

  return isAuthenticated;
};
