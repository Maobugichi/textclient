import Lis from "./lis"


const Reasons = () => {
    const list = [ { content: 'Trusted Security Solutions' , more: 'Our SMS verification service, utilizing one-time-use non-VoIP phone numbers, guarantees the security of your online accounts' }, {content:'Swift and Reliable Verification Process', more:'TextFlex provides fast and efficient SMS services, optimizing your verification process while maintaining the highest level of security.'} , {content:'Universal Integration Support' , more:'TextFlex seamlessly integrates with a wide range of platforms, guaranteeing optimal compatibility and a user-friendly experience for all users.'} ,{ content:'Committed Customer Assistance' , more:'TextFlex offers comprehensive support for any inquiries or concerns, ensuring a smooth and hassle-free experience.'}]

    return(
        <div className="relative mt-10 h-fit min-h-[120vh] flex flex-col gap-5 justify-center">
            <h2 className="text-2xl md:text-4xl font-semibold w-[80%] md:w-[50%] text-center mx-auto">
            Clients choose us for our proven excellence and consistent results.
            </h2>
            <div className=" h-fit w-[80%] mx-auto">
                    {list.map((item:any) => (
                        <Lis
                         content={item.content}
                         more={item.more}
                        />
                    ))}
            </div>
        </div>
    )
}

export default Reasons