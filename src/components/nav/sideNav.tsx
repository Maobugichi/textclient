import textPlug from "../../assets/textplug.png";
import NavItems from "./navItems";

const SideNav = () => {
    return(
        <nav className="hidden w-[20%] fixed h-[100vh] top-0 md:flex flex-col gap-5 bg-[#f9fbfd] border-r border-solid border-[#5252]">
            <div className="h-16 flex items-center  border-b border-solid border-[#5252]">
                <img className="h-[60%]" src={textPlug} alt="logo" />
            </div>

            <NavItems/>
        </nav>
    )
}

export default SideNav