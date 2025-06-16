import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css"; // Create your own CSS for styling

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = localStorage.getItem("username");

  // Hide navbar on login/register/forgot-password routes
  const hideNavbarPaths = ["/login", "/register", "/forgot-password"];
  if (hideNavbarPaths.includes(location.pathname)) {
    return null; // Don't render navbar on these pages
  }

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setShowProfileMenu(false);
    navigate("/"); // Redirect to home after logout
    window.location.reload(); // Optional: refresh page to reset state
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h2>
            <span className="highlight-letter">T</span>ravel
          </h2>
        </Link>
      </div>

      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/itinerary">Create Itinerary</Link>
        </li>
        <li>
          <Link to="/view_itinerary">View Itinerary</Link>
        </li>
        <li>
          <Link to="/destinations">Destination Booking</Link>
        </li>
        <li>
          <Link to="/services">Services</Link>
        </li>
      </ul>

      <div className="navbar-user">
        {!currentUser ? (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        ) : (
          <div
            className="profile-menu"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            {currentUser} ⏷
            {showProfileMenu && (
              <div className="profile-dropdown">
                <div
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/my-hotel-bookings");
                  }}
                  className="dropdown-item"
                >
                  View Hotel Bookings
                </div>
                <div
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/my-flight-bookings"); // create this route if needed
                  }}
                  className="dropdown-item"
                >
                  View Flight Bookings
                </div>
                <div
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/my-tour-bookings"); // create this route if needed
                  }}
                  className="dropdown-item"
                >
                  View Tour Bookings
                </div>
                <div onClick={handleLogout} className="dropdown-item logout">
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
