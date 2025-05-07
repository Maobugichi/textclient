import {
    Home,
    MessageCircle, 
    Hash, 
    Phone,
    Package,
    Settings,
    HelpCircle 
  } from 'lucide-react';
import List from '../listItem';
import { Link } from 'react-router-dom';
interface NavProps {
    closeNav?: () => void
}
import checkAuth from '../checkauth';
const NavItems:React.FC<NavProps> = ({ closeNav }) => {
    const navItems = [
        {
            icon:<Home size={17}/>,
            text:'Dashboard',
            link:'dashboard/1'
        },
        {
            icon:<MessageCircle size={17}/>,
            text:'Receive SMS',
            link:'sms/1'
        },
        {
            icon:<Hash size={17}/>,
            text:'Rent Number',
            link:'number/1'
        },
        {
            icon:<Phone size={17}/>,
            text:'My eSIM',
            link:'esim/1'
        },
        {
            icon:<Package size={17}/>,
            text:'eSIM Plans',
            link:'plans/1'
        },
        {
            icon:<Settings size={17}/>,
            text:'Settings',
            link:'settings/1'
        },
        {
            icon:<HelpCircle size={17}/>,
            text:'Tutorials',
            link:'help/1'
        },
    ]

   

    const items = navItems.map(item => (
        <Link to={checkAuth() ?  item.link : '/signup/:1'}>
           <List
            className="flex h-10 items-center  gap-2 rounded-sm mx-auto w-[80%]"
            onClick={closeNav}
           >
            {item.icon} {item.text}
           </List>
        </Link>
        
    ))

    return(
        <ul className=' h-[80%] flex flex-col gap-1 cursor-pointer'>
            {items}
        </ul>
    )
}

export default NavItems