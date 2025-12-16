import React from "react";

export default function TicketsPopup({ isOpen, onClose, event }) {
    if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="popup-content">
        <h2>{event.title}</h2>
        <p>{event.description}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Price:</strong> ${event.price}</p>

        <button onClick={onClose}>Close</button>
        <button>Proceed to Checkout</button>
      </div>
    </div>
  );
}