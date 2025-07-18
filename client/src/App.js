import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // <-- THIS LINE IS THE FIX

import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [auth, setAuth] = useState({ token: null, isAuthenticated: false, user: null, loading: true });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token); // <-- THIS LINE IS THE FIX
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setAuth({ token: null, isAuthenticated: false, user: null, loading: false });
        } else {
          setAuthToken(token);
          setAuth({ token, isAuthenticated: true, user: {id: decoded.id}, loading: false });
        }
      } catch (error) {
        localStorage.removeItem('token');
        setAuth({ token: null, isAuthenticated: false, user: null, loading: false });
      }
    } else {
      setAuth({ token: null, isAuthenticated: false, user: null, loading: false });
    }
  }, []);

  const setAuthToken = token => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  };

  const loadUser = (token) => {
      const decoded = jwtDecode(token); // <-- THIS LINE IS THE FIX
      setAuth({ token, isAuthenticated: true, user: {id: decoded.id}, loading: false });
      setAuthToken(token);
  }

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setAuth({ token: null, isAuthenticated: false, user: null, loading: false });
  };

  if (auth.loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen font-sans">
        <Navbar auth={auth} logout={logout} />
        <main className="container mx-auto p-4 md:p-8">
          <Routes>
            <Route path="/login" element={!auth.isAuthenticated ? <LoginPage loadUser={loadUser} /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!auth.isAuthenticated ? <RegisterPage loadUser={loadUser} /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={auth.isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to={auth.isAuthenticated ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;