import "./styling/App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login.jsx";
import Register from "./pages/registration.jsx";
import GuestDashboard from "./pages/guestDashboard.jsx";
import OrganizerDashboard from "./pages/organizerDashboard.jsx";
import CreateEvent from "./pages/createEvent.jsx";
import EventDetails from "./pages/EventDetailsPage.jsx";
import BrowseEvents from "./pages/browseEvents.jsx";
import Checkout from "./pages/checkout.jsx";
import ShoppingCart from "./pages/shoppingCart.jsx";
import AccountSettings from "./pages/AccountSettings.jsx";
import OrganizerProfile from "./pages/organizerProfile.jsx";

import MainLayout from "./components/MainLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import { UserProvider } from "./context/UserContext.jsx";
import { CartProvider } from "./context/shoppingCartContext.jsx";
import { EventProvider } from "./context/eventContext.jsx";

function GuestRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={["GUEST"]}>{children}</ProtectedRoute>
  );
}

function OrganizerRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={["ORGANIZER"]}>{children}</ProtectedRoute>
  );
}

export default function App() {
  return (
    <EventProvider>
      <CartProvider>
        <UserProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Guest routes */}
            <Route
              path="/guest-dashboard"
              element={
                <GuestRoute>
                  <MainLayout>
                    <GuestDashboard />
                  </MainLayout>
                </GuestRoute>
              }
            />

            <Route
              path="/browse-events"
              element={
                <GuestRoute>
                  <MainLayout>
                    <BrowseEvents />
                  </MainLayout>
                </GuestRoute>
              }
            />

            <Route
              path="/shopping-cart"
              element={
                <GuestRoute>
                  <MainLayout>
                    <ShoppingCart />
                  </MainLayout>
                </GuestRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <GuestRoute>
                  <MainLayout>
                    <Checkout />
                  </MainLayout>
                </GuestRoute>
              }
            />

            {/* Organizer routes */}
            <Route
              path="/organizer-dashboard"
              element={
                <OrganizerRoute>
                  <MainLayout>
                    <OrganizerDashboard />
                  </MainLayout>
                </OrganizerRoute>
              }
            />

            <Route
              path="/create-event"
              element={
                <OrganizerRoute>
                  <MainLayout>
                    <CreateEvent />
                  </MainLayout>
                </OrganizerRoute>
              }
            />

            <Route
              path="/organizer-profile"
              element={
                <OrganizerRoute>
                  <MainLayout>
                    <OrganizerProfile />
                  </MainLayout>
                </OrganizerRoute>
              }
            />

            {/* Shared / neutral routes */}
            <Route
              path="/event-page/:id"
              element={
                <MainLayout>
                  <EventDetails />
                </MainLayout>
              }
            />

            <Route
              path="/account-settings"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AccountSettings />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route
              path="*"
              element={<Navigate to="/login" replace />}
            />
          </Routes>
        </UserProvider>
      </CartProvider>
    </EventProvider>
  );
}
