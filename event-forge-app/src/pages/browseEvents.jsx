import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import SearchBar from "../components/SearchBar.jsx";
import { useNavigate } from "react-router-dom";
import TicketsPopup from "../components/TicketsPopup.jsx";

export default function BrowseEvents() {
  const { user } = useContext(UserContext);

  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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

  function handleSearchChange(e) {
    const value = e.target.value;
    setSearch(value);

    const term = value.trim().toLowerCase();

    if (!term) {
      setEvents(allEvents);
      return;
    }

    const filtered = allEvents.filter((event) => {
      const title = (event.title || "").toLowerCase();
      const date = (event.date || "").toLowerCase();
      const price = String(event.price || "").toLowerCase();
      const description = (event.description || "").toLowerCase();
      const location = (event.location || "").toLowerCase();

      return (
        title.includes(term) ||
        date.includes(term) ||
        price.includes(term) ||
        description.includes(term) ||
        location.includes(term)
      );
    });

    setEvents(filtered);
  }

  const handleGetTickets = (id) => {
    navigate(`/event-page/${id}`);
  };


  const closeTicketPopup = () => {
    setSelectedEvent(null);
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>Available Events</h1>

      {loading && <p>Loading events…</p>}

      {!loading && error && (
        <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
      )}

      {/* Search bar – only when we have data and no error */}
      {!loading && !error && allEvents.length > 0 && (
        <SearchBar value={search} onChange={handleSearchChange} />
      )}

      {!loading && !error && events.length === 0 && allEvents.length === 0 && (
        <p>No events available.</p>
      )}

      {!loading && !error && events.length === 0 && allEvents.length > 0 && (
        <p>No events match your search.</p>
      )}

      {!loading && !error && events.length > 0 && (
        <ul className="event-items" style={{ listStyle: "none", padding: 0 }}>
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
              <p style={{ margin: "0 0 4px" }}><strong>Date:</strong> {event.date}</p>
              <p style={{ margin: "0 0 4px" }}><strong>Location: </strong>{event.location}</p>
              <p style={{ margin: "0 0 4px" }}><strong>Description: </strong>{event.description}</p>
              <p style={{ margin: 0 }}><strong>Price: $</strong>{event.price}</p>
              <aside>
                <button className="get-tickets-button" onClick={() => handleGetTickets(event.id)}>Get Tickets</button>
                

              </aside>
            </li>
          ))}
        </ul>
      )}

      <TicketsPopup
        isOpen={!!selectedEvent}
        onClose={closeTicketPopup}
        event={selectedEvent}
      />

    </div>
  );
}

/*<button className="get-tickets-button" onClick={() => handleGetTickets(event)}>Get Tickets</button>

<button className="get-tickets-button" onClick={navigate('/get-tickets')}>Get Tickets</button>

const handleGetTickets = (event) => {
    console.log("Clicked event:", event.title);
    setSelectedEvent(event);

    <TicketsPopup
        isOpen={!!selectedEvent}
        onClose={closeTicketPopup}
        event={selectedEvent}
      />
  };
*/