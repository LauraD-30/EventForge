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
        <div className="dashboard-container">
            <div style={{backgroundColor: "white", opacity: 1, border: '1px solid #eee', borderRadius: 6, padding: 12 }}>
                <header className="dashboard-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                    <div>
                        <h1 style={{ margin: 0 }}>Welcome Back!</h1>
                        <div className="dashboard-header-role" style={{ color: '#555', fontSize: 14 }}>Your role: {user?.role}</div>
                    </div>
                </header>

                <div style={{ border: '0px solid #eee', borderRadius: 6, padding: 15 }}> </div>

                <section className="dashboard-section">
                    <div className="dashboard-section-events">
                        <div className="dashboard-section-vontent" style={{ marginBottom: 12 }}>
                            <h2 style={{ margin: '0 0 8px 0' }}>Upcoming Events</h2>
                            <div style={{ border: '1px solid #eee', borderRadius: 6, padding: 12 }}>
                                {events.length === 0 ? ( 
                                    <p style={{ margin: 0 }}>No upcoming events.</p>
                                ) : (
                                    events.map((ev) => (
                                        <div className="event-item" key={ev.id}>
                                            <div>
                                                <strong>{ev.title}</strong>
                                                <div style={{ fontSize: 13, color: '#666' }}>{ev.date} • {ev.venue}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: 13 }}>{ev.ticketsOwned} Ticket{ev.ticketsOwned > 1 ? 's' : ''}</div>
                                                <button className="view-ticket-button" style={{ marginTop: 6, padding: '6px 10px', cursor: 'pointer' }}>View</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            
                        </div>

                    <div style={{height: '10px', border: '0px solid #eee', borderRadius: 6, padding: 15 }}> </div>

                    <div>
                        <h2 style={{ margin: '0 0 8px 0' }}>Recent Orders</h2>
                        <div style={{ border: '1px solid #eee', borderRadius: 6, padding: 12 }}>
                            {orders.length === 0 ? (
                                <p style={{ margin: 0 }}>No orders yet.</p>
                            ) : (
                                orders.map((o) => (
                                    <div className="order-item" key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f6f6f6' }}>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{o.event}</div>
                                            <div style={{ fontSize: 13, color: '#666' }}>{o.date} • Order {o.id}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: 13 }}>{o.qty} ticket{o.qty > 1 ? 's' : ''}</div>
                                            <div style={{ fontSize: 13, color: o.status === 'Confirmed' ? 'green' : '#b8860b' }}>{o.status}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div style={{height: '10px', border: '0px solid #eee', borderRadius: 6, padding: 15 }}> </div>


                    <button className="browse-events-button" onClick={handleBrowseEvents}>Browse Events</button>

                </div>

                <aside>
                    <div className="dashboard-quick-actions" >
                        <h3 style={{ marginTop: 0 }}>Quick Actions</h3>
                        <ul style={{ paddingLeft: 18, margin: '8px 0' }}>
                            <li style={{ marginTop: 8 }}><button className="quick-actions-button">View Past Orders</button></li>
                            <li style={{ marginTop: 8 }}><button className="quick-actions-button" >Manage Payment Methods</button></li>
                        </ul>
                    </div>
                </aside>
            </section>
            </div>
            
        </div>
    );
}