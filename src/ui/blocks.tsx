import React, { useEffect, useState } from "react";
import Button from "../components/button";
import Overlay from "../components/overlay";
import Skeleton from "react-loading-skeleton";
import { HiEye, HiEyeOff } from "react-icons/hi";
import patt from "../assets/Hex.svg"
interface BlocksProps {
    extra?: string;
    amount?: string;
    icon?: React.ReactNode;
    content?: string;
    btnIcon?: React.ReactNode;
    className?: string;
    isMerge?: boolean;
}

const Blocks: React.FC<BlocksProps> = ({
    extra,
    amount,
    icon,
    content,
    btnIcon,
    className,
    isMerge
}) => {
    const [showBalance, setShowBalance] = useState<boolean>(false);

    useEffect(() => {
        const saved = localStorage.getItem("showBalance");
        if (saved !== null) setShowBalance(saved === "true");
    }, []);

    useEffect(() => {
        localStorage.setItem("showBalance", String(showBalance));
    }, [showBalance]);

   
    const toggleBalance = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowBalance((prev) => !prev);
    };

    const formattedAmount =
        extra === "Balance"
            ? `₦${Number(String(amount).replace(/[^0-9.-]+/g, "")).toLocaleString(
                "en-NG",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }
            )}`
            : amount;

    return (
        <div 
        style={{
        backgroundImage: `url(${patt})`,
        backgroundSize: "cover", 
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
       
      }}
        className={`${className} `}>
            <div className="flex w-[90%] justify-between relative z-10">
                <p className="flex flex-col text-2xl tracking-wider font-semibold">
                    <span className="text-sm">{extra ? extra : <Skeleton count={1} />}</span>
                    {extra === "Balance" ? (
                        showBalance ? (
                            formattedAmount
                        ) : (
                            "₦*****"
                        )
                    ) : (
                        formattedAmount
                    )}
                </p>
                <div className="flex items-center gap-2">
                    {extra === "Balance" && (
                        <button
                            onClick={toggleBalance} 
                            className="p-1 relative z-20 text-gray-600 hover:text-gray-900 transition"
                            title={showBalance ? "Hide balance" : "Show balance"}
                            type="button" 
                        >
                            {showBalance ? (
                                <HiEye color="white" size={18} />
                            ) : (
                                
                                 <HiEyeOff color="white" size={18} />
                            )}
                        </button>
                    )}
                    <span>{icon ? icon : <Skeleton count={1} />}</span>
                </div>
            </div>

           
            <Overlay />

            <Button
                width={
                    isMerge
                        ? "h-7 md:h-8 rounded-full text-white text-sm bg-[rgba(255,255,255,0.5)] backdrop-blur-md hover:bg-[rgba(255,255,255,0.4)] font-bold transition-colors duration-300 relative z-10 w-[80%]"
                        : "w-[80%] h-10 rounded-full text-white text-sm bg-[rgba(255,255,255,0.5)] backdrop-blur-md hover:bg-[rgba(255,255,255,0.4)] font-bold transition-colors duration-300 relative z-10"
                }
                content={content}
                icon={btnIcon}
            />
        </div>
    );
};

export default Blocks;