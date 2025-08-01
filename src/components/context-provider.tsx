import { useState, createContext, useMemo, useEffect } from "react";

interface ContextProps {
  children: React.ReactNode;
}

interface UserContextType {
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  theme: boolean;
  setTheme: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShowContext = createContext<UserContextType | undefined>(undefined);

const ContextProvider: React.FC<ContextProps> = ({ children }) => {
  const [userData, setUserData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("userData");
      return saved ? JSON.parse(saved) : {};
    } catch (err) {
      console.error("Error parsing userData from localStorage:", err);
      return {}; 
    }
  });
  const [theme, setTheme] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem("userData", JSON.stringify(userData));
    } catch (err) {
      console.error("Error saving userData to localStorage:", err);
    }
  }, [userData]);

  const contextValue = useMemo(
    () => ({ userData, setUserData, theme, setTheme }),
    [userData, theme]
  );

  return <ShowContext.Provider value={contextValue}>{children}</ShowContext.Provider>;
};

export { ShowContext, ContextProvider };