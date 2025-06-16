import { useContext } from "react";
import { ShowContext } from "../components/context-provider";


const EsimPlans = () => {
     const myContext = useContext(ShowContext);
     if (!myContext) throw new Error("ShowContext must be used within a ContextProvider");
     const { theme } = myContext;
    return(
        <div className="h-[90vh] grid place-items-center">
           <h2 className={`text-xl font-semibold ${theme ?  'bg-transparent' : "bg-white"}`}>....Coming soon!</h2> 
        </div>
    )
}

export default EsimPlans