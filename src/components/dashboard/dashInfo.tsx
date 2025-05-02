import BlockCont from "./block-cont";
import Blocks from "../../ui/blocks";
import ForwardBlocks from "./forwardBlocks";
import { Link , useNavigate } from "react-router-dom";


const DashInfo = () => {
    const navigate = useNavigate();
    /*function paystackPop() {
        axios.post('http://localhost:3001/initialize-transaction', {
            email: 'customer@email.com',
            amount: '20000',
          })
          .then((response) => {
            const access_code =response.data.data.access_code;
            const popup = new PaystackPop()
            popup.resumeTransaction(access_code)
        
        })
          .catch((error) => console.error(error));

    }*/

    const blockInfo = [
        {
            extra:'Balance',
            amount:'0.00',
            icon:"",
            content:' + Fund Wallet',
            link:''
        } ,
        {
            extra:'Purchase Number',
            amount:'0',
            icon:"",
            content:'Receive SMS',
            link:'/sms/1'
        },
        {
            extra:'Rented Numbers',
            amount:'0',
            icon:"",
            content:'Rent Number',
            link:'/number/1'
        }
    ]
    const forwardInfo = [
        {
            text:'Referral Link',
            forward:'Click to copy your referral link'
        }, 
        {
            text:'Textplug',
            forward:'Join our telegram channel for more info and updates'
        }
    ]

    const checkAuth =  () => {
        try {
            const token = localStorage.getItem("token");
           
            if (!token) {
              return null 
            } else {
               return true
            }
          } catch {
            //navigate('/signup/:1');
          }
       }
        //checkAuth();
    const blocks = blockInfo.map(info => (
        <Link to={checkAuth() ? info.link : '/signup/:1'}>
         <Blocks
          extra={info.extra}
          amount={info.amount}
          content={info.content}
        />
        </Link>
        
    ));

    const forward = forwardInfo.map(item => (
        <ForwardBlocks
         text={item.text}
         forward={item.forward}
        />
    ))
    return(
        <div className="  w-full flex flex-col gap-12">
            <div className="h-auto grid  gap-6">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <BlockCont>
                    {blocks}
                </BlockCont>
            </div>
            <div className="h-auto flex flex-col gap-4">
                <div className="flex flex-col md:flex-row  w-full justify-between ">
                    {forward}
                </div>

                <div className="h-auto flex flex-col gap-3">
                    <h2 className="text-xl font-semibold">Recent Transactions</h2>
                    <p>No transactions available</p>
                    <div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashInfo