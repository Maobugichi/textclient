import heroImg from "../assets/hero-tex.png"
import Skeleton from "react-loading-skeleton"
const HeroImg = () => {
    return(
        <div className="h-[40vh] md:h-[90vh] relative md:right-[-120px] rounded-lg p-1 border border-solid border-red-200 overflow-hidden">
           {heroImg ? <img className="h-full" src={heroImg} alt="" /> :  <Skeleton height='90vh' baseColor="#e0e0e0" highlightColor="#f5f5f5" /> }
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-200 to-transparent pointer-events-none" />
        </div>
    )
}

export default HeroImg