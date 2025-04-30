import Option from "../option"

const Duration = () => {
    const durationArray = ['hour' , 'day' , 'week' ,'month' ]
    const duration = durationArray.map((item:any) => (
        <Option
         key={item.id}
         value={item}
        >
            {item}
        </Option>
    ))
    return(
      <>{duration}</> 
    )
}

export default Duration