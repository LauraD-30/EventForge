import { createContext, useState, useEffect } from "react";

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
  
    // Fetch all events
    const fetchEvents = async (token) => {
      setLoading(true);
      try {
        const res = await fetch("/api/events", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data?.data) {
          setEvents(data.data);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    // Create new event
    const createEvent = async (event, token) => {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(event)
      });
      const data = await res.json();
      if (data?.data) {
        setEvents((prev) => [...prev, data.data]); // optimistic update
      }
    };

    // Update event
    const updateEvent = async (id, updates, token) => {
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data?.data) {
        setEvents((prev) =>
          prev.map((evt) => (evt.id === id ? data.data : evt))
        );
      }
    };

    // Delete event
    const deleteEvent = async (id, token) => {
      await fetch(`/api/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents((prev) => prev.filter((evt) => evt.id !== id));
    };

  return (
    <EventContext.Provider value={{ events, setEvents, loading, setLoading, fetchEvents, createEvent, updateEvent, deleteEvent  }}>
      {children}
    </EventContext.Provider>
  );
};
