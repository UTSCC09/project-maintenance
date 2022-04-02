import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {useState, useEffect} from "react";
import { useMutation, useLazyQuery, useSubscription } from "@apollo/client";
import {GET_ONE_WORKER} from "GraphQL/Queries";


// from https://www.unimedia.tech/2021/10/09/paypal-checkout-integration-with-react/
export default function Checkout({tips, email}) {
    console.log({email});
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState("");
    const [orderID, setOrderID] = useState(false);

    const status = useScript("https://www.paypal.com/sdk/js?client-id=AbG16Lc-o8rp2NoJxgi8yhvqs9jkmIxaK_xLzfbrSg9aGMFVcvCc-RaD-EhOuRbJjjpK5dq-x49mJNLO&currency=CAD");

    const [getWorkerDetail] = useLazyQuery(GET_ONE_WORKER, {
		fetchPolicy: "network-only",
	});
	const [workerDetail, setWorkerDetail] = useState({});

    // creates a paypal order
    const createOrder = (data, actions) => {
        return actions.order
        .create({
            purchase_units: [
            {
                amount: {
                currency_code: "CAD",
                value: tips,
                },
                payee: {
                    email_address: email
                },
            },
            ],
        })
        .then((orderID) => {
            setOrderID(orderID);
            return orderID;
        });
    };

        // check Approval
    const onApprove = (data, actions) => {
        return actions.order.capture().then(function (details) {
        const { payer } = details;
        setSuccess(true);
        });
    };
    //capture likely error
    const onError = (data, actions) => {
        setErrorMessage("An Error occured with your payment ");
    };
    return (
        <PayPalScriptProvider
        // options={{
        //     "client-id":"",
        // }}
        >
       <div>
       <div className="wrapper">
         <div className="product-info">
           <div className="product-price-btn">
             <button type="submit" onClick={() => setShow(true)}>
               Tip now
             </button>
           </div>
         </div>
       </div>
 
       {show ? (
         <PayPalButtons
           style={{ layout: "vertical" }}
        //    createOrder={createOrder}
        //    onApprove={onApprove}
         />
       ) : null}
     </div>
   </PayPalScriptProvider>
 );
}

// from https://usehooks.com/useScript/
function useScript(src) {
    // Keep track of script status ("idle", "loading", "ready", "error")
    const [status, setStatus] = useState(src ? "loading" : "idle");
  
    useEffect(
      () => {
        // Allow falsy src value if waiting on other data needed for
        // constructing the script URL passed to this hook.
        if (!src) {
          setStatus("idle");
          return;
        }
  
        // Fetch existing script element by src
        // It may have been added by another intance of this hook
        let script = document.querySelector(`script[src="${src}"]`);
  
        if (!script) {
          // Create script
          script = document.createElement("script");
          script.src = src;
          script.async = true;
          script.setAttribute("data-status", "loading");
          // Add script to document body
          document.body.appendChild(script);
  
          // Store status in attribute on script
          // This can be read by other instances of this hook
          const setAttributeFromEvent = (event) => {
            script.setAttribute(
              "data-status",
              event.type === "load" ? "ready" : "error"
            );
          };
  
          script.addEventListener("load", setAttributeFromEvent);
          script.addEventListener("error", setAttributeFromEvent);
        } else {
          // Grab existing script status from attribute and set to state.
          setStatus(script.getAttribute("data-status"));
        }
  
        // Script event handler to update status in state
        // Note: Even if the script already exists we still need to add
        // event handlers to update the state for *this* hook instance.
        const setStateFromEvent = (event) => {
          setStatus(event.type === "load" ? "ready" : "error");
        };
  
        // Add event listeners
        script.addEventListener("load", setStateFromEvent);
        script.addEventListener("error", setStateFromEvent);
  
        // Remove event listeners on cleanup
        return () => {
          if (script) {
            script.removeEventListener("load", setStateFromEvent);
            script.removeEventListener("error", setStateFromEvent);
          }
        };
      },
      [src] // Only re-run effect if script src changes
    );
  
    return status;
  }