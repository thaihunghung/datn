import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import './App.css';
import Client from "./layouts/Client";
import Admin from "./layouts/admin";
import Login from "./components/pages/Admin/Login/Login";
import Cookies from 'js-cookie';

function App() {
    const location = useLocation();
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(Cookies.get('authenticated') === 'true');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            setShowScrollButton(scrollY > 250);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    return (
        <div className="App">
            <Routes>
                <Route path="/*" element={<Client />} />
                <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/admin/*" element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} />
            </Routes>
            {showScrollButton && (
                <div className="scroll-to-top-button" onClick={scrollToTop}>
                    <i className="fa-solid fa-chevron-up"></i>
                </div>
            )}
        </div>
    );
}

export default App;
