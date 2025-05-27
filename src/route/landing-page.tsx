import Features from "../ui/features"
import Footer from "../ui/footer"
import Hero from "../ui/hero"
import LandingHeader from "../ui/landing_header"
import Reasons from "../ui/reasons"
import Service from "../ui/service"
import TelIcon from "../ui/telicon"

const LandingPage = () => {
   
    return(
        <main className="h-fit min-h-screen overflow-x-hidden overflow-y-scroll hide-scrollbar">
            <LandingHeader/>
            <Hero/>
            <Features/>
            <Service/>
            <Reasons/>
            <Footer/>
            <TelIcon/>
        </main>
    )
}

export default LandingPage