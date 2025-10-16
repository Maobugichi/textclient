import patt from "../../assets/Hex.svg";
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
      <img className={`absolute top-[0px] object-fill md:left-0   z-0 inset-0 ${width <= 400 ? 'left-0' : 'left-2'}`} src={patt} alt="circuit pattern"/>
   )
   
};
  
  export default WavePattern;
  