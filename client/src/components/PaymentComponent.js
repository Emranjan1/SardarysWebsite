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
        applicationId={`${process.env.REACT_APP_SQUARE_APP_ID}`}
        cardTokenizeResponseReceived={async (token, verifyBuyer) =>
          handlePaymentSubmit(
            token,
            verifyBuyer,
            { totalAmount, basket },
            navigate,
            onOrderConfirm
          )
        }
        locationId={`${process.env.REACT_APP_SQUARE_LOCATION_ID}`}
      >
        <CreditCard />
      </PaymentForm>
    </div>
  );
};

export default PaymentComponent;
