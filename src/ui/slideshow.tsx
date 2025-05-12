import { motion , AnimatePresence } from "motion/react";
import { useState , useEffect } from "react";
const slides = [
    { id: 1, content: 'Slide 1', bg: 'bg-red-300' },
    { id: 2, content: 'Slide 2', bg: 'bg-green-300' },
    { id: 3, content: 'Slide 3', bg: 'bg-blue-300' }
  ];
const SlideShow = () => {
    const [ index , setIndex ] = useState(0);

    useEffect(() => {
        setInterval(() => {
            setIndex((prev:any) => (prev + 1) % slides.length)
        }, 3000);
    },[])
      
    return(
        <div className="w-[85%] md:w-full mx-auto overflow-hidden  h-[80px]  flex items-center">
           <AnimatePresence mode="wait">
                <motion.div
                key={slides[index].id}
                className={` inset-0 flex items-center justify-center h-[85%] w-full md:w-[84%] rounded-lg text-2xl font-bold text-white ${slides[index].bg}`}
                initial={{ opacity: 0, x: 100, y:0  }}
                animate={{ opacity: 1, x: 0 , y: -5 }}
                exit={{ opacity: 0, x: -100 , y: 0 }}
                transition={{ duration: 0.6 }}
                >
                 {slides[index].content}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default SlideShow