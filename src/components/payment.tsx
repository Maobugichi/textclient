import Form from "./form"

const Payment = () => {
    return(
        <Form>
            <input type="email" placeholder="enter your email"/>
            <input type="number" placeholder="enter amount"/>
            <input type="text" placeholder="Enter Currency NGN / USD"/>
        </Form>
    )
}

export default Payment