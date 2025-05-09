import Lis from "./lis"


const Reasons = () => {
    const list = ['Trusted Security Solutions' , 'Swift and Reliable Verification Process', 'Universal Integration Support' ,'Committed Customer Assistance']
    const more = ['Our SMS verification service, utilizing one-time-use non-VoIP phone numbers, guarantees the security of your online accounts' , 'TextFlex provides fast and efficient SMS services, optimizing your verification process while maintaining the highest level of security.', 'TextFlex seamlessly integrates with a wide range of platforms, guaranteeing optimal compatibility and a user-friendly experience for all users.' , 'TextFlex offers comprehensive support for any inquiries or concerns, ensuring a smooth and hassle-free experience.']
    return(
        <div className="relative top-62 h-fit min-h-[120vh] flex flex-col gap-5 justify-center">
            <h2 className="text-2xl md:text-4xl font-semibold w-[80%] md:w-[50%] text-center mx-auto">
            Clients choose us for our proven excellence and consistent results.
            </h2>
            <div className="flex w-[80%] mx-auto md:flex-row flex-col">
                <div className="md:w-1/2 ">
                    {list.map((item:any) => (
                        <Lis
                         content={item}
                        />
                    ))}
                </div>
                <div className="md:w-[50%]">
                    {
                        more.map((item:any) => (
                            <p className="md:h-24 h-32 text-md md:text-lg font-light flex items-center">{item}</p>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Reasons