import axios from "axios";
import { useEffect, useState } from "react";
import ServiceBlock from "../components/service_block";
import { AnimatePresence, motion } from "motion/react";
import Button from "../components/button";
const Service = () => {
    const brandNames: string[] = ["apple", "google", "microsoft", "discord" , 'whatsapp' , 'facebook' , 'tiktok' , 'tinder' , 'twitter' ,'telegram' , 'instagram' , 'amazon', 'wechat'];
      const [ brand , setBrand ] = useState<any>([]);
      const [ country , setCountry ] = useState<any[]>([])
      const [ isActive , setIsActive ] = useState<any>({
        country:false,
        service:true
      })
       const bearer = 'CwxD7iISBBCT7bsTffTONmFk0X0+SXFVtEgJQnc4odY='
      useEffect(() => {
        async function fetchBrandData() {
           
           
            const allBrandData: any[] = [];
            const seenBrands: Set<string> = new Set();

            try {
                for (const brand of brandNames) {
                    try {
                        const response = await axios.get(`https://api.brandfetch.io/v2/search/${brand}`, {
                            headers: {
                                Authorization: `Bearer ${bearer}`
                            }
                        });

                        const brandArray = response.data;
                        console.log("Brandfetch data for", brand, brandArray);

                        for (const brandData of brandArray) {
                            const normalizedBrandName = brandData.name.toLowerCase().trim();
                            if (!seenBrands.has(normalizedBrandName)) {
                                if (brandData.name.toLowerCase() === brand)
                                    allBrandData.push(brandData);
                                seenBrands.add(normalizedBrandName);
                            }
                        }
                    } catch (brandErr) {
                        console.error("Brandfetch API failed for:", brand, brandErr);
                    }
                }

                try {
                    const meme = await axios.get(`https://restcountries.com/v3.1/all?fields=name,flags`);
                    setCountry(meme.data.slice(14, 26));
                } catch (countryErr) {
                    console.error("RestCountries API failed", countryErr);
                }
                localStorage.setItem("brands",JSON.stringify(allBrandData))
                setBrand(allBrandData);
            } catch (err) {
                console.log("Unexpected error:", err);
            }
        }

      fetchBrandData()
      },[])

      function handleClick(e:React.MouseEvent<HTMLDivElement>) {
        const target = e.currentTarget.innerText;
         if (target == 'Countries') {
            setIsActive({
                country:true,
                service:false
            })
         } else {
            setIsActive({
                country:false,
                service:true
            })
         }
      }
      
      return(
        <div className="w-full  relative mt-20 h-fit min-h-[120vh] grid place-items-center bg-[#eef4fd] pb-10">
            <div className="w-full   flex flex-col gap-5 h-fit min-h-[100vh] items-center">
                <div className="w-full text-center h-fit min-h-[50vh] flex flex-col justify-center gap-5 items-center">
                  <h2 className="text-2xl md:text-4xl font-semibold">Supported Services and Countries</h2>
                <p className="w-[80%] md:w-[45%] text-lg text-gray-400 mx-auto text-center">Easily access temporary, disposable numbers for secure SMS verification, account sign-ups, and service-specific registrations across multiple countries</p>
                <div className="flex w-full  items-center justify-center cursor-pointer">
                    <div onClick={handleClick} className="w-[40%] md:w-[10%]">
                        Services
                    </div>
                    <div onClick={handleClick} className="w-[40%] md:w-[10%]">
                        Countries
                    </div>
                </div>
                </div>
                <AnimatePresence>
                    {
                        isActive.service &&
                            <motion.div 
                            initial={{ opacity : 0}}
                            animate={{ opacity: 1}}
                            exit={{ opacity: 0}}
                            className="w-[80%] rounded-xs bg-white h-fit min-h-[75vh]   flex flex-wrap justify-center bg-green">
                            {
                                brand?.map((brand:any, index:any) => (
                                    <ServiceBlock
                                    icon={brand.icon}
                                    text={brand.name}
                                    className={`${[1, 4, 7 , 10].includes(index) ? 'border-l border-r border-b ' : 'border-b'} ${[9, 10, 11 ].includes(index) ? ' border-b-white ' : 'border-b'}`}
                                    />
                                ))
                            }
                            </motion.div> 
                        }

                        {
                        isActive.country && (
                            <motion.div 
                            initial={{ opacity : 0}}
                            animate={{ opacity: 1}}
                            exit={{ opacity: 0}}
                            className="w-[80%] rounded-xs bg-white h-fit min-h-[75vh] mx-auto  flex flex-wrap justify-center">
                                {
                                    country.map((item:any,index:any) => (
                                        <ServiceBlock
                                        icon={item.flags.svg}
                                        text={item.name.common}
                                        className={`${[1, 4, 7 , 10].includes(index) ? 'border-l border-r border-b ' : 'border-b'} ${[9, 10, 11 ].includes(index) ? ' border-b-white ' : 'border-b'}`}
                                        />
                                    ))
                                }
                            
                            </motion.div> 
                        )
                    
                        }
                </AnimatePresence>    
                <Button
                  content="See all services "
                  className="bg-[#0032a5] rounded-sm h-10 text-white w-[40%] md:w-[15%]"
                /> 
            </div>
        </div>
      )
      
}

export default Service