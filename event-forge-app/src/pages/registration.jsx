import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useState } from 'react';
import '../styling/Registration.css';

export default function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    
    const successfulRegistration = true; 


    const handleSubmit = async (e) => {
        e.preventDefault();
            
        try {
            // Send registration data to backend
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email, password, role}),
            });

            const result = await response.json();

            if (response.ok && result.data) {
                localStorage.setItem("currentUser", JSON.stringify(result.data));
                alert("User registered successfully!");

                //Redirect based on role
                if (result.data.role === "GUEST") {
                    navigate("/guest-dashboard");
                } else if (result.data.role === "ORGANIZER") {
                    navigate("/organizer-dashboard");
                } else {
                    navigate("/home");
                }
            } else {
                alert(result.error);
            }   
        } catch (err) {
            console.error("Registration failed:", err);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="registration-page">
            <div className="registration-card">
                <h2>Create an Account</h2>
                <form className="registration-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            required
                            autoComplete="email"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            required
                            autoComplete="new-password" 
                            placeholder="Create a password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Select Role:</label>
                        <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="">Select a role</option>
                            <option value="GUEST">GUEST</option>
                            <option value="ORGANIZER">ORGANIZER</option>
                        </select>   
                    </div>
                    <button type="submit" className="submit-btn">Submit</button>
                </form>
            </div>
        </div>
    )
}