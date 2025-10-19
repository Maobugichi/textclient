import {Dispatch , SetStateAction } from 'react';

const modalOptions = [
    {
        icon:"🌱",
        text:"Bronze",
        indicator:'Starter Level',
        percentage:"0%",
        threshold: 0
    }, 
    {
      icon:"⭐",
      text:"Silver",
      indicator:"Deposited above 60k",
      percentage:"2%",
      threshold: 60000
    },
    {
        icon:"✨",
        text:"Gold",
        indicator:"Deposited above 250k",
        percentage:"3%",
        threshold: 250000
    },
    {
        icon:"💫",
        text:"Platinum",
        indicator:"Deposited 550k",
        percentage:'5%',
        threshold: 550000
    },
    {
        icon:"🌟",
        text:"Diamond",
        indicator:"Deposited 1M",
        percentage:'7%',
        threshold: 1000000
    },
    {
        icon:"👑",
        text:"Elite",
        indicator:"Deposited 2M",
        percentage:'10%',
        threshold: 2000000
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
export { modalOptions , providers , listItem , openFilter ,  getTime }