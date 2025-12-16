import { useLocation, Link } from "react-router-dom";

//Generated Payment Confirmation Page Due to Time Constraint
export default function PaymentConfirmation() {
 
  const { state } = useLocation();
  const { event, quantity, totalAmount, paymentId } = state || {};

  if (!state) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>No payment details found</h2>
        <p>Please return to the events page and try again.</p>
        <Link to="/">Back to Events</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>🎉 Payment Successful!</h2>
      <p>Thank you for your purchase. Your payment has been confirmed.</p>

      <div style={{ border: "1px solid #ccc", padding: "1rem", marginTop: "1rem" }}>
        <h3>Ticket Details</h3>
        <p><strong>Event:</strong> {event.title}</p>
        <p><strong>Tickets:</strong> {quantity}</p>
        <p><strong>Total Paid:</strong> ${totalAmount.toFixed(2)}</p>
        <p><strong>Payment Reference:</strong> {paymentId}</p>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Link to="/">⬅ Back to Events</Link>
      </div>
    </div>
  );
}