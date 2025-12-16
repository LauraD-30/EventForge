import '../styling/GuestDashboard.css'
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {UserContext} from '../context/UserContext.jsx';
import Tickets from '../components/Ticket.jsx';
import { useEffect } from 'react';


export default function GuestDashboard() {
    const { user } = useContext(UserContext); //Get user from context
    const [events, setEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const today = new Date();
    const orders = Tickets;
    const nav = useNavigate();

    const handleBrowseEvents = () => {
        nav('/browse-events');
    }

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

    

    return (
        <div className="guest-dashboard">
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <div>
                        <h1>Welcome Back!</h1>
                        <div className="dashboard-header-role">Your role: {user?.role}</div>
                    </div>
                </header>

                <section className="dashboard-section">
                    <div className="dashboard-section-events">
                        <div className="section-block">
                            <h2>Upcoming Events</h2>
                            <div className="section-content">
                                {events.length === 0 ? ( 
                                    <p>No upcoming events.</p>
                                ) : (
                                    events.slice(0, 3).map((ev) => (
                                        <div className="event-item" key={ev.id}>
                                            <div>
                                                <strong>{ev.title}</strong>
                                                <div className="event-details">{ev.date} • {ev.location}</div>
                                            </div>
                                            <div className="event-actions">
                                                <div className="ticket-count">{ev.ticketsOwned || 0} Ticket{(ev.ticketsOwned || 0) > 1 ? 's' : ''}</div>
                                                <button className="view-ticket-button">View</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            
                        </div>

                    <div className="spacer"></div>

                    <div className="section-block">
                        <h2>Recent Orders</h2>
                        <div className="section-content">
                            {orders.length === 0 ? (
                                <p>No orders yet.</p>
                            ) : (
                                orders.map((o) => (
                                    <div className="order-item" key={o.id}>
                                        <div>
                                            <div className="order-title">{o.event}</div>
                                            <div className="order-details">{o.date} • Order {o.id}</div>
                                        </div>
                                        <div className="order-status">
                                            <div className="ticket-qty">{o.qty} ticket{o.qty > 1 ? 's' : ''}</div>
                                            <div className={`status ${o.status.toLowerCase()}`}>{o.status}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="spacer"></div>


                    <button className="browse-events-button" onClick={handleBrowseEvents}>Browse Events</button>

                </div>

                <aside className="dashboard-aside">
                    <div className="dashboard-quick-actions">
                        <h3>Quick Actions</h3>
                        <ul>
                            <li><button className="quick-actions-button">View Past Orders</button></li>
                            <li><button className="quick-actions-button">Manage Payment Methods</button></li>
                        </ul>
                    </div>
                </aside>
            </section>
            </div>
            
        </div>
    );
}