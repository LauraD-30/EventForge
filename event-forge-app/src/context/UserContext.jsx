import { createContext, useState, useEffect } from 'react';
import { useContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("currentUser");
        return stored ? JSON.parse(stored) : null;
    });

    const [users, setUsers] = useState([]);

    // Fetch all users once when app starts
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch("/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data?.data) {
                        setUser({ ...data.data, token });
                    }
                })
                .catch(() => setUser(null));
        }
    }, []);

    // Save user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
        } else {
            localStorage.removeItem("currentUser");
        }
    }, [user]);


    //Login Function
    const login = async (email, password) => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data?.data) {
            localStorage.setItem("token", data.data.token);
            setUser(data.data);
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
    };

  return (
    <UserContext.Provider value={{ user, setUser, users, setUsers, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};