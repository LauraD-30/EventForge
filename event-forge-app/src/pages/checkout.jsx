import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm({ clientSecret, event, quantity, totalAmount  }) {
    if (!event) {
        return <p>Loading checkout details...</p>;
    };

    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cardholderName, setCardholderName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);

        setLoading(true);
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: e.target.name.value,
                },
            },
        });

        if (error) {
            console.error("Payment error:", error);
            alert(error.message);
        } else {
            alert("Payment successful!");
            console.log("PaymentIntent:", paymentIntent);
        }
        setLoading(false);

        if (paymentIntent.status === "succeeded") {
            // Save order in backend
            await fetch("/api/save-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventId: event.id,
                    quantity,
                    amount: totalAmount,
                    paymentIntentId: paymentIntent.id,
                }),
            });

            navigate("/payment-success", {
                state: {
                    event,
                    quantity,
                    totalAmount,
                    paymentId: paymentIntent.id,
                },
            });
        }
    };

    return (
        <div> 
            <div>
                <h1>Ticket Details</h1>
                
                <p><strong>Tickets:</strong> {quantity}</p>
                <p><strong>Total:</strong> ${totalAmount.toFixed(2)}</p>
            </div>

            <form onSubmit={handleSubmit} style={{
            maxWidth: "500px",
            margin: "0 auto",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            background: "#f9f9f9"
        }}>
            
            <h3>Payment Details</h3>

            <label>
                Cardholder Name
                <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    required
                    style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
                />
            </label>

            <label>
                Card Information
                <div style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "4px",
                    background: "#fff",
                    marginBottom: "12px"
                }}>
            
                    <CardElement />
                </div>
            </label>

            <button type="submit" disabled={!stripe || loading} style={{
                width: "100%",
                padding: "10px",
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
                }}>
                    {loading ? "Processing..." : "Pay"}
            </button>

            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </form>
        </div>
        
  );
}

/*<p><strong>Event:</strong> {event.title}</p>*/