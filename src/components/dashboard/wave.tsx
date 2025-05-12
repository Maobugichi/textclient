import patt from "../../assets/sett.svg";
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
      <img className={`absolute top-[0px] object-cover md:left-0 h-fit  w-fit z-0 inset-0 ${width <= 400 ? 'left-0' : 'left-2'}`} src={patt} alt="circuit pattern"/>
   )
   
};
  
  export default WavePattern;
  