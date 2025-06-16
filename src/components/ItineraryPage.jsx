import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItineraryDisplay from "./ItineraryDisplay"; // Displays single trip
import axiosInstance from "../utility/axiosInstance";
import "./ItineraryPage.css";
import {
  CircularProgress,
  Button,
  Typography,
  Box,
  Container,
} from "@mui/material";

const ItineraryPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const validUserId = userId && userId !== "undefined" && userId !== "null";

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/trips/user/${userId}`);
      setTrips(response.data || []);
    } catch (err) {
      console.error("Failed to fetch trips:", err);
      setError("Unable to fetch trips. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (validUserId) {
      fetchTrips();
    } else {
      setLoading(false);
    }
  }, [validUserId]);

  if (!validUserId) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Please login to view your itineraries.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={fetchTrips}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  if (!trips.length) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No trips found for this user.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Explore Destinations
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Your Itineraries
      </Typography>

      {trips.map((trip, index) => (
        <Box key={trip.id || index} sx={{ mb: 4 }}>
          <ItineraryDisplay trip={trip} />
        </Box>
      ))}
    </Container>
  );
};

export default ItineraryPage;
