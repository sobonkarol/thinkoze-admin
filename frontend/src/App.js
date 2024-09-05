import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import DeleteProduct from './components/DeleteProduct';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
    };
    
    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn'); // Usuń stan logowania
    };

    return (
        <Router>
            {isLoggedIn ? (
                <>
                    <NavigationBar onLogout={handleLogout} /> {/* Przekazujemy funkcję wylogowania */}
                    <Routes>
                        <Route path="/" element={<Navigate to="/add" />} />
                        <Route path="/add" element={<AddProduct />} />
                        <Route path="/edit" element={<EditProduct />} />
                        <Route path="/delete" element={<DeleteProduct />} />
                    </Routes>
                </>
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </Router>
    );
}

export default App;