import Terms from "../components/terms"
import Footer from "./footer"
import LandingHeader from "./landing_header"


const Privacy = () => {
    return(
        <div>
            <p className="w-[90%] mx-auto text-gray-700 md:w-[40%] leading-7">In today’s fast-paced digital world, effective communication is crucial for business success. One powerful tool that companies can leverage is the Virtual Numbers API, which allows seamless integration of virtual phone numbers into their communication infrastructure.
             Virtual numbers, also known as Direct Inward Dialing (DID) numbers, are cloud-hosted telephone numbers that aren’t tied to a specific physical phone line. This makes them incredibly flexible and scalable, as they can be routed to any device or platform.
             By integrating a Virtual Numbers API, businesses gain numerous advantages. One of the most impactful is the ability to offer local phone numbers in various regions, even if the business operates from a different location. This creates a stronger local presence and helps build customer trust.
             The API also empowers businesses to manage their communication channels more efficiently. Features like call forwarding, IVR (Interactive Voice Response), and custom call routing rules ensure that calls reach the right team or department quickly—improving both responsiveness and customer satisfaction.
             Moreover, the Virtual Numbers API provides valuable communication analytics, such as call volume, duration, and patterns. This data can be used to optimize operations and refine communication strategies over time.
             In summary, the Virtual Numbers API is a smart investment for businesses looking to enhance their reach, streamline communications, and deliver a better experience to their customers.
            </p>
        </div>
    )
}


const PrivacyPage = () => {
    return(
        <main className="h-[100vh] mt-32">
         <Terms
          header="Privacy Policy"
         />
         <LandingHeader/>
         <Privacy/>
         <Footer/>
        </main>
    )
    
}

export default PrivacyPage