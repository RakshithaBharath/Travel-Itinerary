import React, { useState } from "react";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Itinerary from "./components/TripForm";
import Login from "./components/Login";
import Register from "./components/Register";
import ItineraryPage from "./components/ItineraryPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import TripPlannerForm from "./components/TripPlannerForm";
import ServicesPage from "./components/ServicesPage";
import Hotels from "./components/Hotels";
import Flight from "./components/Flight";
import HotelBookingsPage from "./components/HotelBookingsPage";
import Navbar from "./components/Navbar";
import ViewDestinations from "./components/ViewDestinations";
import MyTourBookings from "./components/MyTourBookings";
import ViewFlightDetails from "./components/ViewFlightDetails";
import Footer from "./components/Footer";
import About from "./components/About";
import TravelBlog from "./components/TravelBlog";
import BlogDetails from "./components/BlogDetails";
import Support from "./components/Support";

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="app-container">
      <Router>
        <Navbar openLoginModal={() => setShowLoginModal(true)} />
        {showLoginModal && (
          <Login
            onClose={() => setShowLoginModal(false)}
            onLogin={() => setShowLoginModal(false)}
          />
        )}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/itinerary" element={<Itinerary />} />
            <Route path="/view_itinerary" element={<ItineraryPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/search" element={<TripPlannerForm />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/flights" element={<Flight />} />
            <Route path="/my-hotel-bookings" element={<HotelBookingsPage />} />
            <Route path="/destinations" element={<ViewDestinations />} />
            <Route path="/my-tour-bookings" element={<MyTourBookings />} />
            <Route path="/my-flight-bookings" element={<ViewFlightDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<TravelBlog />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
