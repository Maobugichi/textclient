import { useState , createContext , useMemo , useEffect } from "react";
interface ContextProps {
    children: React.ReactNode,
   
}

interface UserContextType {
    userData: any; 
    setUserData: React.Dispatch<React.SetStateAction<any>>;
    theme:string;
    setTheme:React.Dispatch<React.SetStateAction<string>>;
}

const ShowContext =  createContext<UserContextType | undefined>(undefined);

const  ContextProvider:React.FC<ContextProps> = ({ children }) => {
    const [userData, setUserData] = useState<any>(() => {
        const saved = localStorage.getItem("userData");
        return saved ? JSON.parse(saved) : {};
      });
    const [ theme , setTheme ] = useState<any>('bg-white')  
    
      useEffect(() => {
        localStorage.setItem("userData", JSON.stringify(userData));
        
      }, [userData]);
    const contextValue = useMemo(() => (
        { userData, setUserData , theme , setTheme }
    ),[ userData])
    return(
        <ShowContext.Provider value={contextValue}>
            {children}
        </ShowContext.Provider>
    )
}

export { ShowContext ,   ContextProvider }  