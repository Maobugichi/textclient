import { useState , createContext , useMemo , useEffect } from "react";
interface ContextProps {
    children: React.ReactNode,
   
}

interface UserContextType {
    userData: any;
    setUserData: React.Dispatch<React.SetStateAction<any>>;
}

const ShowContext =  createContext<UserContextType | undefined>(undefined);

const  ContextProvider:React.FC<ContextProps> = ({ children }) => {
    const [userData, setUserData] = useState<any>(() => {
        const saved = localStorage.getItem("userData");
        return saved ? JSON.parse(saved) : {};
      });
    
      // Update localStorage when userData changes
      useEffect(() => {
        localStorage.setItem("userData", JSON.stringify(userData));
      }, [userData]);
    const contextValue = useMemo(() => (
        { userData, setUserData }
    ),[ userData])
    return(
        <ShowContext.Provider value={contextValue}>
            {children}
        </ShowContext.Provider>
    )
}

export { ShowContext ,   ContextProvider }  