import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const SlideShow = () => {
  const [slides, setSlides] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  
  useEffect(() => {
    if (slides.length === 0) return;

    const container = containerRef.current;
    if (!container) return;
   
    const slideWidth = container.children[0]?.clientWidth || 0; // safer calculation

    const slideInterval = setInterval(() => {
      setIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % slides.length;
        if (container) {
          container.scrollTo({
            left: nextIndex * slideWidth,
            behavior: "smooth",
          });
        }
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(slideInterval);
  }, [slides]); 
 
  useEffect(() => {
    async function getAdData() {
      try {
        const response = await axios.get('https://textflex-axd2.onrender.com/api/ads');
        setSlides(response.data.data);
      } catch (err) {
        console.log(err);
        console.log(index)
      }
    }

    getAdData(); 

    const intervalId = setInterval(() => {
      getAdData();
    }, 10000); 

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
    { 
     slides.length == 0 ? 
     <Skeleton className="w-[80%] h-20 bg-red-300 md:h-32 rounded-md" baseColor="#e0e0e0" highlightColor="#f5f5f5" /> 
    :
      <div
        ref={containerRef}
        style={{ scrollSnapType: "x mandatory" }}
        className="w-[95%] transition-all scroll-smooth gap-5 md:w-full overflow-x-scroll aspect-w-16 aspect-h-9 h-[80px] md:h-[120px] hide-scrollbar flex items-center"
      >
      {slides.map((item: any) => {
        const cleanUrl = item.url.replace(/([^:]\/)\/+/g, "$1");
        return (
        <Link className="w-full h-full" to={item.link}>
          <motion.div
            key={item.id}
            style={{
              scrollSnapAlign: "start",
            
            }}
            className={`flex-shrink-0 rounded-lg ${item.bg} w-full h-full flex justify-between`}
          >
            <div className="w-[35%] md:w-[50%]">
              <img src={cleanUrl} className="rounded-l-md object-cover h-full w-full" alt="" />
            </div>
            <div className=" w-[65%] md:w-[50%] bg-blue-200 border border-solid border-gray-500 rounded-r-md grid place-items-center h-full ">
              <div className="flex flex-col items-end justify-center pl-2 h-full pr-2 md:pr-5 gap-2 w-full">
                <p className="w-[90%] text-[12px] md:text-xl"> {item.content}</p>
                <ArrowRight size={20} color="blue"/>
              </div>
            </div>
          </motion.div>
        </Link> 
        );
      })}


      </div>
   }
  </> 
  );
};

export default SlideShow;
