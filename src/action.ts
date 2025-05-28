import {Dispatch , SetStateAction } from 'react';

const modalOptions = [
    {
        icon:"🌱",
        text:"Bronze",
        indicator:'Starter Level',
        percentage:"0%"
    }, 
    {
      icon:"⭐",
      text:"Silver",
      indicator:"Deposited above 60k",
      percentage:"2%"
    },
    {
        icon:"✨",
        text:"Gold",
        indicator:"Deposited above 250k",
        percentage:"3%"
    },
    {
        icon:"💫",
        text:"Platinum",
        indicator:"Deposited 550k",
        percentage:'5%'
    },
    {
        icon:"🌟",
        text:"Diamond",
        indicator:"Deposited 1M",
        percentage:'7%'
    },
    {
        icon:"👑",
        text:"Elite",
        indicator:"Deposited 2M",
        percentage:'10%'
    }

]

const providers = [
    {
        id:"sw",
        short:'SW',
        text:'Swift SMS',
        availability:'USA numbers only'
    } , 
    {
        id:"dc",
        short:'DC',
        text:'Dynamic SMS',
        availability:'All countries numbers'
    }
]

 const openFilter = (setOpen:Dispatch<SetStateAction<boolean>>) => {
        setOpen((prev:any) => !prev)
}

  const filter = (e:React.MouseEvent<HTMLLIElement>, setTrans:Dispatch<SetStateAction<any>>, transaction:[],setOpen:Dispatch<SetStateAction<boolean>>) => {
        const target = e.currentTarget.textContent;
        if (target !== 'clear') {
             const newTransaction = transaction.filter((item:any) => {
            console.log(target)
            return item.status == target
            });
         setTrans(newTransaction)
        } else {
            setTrans(transaction)
        }
       
        setOpen(false)
  }

 const getTime = (item:any) => {
     let time = ''
    let months = [ 'Jan' , 'Feb' , 'Mar' , 'Apr' , 'May' , 'Jun' , 'July' , 'Aug' , 'Sep' ,'Oct' , 'Nov' , 'Dec']
    if (item.created_at.slice(11,13) >= 12) {
        time = 'PM'
    } else {
        time = 'AM'
    }
    let date = new Date(item.created_at.slice(0,10))
    let month = date.getUTCMonth()
    let day = item.created_at.slice(8,10)
    let newDate = `${months[month]} ${day}, - ${item.created_at.slice(11,16)} ${time}`

    return newDate
 }
const listItem = ['Light' , 'Dark' , 'System']
export { modalOptions , providers , listItem , openFilter , filter , getTime }