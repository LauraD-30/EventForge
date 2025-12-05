import React, { useEffect, useState } from "react";

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const body = await res.json();
        setEvents(body.data || []);
      } catch (err) {
        console.error("Failed to load organizer events:", err);
      }
    }

    loadEvents();
  }, []);

  return (
    <div style={{ padding: "32px" }}>
      <h1>Organizer Dashboard</h1>
      <h2>Your Events</h2>

      <table style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {events.map(ev => (
            <tr key={ev.id}>
              <td>{ev.title}</td>
              <td>{ev.date}</td>
              <td>${ev.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
