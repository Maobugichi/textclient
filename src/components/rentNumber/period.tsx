import Option from "../option";

interface PeriodProps {
    max: number;
}

const Period:React.FC<PeriodProps> = ({ max }) => {
    const periodItem = Array.from({ length: max }, (_, i) => (
        <Option key={i + 1} value={i + 1}>
          {i + 1}
        </Option>
      ))
    return(
       <>{periodItem}</>
    )
}

export default Period