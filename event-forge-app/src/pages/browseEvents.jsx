import React, { useState } from 'react';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import "../styling/BrowseEvents.css"
import { useContext, useEffect } from 'react';
import { EventContext } from '../context/eventContext';
import { useNavigate } from 'react-router-dom';

export default function BrowseEvents() {
    const navigate = useNavigate();
    const [events, setEvents] = useContext(EventContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    fetch("/api/events")
        .then((res) => {
            if (!res.ok) {
                throw new Error("Failed to fetch events");
            } 
            return res.json();
      })
      .then((data) => setEvents(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading events...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleViewDetails = (id) => {
        navigate(`/event-page/${id}`);
    };

    return (
        <div className="browse-events">
            <header className="browsing-header"></header>
            <div className="search-container">
                <SearchBar />
            </div>
            <span> </span>
            <div className="display-events">
                {events.map(event => (
                    <EventCard key={event.id} event={event} onViewDetails={() => handleViewDetails(event.id)}/>
                ))}
            </div>
        </div>
    );


}