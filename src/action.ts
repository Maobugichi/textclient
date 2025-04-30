
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



const listItem = ['Light' , 'Dark' , 'System']
export { modalOptions , providers , listItem }