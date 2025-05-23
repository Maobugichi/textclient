import { motion } from "motion/react";
import { useState , useEffect , useRef } from "react";
import axios from "axios";

  
const SlideShow = () => {
    const [ slides , setSlides ] = useState<any>([])
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

    useEffect(() => {
      async function getAdData() {
            try {
               const response = await axios.get('https://textflex-axd2.onrender.com/api/ads')
               //console.log(response.data.data)
               setSlides(response.data.data)
            }
            catch(err) {
              console.log(err)
            }
        }

        const myInterval = setInterval(() => {
          getAdData()
        }, 1000);

        return () => clearInterval(myInterval)
    },[])
      
    useEffect(() => {
      console.log(slides)
    },[])
    return(
        <div
        ref={containerRef}
        style={{ scrollSnapType: "x mandatory" }}
        className=" w-[85%] transition-all scroll-smooth gap-5 md:w-full  overflow-x-scroll h-[80px] hide-scrollbar  flex items-center">
           {slides.map((item:any) => (
            <motion.div
            style={{ scrollSnapAlign: "start" }}
            key={item.id} className={`flex-shrink-0 rounded-lg ${item.bg} w-full h-full`}>
               <img src={item.url} alt="ad" />
                {item.content}
            </motion.div>
           ))}
        </div>
    )
}

export default SlideShow