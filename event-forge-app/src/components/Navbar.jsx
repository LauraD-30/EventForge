
import { Link } from 'react-router-dom';
import '../styling/Navbar.css'
import { useContext } from 'react';
import {UserContext} from '../context/UserContext.jsx';
import { useState } from 'react';
import logo from "../assets/logo.png"

export default function Navbar() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const { user, logout } = useContext(UserContext); 
    const [open, setOpen] = useState(false);
    
    
    return (
        <nav className="navbar-container" style={{alignItems: 'center', marginBottom: 18 }}> 
            <div>
                </div>
                    <Link to="/">
                        <span className="navbar-logo">
                            <img className="logo-img" src={logo} alt="EventForge Logo"></img>
                        </span>
                </Link>
            <div>
                <h1 style={{ margin: 0 }}>Welcome, {user?.email}</h1>
                <p style={{ marginBottom: 16 }}>
                    {user ? `You are logged in as a ${user.role}` : ""}
                </p>
            </div>

            <ul style={{}}>
                <div className="navbar-links" style={{padding:8}}>
                    <li><Link to="/browse-events" className='navbar-browse-events-link'>Browse Events</Link></li>
                    <li>{user.role === "ORGANIZER" && <a href="/create-event">➕ Create Event</a>}</li>
                    <li>{user.role === "GUEST" && <a href="/my-tickets">My Tickets</a>}</li>
                    <li>{user.role === "GUEST" && <a href="/account-settings">Account</a>}</li>
                    <li><Link to="/">Sign Out</Link></li>
                    

                </div>
            </ul>
        </nav>
    )
}

