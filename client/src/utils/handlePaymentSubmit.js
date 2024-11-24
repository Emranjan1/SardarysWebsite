import { handleSquarePayment } from "../services/api";

export async function handlePaymentSubmit(
  token,
  verifiedBuyer,
  { totalAmount, basket },
  navigate,
  onOrderConfirm
) {

  const orderItems = basket.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,
  }));

  const orderDetails = {
    orderItems: orderItems,
    paymentMethod: token.details.method,
    isCashOnDelivery: false,
    totalAmount,
    sourceId: token.token,
    billingDetails: token.details,
  };

  try {
    if (token.status === "OK") {
      const res = await handleSquarePayment(orderDetails);
      console.log("paid: ", res);
      console.log("token:", token);

      onOrderConfirm();

      navigate("/order-summary", { state: { orderDetails: res } });
    } else {
      console.log("payment failed!");
    }
  } catch (error) {
    console.log(error);
  }
}
