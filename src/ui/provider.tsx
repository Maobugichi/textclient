import { ArrowLeft, ArrowRight } from 'lucide-react';
import { providers } from '../action';
import ProviderItem from '../components/providerItem';
import { Dispatch , SetStateAction , useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';


interface ProviderProps {
    showProviders: boolean;
    setProviders:Dispatch<SetStateAction<boolean>> ;
    theme:boolean;
}

const Provider:React.FC<ProviderProps> = ({showProviders, setProviders , theme}) => {
    const [ isActive , setActive ] = useState('sm');
    const [ showCheck , setShowCheck ] = useState(false);

    useEffect(() => {
        const initialActive = document.querySelector('sm'); 
         if (showCheck) {
            initialActive?.classList.remove('bg-[#f1f5f9]');
            initialActive?.querySelector('.check')?.classList.add('hidden')
            return
         }
         //console.log(initialActive)
         initialActive?.classList.add('bg-[#f1f5f9]');
         initialActive?.querySelector('.check')?.classList.remove('hidden');
    },[showCheck])


    const makeCheck = (e: React.MouseEvent<HTMLDivElement>,id:string) => {
        if (isActive) {
           const prevActiveElement = document.querySelector(`#${isActive}`);     
           if (prevActiveElement) {
              prevActiveElement.querySelector('.check')?.classList.add('hidden')
              prevActiveElement.classList.remove('bg-[#f1f5f9]')
           }
        }
        (e.target as HTMLElement).querySelector('.check')?.classList.remove('hidden');
        (e.target as HTMLElement).classList.add('bg-[#f1f5f9]');
        setActive(id)
        setShowCheck(true)

        setTimeout(() => {
            setProviders(false)
        },100)
    }

    const openProviderList = () => {
        setProviders(true)
    }
    const provider = providers.map(item => (
        <ProviderItem
         short={item.short}
         text={item.text}
         availability={item.availability}
         id={item.id}
         onClick={makeCheck}
         show={showProviders}
        />
    ));

    
    
    return(
        <div onClick={openProviderList} className={`cursor-pointer ${ theme ? 'bg-[#333333]' : 'bg-[#f4f7fa]'} h-10  w-32 rounded-md flex items-center justify-center gap-4 relative z-10`}>
            <p className='flex flex-col text-[10px] md:text-[14px]'>
                <span className='text-[9px] md:text-[10px]'>Provider</span>
                Dynamic SMS
            </p>
            <div>
                <ArrowLeft color='#df5c0c' size={15}/>
                <ArrowRight color='#df5c0c' size={15}/>
            </div>
            <AnimatePresence>
                {
                    showProviders && (
                        <motion.div 
                          initial={{height:0}}
                          animate={{height:130}}
                          exit={{height:0 , transition: { delay: .8}}}
                          className='absolute left-[-65px] bg-red-200 top-15 w-[145%] rounded-sm shadow-md  h-32 grid place-items-center '>
                             {provider}
                       </motion.div>
                    )
                }
                
            </AnimatePresence>
        </div>
    )
}

export default Provider