import { motion } from "motion/react";
import { useState , useEffect , useRef } from "react";
const slides = [
    { id: 1, content: 'Slide 1', bg: 'bg-red-300' },
    { id: 2, content: 'Slide 2', bg: 'bg-green-300' },
    { id: 3, content: 'Slide 3', bg: 'bg-blue-300' }
  ];
  
const SlideShow = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [ index , setIndex ] = useState(0);
   
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
  
      const slideInterval = setInterval(() => {
        const nextIndex = (index + 1) % slides.length;
        const slideWidth = container.offsetWidth * 0.85; // match w-[85%]
        container.scrollTo({
          left: nextIndex * slideWidth,
          behavior: "smooth"
        });
        setIndex(nextIndex);
      }, 3000);
  
      return () => clearInterval(slideInterval);
    },[index])
      
    return(
        <div
        ref={containerRef}
        style={{ scrollSnapType: "x mandatory" }}
        className=" w-[85%] transition-all scroll-smooth gap-5 md:w-[84%] overflow-x-scroll h-[80px] hide-scrollbar  flex items-center">
           {slides.map((item:any) => (
            <motion.div
            style={{ scrollSnapAlign: "start" }}
            key={item.id} className={`flex-shrink-0 ${item.bg} w-full h-full`}>
                {item.content}
            </motion.div>
           ))}
        </div>
    )
}

export default SlideShow