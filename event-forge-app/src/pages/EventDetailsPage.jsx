import React from "react";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext.jsx";

export default function EventDetails({}){
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [allEvents, setAllEvents] = useState([]);
    const [events, setEvents] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [totalAmount, setAmount] = useState();

    const [clientSecret, setClientSecret] = useState(null);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    useEffect(() => {
        async function loadEvents() {
          try {
            const token = localStorage.getItem("token");
    
            if (!token) {
              setError("No auth token found. Please log out and log in again.");
              setLoading(false);
              return;
            }
    
            const res = await fetch("/api/events", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
    
            if (!res.ok) {
              const text = await res.text();
              throw new Error(
                `Failed to load events (${res.status}): ${
                  text || res.statusText
                }`
              );
            }
    
            const json = await res.json();
            const data = Array.isArray(json.data) ? json.data : [];
    
            setAllEvents(data);
            setEvents(data);
          } catch (err) {
            console.error("Error loading events:", err);
            setError("Could not load events. Make sure the backend is running.");
          } finally {
            setLoading(false);
          }
        }
    
        loadEvents();
      }, []);

      const event = events.find((ev) => ev.id === parseInt(id));

    if (!event) {
        return <p>Event not found.</p>;
    }

    const handleCheckout = async () => {
        const res = await fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: Math.round(event.price * quantity * 100) })
        });
        const data = await res.json();
        console.log("Stripe response:", data);
        setClientSecret(data.clientSecret);
        navigate('/checkout');
    };

    const handleGoBack = () => {
        navigate('/');
    }

    const increaseQuantity = () => setQuantity((q) => q + 1);
    const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));


    return (
        <div className="event-details" style={{ margin: "24px auto", padding: 24, border: "1px solid #e6e6e6", borderRadius: 8, alignContent: "center" }}>
            <div className="event-picture" ></div>

            <div className="event-detail-content" style={{alignContent: "center"}}>
                <h1 className="event-detail-title">{event.title}</h1>
                <h3 className="event-detail-location">{event.location}</h3>
                <h3 className="event-detail-date">{event.date}</h3>
                <h3 className="event-detail-time">{event.startTime} to {event.endTime}</h3>
            </div>

            <div className="ticket-details" style={{ margin: "24px auto", padding: 24, border: "1px solid #e6e6e6", borderRadius: 8, alignContent: "center"}}>
                <h1>Tickets</h1>
                <h3>Priced at {event.price}</h3>
                <div style={{ margin: "10px auto", padding: 24, border: "1px solid #e6e6e6", borderRadius: 8, alignContent: "center", fontSize: "17px"}}>
                    <strong>Total: ${quantity * event.price} CAD</strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button onClick={decreaseQuantity}>-</button>
                    <span>{quantity}</span>
                    <button onClick={increaseQuantity}>+</button>
                </div>

                {!clientSecret && event ? (
                    <button onClick={handleCheckout} style={{ marginTop: "20px" }}>
                        Proceed to Checkout
                    </button>
                ) : (
                    <CheckoutForm clientSecret={clientSecret} event={event} quantity={quantity} totalAmount={event.price * quantity} />)}
            </div>
            

            <Link className="go-back">Back to Events</Link>

        </div>
    );

    /* */

}