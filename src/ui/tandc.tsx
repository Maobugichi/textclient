import TermsNav from "./termsNav"
import Terms from "../components/terms"
import LandingHeader from "./landing_header"
import Footer from "./footer"
import { ArrowRight } from "lucide-react";
import ScrollToSection from "./scrollToSection";

interface DefinitionProp {
    header:string;
    text:string;
}

const Container:React.FC<DefinitionProp> = ({header , text}) => {
    return(
        <div id='container' className="w-[90%] mx-auto">
            <h3 className="h-15 md:h-20 text-2xl font-semibold">{header}</h3>
            <div className=" md:text-lg text-sm text-gray-700 border border-gray-50 shadow-sm md:h-64 h-fit min-h-74  tracking-wide leading-8 p-5 md:p-10 rounded-sm">
                <p className="w-[80%]">{text}</p>
            </div>
        </div>
    )
}

const Contact = () => {
    return(
    
        <div id='contact' className="bg-[#F9FAFB] p-6 md:p-10 h-[250px] flex flex-col justify-center md:gap-5 gap-8 w-[90%] mx-auto  rounded-md">
         <h3 className="text-xl font-semibold w-full">Contact Us</h3>
         <p className="text-[15px] md:text-lg h-15 md:leading-7 w-[80%] text-gray-600">If you have any questions or concerns regarding these Terms or how we manage your personal data, please feel free to reach out to us at: </p>
         <span className="text-[15px] md:text-lg text-blue-400 underline flex items-center gap-1 ">📧 Email: textflex7@gmail.com <ArrowRight size={20}/></span>
        </div>
   
    )
    
}


const Definitions:React.FC<DefinitionProp> = ({header,text}) => {
    return(
        <section  className="h-fit grid">
           <h3 id='definitions' className="text-xl h-10 font-semibold">{header}</h3>
           <p className="pl-6 text-lg text-gray-400 md:h-20 h-32">{text}</p>
        </section>
    )
}

const Permission = () => {
    const permission = [ 'Republish any content from the Site', 'Use Site materials for commercial purposes or public display', 'Reproduce, share, distribute, modify, or duplicate any content', 'Remove or alter any copyright or intellectual property notices', 'Attempt to reverse-engineer, decompile, or reconstruct any software components' , 'Use the Site or Services for unlawful or unauthorized purposes', 'Undermine or compromise the security and integrity of the Service', 'Distribute unsolicited promotions, advertisements, or spam' , 'Submit fake or fraudulent orders to manipulate the system.', 'Use stolen or unauthorized credit/debit cards for transactions']
    return(
        <div id='permission' className=" w-[90%] mx-auto grid gap-5">
            <h3 className="text-2xl h-32 flex items-center font-semibold">Permission to Use</h3>

           
            <div className="border border-solid md:w-[90%] w-full mx-auto md:mx-0 grid  md:place-items-baseline place-items-center rounded-md h-[110vh] md:h-[800px] p-5 border-gray-50 shadow-sm">
                 <p className="leading-7  mx-auto text-lg text-gray-500 ">All materials on this Site are the intellectual property of TEXTFLEX ENTERPRISES and/or its licensors. These rights are fully protected under applicable intellectual property laws. Access to such materials is granted solely for your personal, non-commercial use, and is strictly subject to the limitations outlined in these Terms and Conditions.</p>
                <h4 className="text-lg font-semibold h-10 ">By using this Site, you agree not to:</h4>
                <ul className=" list-disc list-inside grid place-items-center text-gray-700 ">
                    { permission.map((per:any) => (
                    <li className=" h-12 w-full md:pl-5 mx-auto text-[15px] flex items-center relative md:text-lg gap-1"><span className="w-1 h-1 bg-gray-400  rounded-full"></span>{per}</li>
                    ))}
                </ul>
                
            </div>
        </div>
    )
}

const TermsConditions = () => {
    const navigations = [ "Definitions","Permission to Use","Restrictions","Your Account","Compliance","Intellectual Property","Disclaimer","Contact"]
    const definitions = [
        {
            header:`"${'We or TEXTPLUG ENTERPRISES'}"`,
            text:'Refers to the administrators and operators of the Site.'
        } ,
        {
            header:`"${"Website or Service"}"`,
            text:'Represents the system of graphical content, informational resources, software, and databases accessible online via Textplug.net.'
        } ,
        {
            header:`"${"Visitors"}"`,
            text:'Individuals who access and browse our Website without registering as members.'
        } ,
        {
            header:`"${"User"}"`,
            text:'Any individual who has successfully registered on the Site and utilizes its Services.'
        } ,
        {
            header:`"${"Content"}"`,
            text:'Encompasses all forms of information and media presented on the Site, including text, images, audio, and video.'
        } 
    ]
    const content = [
        {
            header:'Restrictions on Use',
            text:'To prevent misuse and potential illegal activities, our Site employs safeguards and filters designed to detect and block fraudulent behavior.The services and products offered through the Site must only be used for lawful purposes. Without prior written authorization, the use of automated tools (such as scraping or data extraction technologies) or any method that alters or deletes information on the Site is strictly prohibited.'
        },
         {
            header:'Account Responsibility',
            text:'You are solely responsible for maintaining the confidentiality of your login credentials and for all activities conducted under your account. You agree not to disclose sensitive information related to your account or the Site, including usernames, passwords, or other personal data.'
        },
         {
            header:'Legal Compliance',
            text:'You agree to adhere to all applicable local, national, and international laws and regulations while using our Site. TEXTPLUG ENTERPRISES reserves the right to investigate any reported violations of these Terms and take appropriate action where necessary.'
        },
         {
            header:'Intellectual Property',
            text:'All content on this Site — including text, images, graphics, and logos — is protected by intellectual property laws and may include trademarks belonging to TEXTPLUG ENTERPRISES or its partners. Use of these materials does not grant you ownership or licensing rights unless explicitly authorized in writing by the respective rights holder.'
        },
         {
            header:'Disclaimer',
            text:'All materials and content on this Site are provided “as is.” TEXTPLUG ENTERPRISES makes no express or implied warranties, including but not limited to, implied warranties of merchantability or fitness for a particular purpose related to any of our services or products.'
        },
        
    ]
    return(
        <div className=" md:w-[80%] mx-auto grid gap-10">
            <p className="w-[90%] mx-auto text-lg text-gray-700">These Terms and Conditions, together with any applicable license agreements and other documents made available on our website (the "Site"), collectively form the complete and binding agreement between you and TEXTPLUG ENTERPRISES. They supersede all prior agreements, representations, warranties, and understandings—whether written or verbal—relating to your use of the Site.</p>

            <div className="bg-[#F9FAFB] w-[90%] mx-auto p-10 grid gap- rounded-md">
                <h2 className="text-xl mt-5 font-semibold">Quick Navigation</h2>
                <ul className="pl-7 flex flex-wrap relative">
                    {
                        navigations.map((nav:any) => (
                            <TermsNav
                             text={nav}
                            />
                        ))
                    }
                </ul>
               
            </div>

             <div className="w-[90%] mx-auto">
                {definitions.map((nav:any) => (
                    <Definitions
                        header={nav.header}
                        text={nav.text}
                    />
                 ))}
              </div>
              <Permission/>
              {
                content.map((cont:any) => (
                    <Container
                     header={cont.header}
                     text={cont.text}
                    />
                ))
              }
              <Contact/>
        </div>
    )
}

const TermsPage = () => {
    return(
        <main className="h-[100vh] mt-32 grid gap-10">
        <ScrollToSection/>
         <Terms
          header="Terms and Conditions"
         />
         <LandingHeader/>
            <TermsConditions/>
         <Footer/>
        </main>
    )
}

export default TermsPage
