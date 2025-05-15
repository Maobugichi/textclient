import { useEffect, useRef } from "react";
import Form from "./form"


const Payment = () => {
   const emailRef = useRef<HTMLInputElement>(null);
   const amountRef = useRef<HTMLInputElement>(null);
   const currencyRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.squadco.com/widget/squad.min.js";
        script.async = true;
        document.body.appendChild(script);
    })
    function squadPay() {
        
        const squad = (window as any).squad;
        if (!squad) {
        console.error("Squad script not loaded.");
        return;
        }
        const email = emailRef.current?.value || ''
        const amount = parseFloat(amountRef.current?.value || '0') * 100
        const currency_code = currencyRef.current?.value || 'NGN'
        if (!email || !amount) {
            alert('Please enter both email and amount.');
            return;
          }
      
        const squadInstance = new squad({
          onClose: () => console.log("Widget closed"),
          onLoad: () => console.log("Widget loaded successfully"),
          onSuccess: () => console.log(`Linked successfully`),
          key: "pk_a2dd6e46be8ed706babd85982998b70c81694569",
          email,
          amount,
          currency_code
        });
        squadInstance.setup();
        squadInstance.open();
      }
    return(
        <Form>
            <input ref={emailRef} type="email" placeholder="enter your email"/>
            <input ref={amountRef} type="number" placeholder="enter amount"/>
            <input ref={currencyRef} type="text" placeholder="enter currency"/>
            <button onClick={squadPay}>
                Pay
            </button>
        </Form>
    )
}

export default Payment