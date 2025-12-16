
import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51SdGGTGo2va4gEKQmhtWqN27QeS9FmxFKpuIFnUUNEocq6FWA6NPV7XJ75ulZQmVRnCz9lamuXcPryzRw31Ms7vn00yb7LZbpY');

// Mount the App wrapped with BrowserRouter for routing
export default createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Elements stripe={stripePromise}>
                <App />
            </Elements>
                
        </BrowserRouter>
    </StrictMode>
);
