import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import { handlePaymentSubmit } from "../utils/handlePaymentSubmit";

const PaymentComponent = ({onOrderConfirm}) => {
  const navigate = useNavigate();
  const location = useLocation() || {};
  const { totalAmount, basket } = location.state || {
    basket: [],
    totalAmount: 0,
  };

  return (
    <div>
      <PaymentForm
        applicationId={`sandbox-sq0idb-4y3jJC_UJHzVh6XW9zreaw`}
        cardTokenizeResponseReceived={async (token, verifyBuyer) =>
          handlePaymentSubmit(
            token,
            verifyBuyer,
            { totalAmount, basket },
            navigate,
            onOrderConfirm
          )
        }
        locationId={`L8SSHTT06EVS1`}
      >
        <CreditCard />
      </PaymentForm>
    </div>
  );
};

export default PaymentComponent;
