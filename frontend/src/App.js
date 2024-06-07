import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import {
    AppstoreOutlined,
    MailOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import './App.css';
import Client from "./layouts/Client";
import Admin from "./layouts/admin";
import Login from "./components/pages/Admin/Login/Login";
import { getCookie } from './utils/cookieUtils';

function App() {
    const location = useLocation();
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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

    useEffect(() => {
        const token = getCookie('teacher_id');
        setIsAuthenticated(!!token);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="App">
            <Routes>
                <Route path="/*" element={<Client />} />
                <Route path="/login" element={<Login />} />
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
