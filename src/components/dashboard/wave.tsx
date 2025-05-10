import patt from "../../assets/sett.svg";
import patt2 from "../../assets/circuit.svg";
import { useEffect, useState } from "react";
const WavePattern = () => {
   const [ width , setWidth ] = useState<any>(window.innerWidth)

   useEffect(() => {
      const handleWidth = () => {
         setWidth(window.innerWidth);
      }

      window.addEventListener('resize' , handleWidth);
      return () =>  window.removeEventListener('resize' , handleWidth);
   },[])
   return(
      <img className="absolute top-[0px] object-contain md:left-0 h-fit  w-fit z-0 inset-0 left-2" src={width <= 600 ? patt2 : patt}/>
   )
   
};
  
  export default WavePattern;
  