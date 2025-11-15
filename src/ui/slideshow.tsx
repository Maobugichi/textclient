import { motion } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../components/ui/skeleton";

import api from "../lib/axios-config";

const SlideShow = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  console.log(index)

  const {
    data: slides = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["ads"],
    queryFn: async () => {
      const response = await api.get("/api/ads");
      return response.data.data;
    },
    refetchInterval: 10000, 
  });


  useEffect(() => {
    if (!slides || slides.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    const slideWidth = container.children[0]?.clientWidth || 0;

    const slideInterval = setInterval(() => {
      setIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % slides.length;
        container.scrollTo({
          left: nextIndex * slideWidth,
          behavior: "smooth",
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(slideInterval);
  }, [slides]);

  if (isError) {
    return (
      <div className="w-full text-center py-6 text-red-500">
        Failed to load ads. <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  
  if (isLoading) {
    return (
      <div
        className="w-[85%] md:w-full overflow-x-hidden h-[80px] md:h-[120px] flex rounded-md"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="min-w-full h-full flex rounded-md overflow-hidden"
          >
            <Skeleton className="w-[35%] md:w-[50%] h-full rounded-l-md" />
            <div className="w-[65%] md:w-[50%] h-full flex flex-col justify-center gap-2 p-3 bg-muted">
              <Skeleton className="w-[70%] h-4 md:h-6" />
              <Skeleton className="w-[50%] h-4 md:h-6" />
            </div>
          </div>
        ))}
      </div>
    );
  }


  return (
    <div
      ref={containerRef}
      style={{ scrollSnapType: "x mandatory" }}
      className="w-[85%] md:w-full overflow-x-scroll h-[80px] md:h-[120px] hide-scrollbar flex gap-3"
    >
      {slides.map((item: any) => {
        const cleanUrl = item.url.replace(/([^:]\/)\/+/g, "$1");
        return (
          <Link key={item.id} className="min-w-full h-full rounded-4xl" to={item.link}>
            <motion.div
              style={{ scrollSnapAlign: "start" }}
              className={` ${item.bg} w-full h-full flex justify-between`}
            >
              <div className="w-[35%] md:w-[50%]">
                <img
                  src={cleanUrl}
                  className="rounded-l-3xl object-cover h-full w-full"
                  alt=""
                />
              </div>
              <div className="w-[65%] md:w-[50%] bg-blue-200 border border-gray-500 rounded-r-3xl grid place-items-center h-full">
                <div className="flex flex-col items-end justify-center pl-2 h-full pr-2 md:pr-5 gap-2 w-full">
                  <p className="w-[90%] text-[12px] md:text-xl">
                    {item.content}
                  </p>
                  <ArrowRight size={20} color="blue" />
                </div>
              </div>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
};

export default SlideShow;
