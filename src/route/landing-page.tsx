import Features from "../ui/features"
import Hero from "../ui/hero"
import LandingHeader from "../ui/landing_header"
import Reasons from "../ui/reasons"
import Service from "../ui/service"

const LandingPage = () => {
   
    return(
        <main className="h-fit min-h-[500vh] overflow-hidden text-[fcfbfa]">
            <LandingHeader/>
            <Hero/>
            <Features/>
            <Service/>
            <Reasons/>
        </main>
    )
}

export default LandingPage