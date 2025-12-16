import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/OrganizerDashboard.css";

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadEvents() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/organizer/events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const body = await res.json();
        setEvents(body || []);
      } catch (err) {
        console.error("Failed to load organizer events:", err);
      }
    }

    loadEvents();
  }, []);

  const handleCreateEvent = () => {
    navigate("/create-event");
  };

  return (
    <div className="organizer-dashboard">
      <div className="dashboard-container">
        <h1>Organizer Dashboard</h1>
        <h2>Your Events</h2>

        <button className="create-event-btn" onClick={handleCreateEvent}>Create New Event</button>

        {events.length === 0 ? (
          <p className="no-events">No events created yet.</p>
        ) : (
          <table className="events-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.date}</td>
                  <td>${event.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
