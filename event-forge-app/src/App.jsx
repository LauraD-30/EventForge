
import './styling/App.css'
import {Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login.jsx';
import Register from './pages/registration.jsx';
import GuestDashboard from './pages/guestDashboard.jsx';
import OrganizerDashboard from './pages/organizerDashboard.jsx';
import CreateEvent from './pages/createEvent.jsx';
import EventDetails from './pages/EventDetailsPage.jsx';
import BrowseEvent from './pages/browseEvents.jsx';
import Checkout from './pages/checkout.jsx';
import ShoppingCart from './pages/shoppingCart.jsx';
import HomePage from './pages/home.jsx';
import TicketCard from './components/TicketCard.jsx';
import Ticket from './components/Ticket.jsx';
import SearchBar from './components/SearchBar.jsx';
import EventCard from './components/EventCard.jsx'; 
import Navbar from './components/Navbar.jsx'
import AccountSettings from './pages/AccountSettings.jsx';
import MainLayout from './components/MainLayout.jsx';
import OrganizerProfile from './pages/organizerProfile.jsx';
import { UserProvider } from './context/UserContext.jsx';
import Dropdown from './components/Dropdown.jsx';
import { CartProvider } from './context/shoppingCartContext.jsx';
import QuantitySelector from './components/QuantitySelector.jsx';
import TicketsPopup from './components/TicketsPopup.jsx';
import { EventProvider } from './context/eventContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
    return (
        <EventProvider>
            <CartProvider> 
                <UserProvider> 
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/guest-dashboard" element={<ProtectedRoute><MainLayout><GuestDashboard /></MainLayout></ProtectedRoute>} />
                        <Route path="/organizer-dashboard" element={<ProtectedRoute><MainLayout><OrganizerDashboard /></MainLayout></ProtectedRoute>} />
                        <Route path="/create-event" element={<ProtectedRoute><MainLayout><CreateEvent /></MainLayout></ProtectedRoute>} />
                        <Route path="/event-page/:id" element={<MainLayout><EventDetails /></MainLayout>} />
                        <Route path="/browse-events" element={<ProtectedRoute><MainLayout><BrowseEvent /></MainLayout></ProtectedRoute>} />
                        <Route path="/checkout" element={<ProtectedRoute><MainLayout><Checkout /></MainLayout></ProtectedRoute>} />
                        <Route path="/shopping-cart" element={<ProtectedRoute><MainLayout><ShoppingCart /></MainLayout></ProtectedRoute>} />
                        <Route path="/TicketCard" element={<TicketCard />} />
                        <Route path="/Ticket" element={<Ticket />} />
                        <Route path="*" element={<MainLayout><Login /></MainLayout>} />
                        <Route path="/SearchBar" element={<SearchBar />} />
                        <Route path="/BrowsingCard" element={<EventCard />} />
                        <Route path='/Navbar' element={<Navbar />} />
                        <Route path='/account-settings' element={<ProtectedRoute><MainLayout><AccountSettings /></MainLayout></ProtectedRoute>} />
                        <Route path='/organizer-profile' element={<ProtectedRoute><MainLayout><OrganizerProfile /></MainLayout></ProtectedRoute>} />
                        <Route path='/dropdown' element={<Dropdown />} />
                        <Route path='/quantity-selector' element={<QuantitySelector />} />
                        <Route path='/tickets-popup' element={<TicketsPopup />} />
                    
                    </Routes>
                </UserProvider>
            </CartProvider>
        </EventProvider>
    );
}



