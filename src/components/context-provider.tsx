import { useState , createContext , useMemo } from "react";

interface ContextProps {
    children: React.ReactNode,
   
}

interface UserContextType {
    userData: any;
}

const ShowContext =  createContext<UserContextType | undefined>(undefined);

const  ContextProvider:React.FC<ContextProps> = ({ children }) => {
    const [ userData , setUserData] = useState<any>({});

    const contextValue = useMemo(() => (
        {
            userData,
            setUserData
        }
    ),[ userData , setUserData])
    return(
        <ShowContext.Provider value={contextValue}>
            {children}
        </ShowContext.Provider>
    )
}

export default ContextProvider