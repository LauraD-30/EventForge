import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function Register() {
    const { setUser } = useContext(UserContext);
    const successfulRegistration = true; // Simulate registration success/failure
    const nav = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        role: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const redirect= () => {
        if (successfulRegistration) {   
            alert("User Registered Successfully!");
            redirect('/login'); // Redirect to login page after successful registration
        } else {
            alert("Registration Failed. Please try again.");
        }  
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
            
        try {
            // Send registration data to backend
            const response = await fetch("http://localhost:3001/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                // 1. Update context
                setUser(result.data);

                // 2. Cache in localStorage for session continuity
                localStorage.setItem("currentUser", JSON.stringify(result.data));

                alert("User registered successfully!");

                // 3. Redirect based on role
                if (result.data.role === "attendee") {
                    navigate("/guest-dashboard");
                } else if (result.data.role === "organizer") {
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
        <div className="card" style={{color: "black", fontSize: 22, maxWidth: 480, margin: "48px auto", padding: 24, border: "1px solid #0a0a0aff", borderRadius: 8 }}>
            <h2>Create an Account</h2>
            <form className="registrationForm" onSubmit={handleSubmit} aria-label="registration form">
                <div style={{ marginBottom: 12 }}>
                    
                    <label htmlFor="email" style={{textAlign : 'left', color: 'black', display: "block", fontSize: 20, marginBottom: 6, marginTop: 12 }}>
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="Enter your email"
                        onChange={handleChange}
                        style={{  width: "100%", padding: "10px 10px", fontSize: 14, boxSizing: "border-box", borderRadius: "10px" }}
                    />
                    <label htmlFor="password" style={{textAlign : 'left', color: 'black',display: "block", fontSize: 20, marginBottom: 6, marginTop: 12 }}>
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        autoComplete="new-password" 
                        placeholder="Create a password"
                        onChange={handleChange}
                        style={{  width: "100%", padding: "10px 10px", fontSize: 14, boxSizing: "border-box", borderRadius: "10px"  }}
                    />
                    <label htmlFor="password" style={{textAlign : 'left', color: 'black', display: "block", fontSize: 20, marginBottom: 6, marginTop: 12 }}>
                        Re-Enter Password
                    </label>
                    <input
                        id="re-entered-password"
                        name="re-entered-password"
                        type="password"
                        required
                        autoComplete="new-password" 
                        placeholder="re-entered-password"
                        onChange={handleChange}
                        style={{  width: "100%", padding: "10px 10px", fontSize: 14, boxSizing: "border-box", borderRadius: "10px"  }}
                    />

                    <div className="roleSelection">
                
                        <label htmlFor="role" style={{textAlign : 'left', color: 'black', display: "block", fontSize: 20, marginBottom: 6, marginTop: 12 }}>    
                            Select Role:
                        </label>
                            <select className="role" id="role" style={{ width: "100%", padding: "10px 10px", fontSize: 14, boxSizing: "border-box", marginTop: 12, marginBottom: 24, borderRadius: "10px"}}>
                                <option value="attendee">Guest</option>
                                <option value="organizer">Organizer</option>
                            </select>   
                    </div>
                </div>
                <button
                    type="submit"
                    style={{
                        fontSize: "16px",
                        width: "100%",
                        padding: "10px 12px",  
                        background: "#2889a7ff",
                        color: "#fff",
                        border: "none",
                    }}
                >
                    Submit
                </button>
            </form>
        </div>
    )
}