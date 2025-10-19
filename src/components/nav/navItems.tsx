import {
    Home,
    MessageCircle,
    Hash,
    Phone,
    Package,
    Settings,
    HelpCircle
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface NavProps {
    closeNav?: () => void;
}

const NavItems: React.FC<NavProps> = ({ closeNav }) => {
    const location = useLocation();

    const navItems = [
        {
            icon: <Home size={17} />,
            text: 'Dashboard',
            link: '/dashboard/1'
        },
        {
            icon: <MessageCircle size={17} />,
            text: 'Receive SMS',
            link: '/sms/1'
        },
        {
            icon: <Hash size={17} />,
            text: 'Rent Number',
            link: '/number/1'
        },
        {
            icon: <Phone size={17} />,
            text: 'My eSIM',
            link: '/esim/1'
        },
        {
            icon: <Package size={17} />,
            text: 'eSIM Plans',
            link: '/e-plans/1'
        },
        {
            icon: <Settings size={17} />,
            text: 'Settings',
            link: '/settings/1'
        },
        {
            icon: <HelpCircle size={17} />,
            text: 'Tutorials',
            link: '/help/1'
        },
    ];

    return (
        <ul className='h-[80%] flex flex-col space-y-2 cursor-pointer'>
            {navItems.map((item, index) => {
                const isActive = location.pathname === item.link || 
                                location.pathname.startsWith(item.link.split('/').slice(0, -1).join('/'));

                return (
                    <li key={index}>
                        <Link
                            to={item.link}
                            onClick={closeNav}
                            className={cn(
                                "flex h-10 items-center gap-3 rounded-lg mx-auto w-[90%] px-4 transition-all duration-200 tracking-wider relative group",
                                isActive
                                    ? "bg-[#0032a5] text-white shadow-md shadow-[#0032a5]/20"
                                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                            )}
                        >
                          
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                            )}

                           
                            <span className={cn(
                                "transition-transform group-hover:scale-110",
                                isActive ? "text-white" : ""
                            )}>
                                {item.icon}
                            </span>

                           
                            <span className={cn(
                                "text-md font-medium",
                                isActive ? "text-white" : ""
                            )}>
                                {item.text}
                            </span>

                           
                            {!isActive && (
                                <div className="absolute inset-0 bg-[#0032a5] opacity-0 group-hover:opacity-5 transition-opacity rounded-lg" />
                            )}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}

export default NavItems;