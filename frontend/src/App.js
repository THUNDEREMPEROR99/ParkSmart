
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DriverView from './pages/DriverView';
import BookingPage from './pages/BookingPage';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
  		<span>Park</span><span className="smart-text">Smart</span>
		</div>
          <div className="nav-links">
            <Link to="/">Driver View</Link>
            <Link to="/admin">Admin</Link>
          </div>
        </nav>
        <div className="content">
          <Routes>
            <Route path="/" element={<DriverView />} />
            <Route path="/book/:slotId" element={<BookingPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
