import axios from "axios";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ServiceBlock from "../components/service_block";
import { AnimatePresence, motion } from "motion/react";
import Button from "../components/button";
import { Skeleton } from "../components/ui/skeleton";

const brandNames: string[] = [
  "apple", "google", "microsoft", "discord", "whatsapp", 
  "facebook", "tiktok", "tinder", "twitter", "telegram", 
  "instagram", "amazon", "wechat"
];

const Service = () => {
  const [isActive, setIsActive] = useState<any>({
    country: false,
    service: true
  });
  
  const bearer = 'CwxD7iISBBCT7bsTffTONmFk0X0+SXFVtEgJQnc4odY=';

 
  const { data: brands, isLoading: brandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
     
      const allBrandData: any[] = [];
      const seenBrands: Set<string> = new Set();

      for (const brand of brandNames) {
        try {
          const response = await axios.get(
            `https://api.brandfetch.io/v2/search/${brand}`,
            {
              headers: {
                Authorization: `Bearer ${bearer}`
              }
            }
          );

          const brandArray = response.data;

          for (const brandData of brandArray) {
            const normalizedBrandName = brandData.name.toLowerCase().trim();
            if (!seenBrands.has(normalizedBrandName)) {
              if (brandData.name.toLowerCase() === brand) {
                allBrandData.push(brandData);
              }
              seenBrands.add(normalizedBrandName);
            }
          }
        } catch (brandErr) {
          console.error("Brandfetch API failed for:", brand, brandErr);
        }
      }

      localStorage.setItem("brands", JSON.stringify(allBrandData));
      return allBrandData;
    },
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });

 
  const { data: countries, isLoading: countriesLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await axios.get(
        `https://restcountries.com/v3.1/all?fields=name,flags`
      );
      return response.data.slice(14, 26);
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.currentTarget.innerText;
    if (target === "Countries") {
      setIsActive({
        country: true,
        service: false
      });
    } else {
      setIsActive({
        country: false,
        service: true
      });
    }
  }

  return (
    <div className="w-full relative mt-20 h-fit min-h-[120vh] grid place-items-center bg-[#eef4fd] pb-10">
      <div className="w-full flex flex-col gap-5 h-fit min-h-[100vh] items-center">
        <div className="w-full text-center h-fit min-h-[50vh] flex flex-col justify-center gap-5 items-center">
          <h2 className="text-2xl md:text-4xl font-semibold">
            Supported Services and Countries
          </h2>
          <p className="w-[90%] md:w-[45%] text-lg text-gray-500 mx-auto text-center">
            Easily access temporary, disposable numbers for secure SMS
            verification, account sign-ups, and service-specific registrations
            across multiple countries
          </p>
          <div className="flex w-full items-center justify-center cursor-pointer gap-4">
            <div
              onClick={handleClick}
              className={`px-6 py-2 text-lg tracking-wider rounded-lg transition-all ${
                isActive.service
                  ? "bg-[#0032a5] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Services
            </div>
            <div
              onClick={handleClick}
              className={`px-6 py-2 text-lg tracking-wider rounded-lg transition-all ${
                isActive.country
                  ? "bg-[#0032a5] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Countries
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isActive.service && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-[80%] rounded-lg bg-white h-fit min-h-[75vh] flex flex-wrap justify-center"
            >
              {brandsLoading ? (
                // Skeleton loading state for brands
                <>
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div
                      key={index}
                      className="w-full md:w-1/4 h-32 p-4 border-b flex flex-col items-center justify-center gap-3"
                    >
                      <Skeleton className="w-16 h-16 rounded-full" />
                      <Skeleton className="w-24 h-4" />
                    </div>
                  ))}
                </>
              ) : (
                brands?.map((brand: any, index: any) => (
                  <ServiceBlock
                    key={brand.name}
                    icon={brand.icon}
                    text={brand.name}
                    className={`${
                      [1, 4, 7, 10].includes(index)
                        ? "border-l border-r border-b"
                        : "border-b"
                    } ${
                      [9, 10, 11].includes(index) ? "border-b-white" : "border-b"
                    }`}
                  />
                ))
              )}
            </motion.div>
          )}

          {isActive.country && (
            <motion.div
              key="countries"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-[80%] rounded-lg bg-white h-fit min-h-[75vh] mx-auto flex flex-wrap justify-center"
            >
              {countriesLoading ? (
                // Skeleton loading state for countries
                <>
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div
                      key={index}
                      className="w-full md:w-1/4 h-32 p-4 border-b flex flex-col items-center justify-center gap-3"
                    >
                      <Skeleton className="w-16 h-12 rounded" />
                      <Skeleton className="w-32 h-4" />
                    </div>
                  ))}
                </>
              ) : (
                countries?.map((item: any, index: any) => (
                  <ServiceBlock
                    key={item.name.common}
                    icon={item.flags.svg}
                    text={item.name.common}
                    className={`${
                      [1, 4, 7, 10].includes(index)
                        ? "border-l border-r border-b"
                        : "border-b"
                    } ${
                      [9, 10, 11].includes(index) ? "border-b-white" : "border-b"
                    }`}
                  />
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          content="See all services"
          className="bg-[#0032a5] rounded-xl text-lg tracking-wider h-10 text-white px-4 "
        />
      </div>
    </div>
  );
};

export default Service;