import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function BrowseEvents() {
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState([]);
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
            `Failed to load events (${res.status}): ${text || res.statusText}`
          );
        }

        const json = await res.json();
        // backend returns { data: [...] }
        setEvents(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        console.error("Error loading events:", err);
        setError("Could not load events. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h1>Available Events</h1>
      <p style={{ marginBottom: 16 }}>
        {user ? `You are logged in as ${user.email} (${user.role})` : ""}
      </p>

      {loading && <p>Loading events…</p>}

      {!loading && error && (
        <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
      )}

      {!loading && !error && events.length === 0 && (
        <p>No events available.</p>
      )}

      {!loading && !error && events.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {events.map((event) => (
            <li
              key={event.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 6,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <h3 style={{ margin: "0 0 4px" }}>{event.title}</h3>
              <p style={{ margin: "0 0 4px" }}>Date: {event.date}</p>
              <p style={{ margin: 0 }}>Price: ${event.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
