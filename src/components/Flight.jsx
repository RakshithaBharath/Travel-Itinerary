import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Snackbar,
  TextField,
  Typography,
  createTheme,
  ThemeProvider,
  MenuItem,
} from "@mui/material";
import CitySearchAutocomplete from "./CitySearchAutocomplete";
import axiosInstance from "../utility/axiosInstance";
import Navbar from "./Navbar";

const theme = createTheme({
  palette: {
    primary: { main: "#0077b6" },
    secondary: { main: "#90e0ef" },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
  },
});

const PAGE_SIZE = 5;

export default function Flights() {
  const todayStr = new Date().toISOString().split("T")[0];
  const minReturnDate = (departureDate) =>
    departureDate
      ? new Date(new Date(departureDate).getTime() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0]
      : todayStr;

  const [departureCity, setDepartureCity] = useState(null);
  const [arrivalCity, setArrivalCity] = useState(null);
  const [departureDate, setDepartureDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [flights, setFlights] = useState([]);
  const [currency, setCurrency] = useState();
  const [displayedFlights, setDisplayedFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "info",
    message: "",
  });
  const [sortBy, setSortBy] = useState("");

  // Booking states
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [travelerName, setTravelerName] = useState("");
  const [travelerEmail, setTravelerEmail] = useState("");
  const [travelerPhone, setTravelerPhone] = useState("");

  useEffect(() => {
    let sorted = [...flights];
    if (sortBy === "priceAsc") {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "priceDesc") {
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "durationAsc") {
      sorted.sort((a, b) => (a.duration || 0) - (b.duration || 0));
    }
    setDisplayedFlights(sorted.slice(0, PAGE_SIZE));
    setPage(0);
  }, [flights, sortBy]);

  const searchFlights = async () => {
    if (!departureCity?.label || !arrivalCity?.label) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Please select both departure and arrival cities",
      });
      return;
    }
    if (!departureDate) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Please select departure date",
      });
      return;
    }
    if (passengers < 1) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Passengers must be at least 1",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.get("/flights/live-search", {
        params: {
          origin: departureCity.label,
          destination: arrivalCity.label,
          departureDate,
          passengers,
        },
      });

      const mappedFlights = res.data.map((flight) => ({
        ...flight,
        airline: flight.carrierCode,
        departureCity: flight.departureAirport,
        arrivalCity: flight.arrivalAirport,
      }));

      setFlights(mappedFlights);

      setSnackbar({
        open: true,
        severity: "success",
        message: `${res.data.length} flights found`,
      });
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message: err.response?.data?.message || err.message,
      });
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreFlights = () => {
    const nextPage = page + 1;
    const nextSlice = flights.slice(0, PAGE_SIZE * (nextPage + 1));
    setDisplayedFlights(nextSlice);
    setPage(nextPage);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            zIndex: 0,
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.6)",
            }}
          >
            <source
              src="https://videos.pexels.com/video-files/3572188/3572188-hd_1920_1080_30fps.mp4"
              type="video/mp4"
            />
          </video>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(0,0,0,0.35)",
            }}
          />
        </Box>

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            maxWidth: 900,
            margin: "auto",
            p: 3,
            bgcolor: "rgba(255,255,255,0.15)",
            borderRadius: 2,
            minHeight: "100vh",
            pt: 6,
            pb: 6,
            color: "white",
            "& .MuiInputLabel-root": { color: "white" },
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
            "& input::placeholder": { color: "rgba(255,255,255,0.7)" },
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center"
            color="white"
          >
            Search Flights
          </Typography>

          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} sm={6}>
              <CitySearchAutocomplete
                selectedCity={departureCity}
                setSelectedCity={setDepartureCity}
                label="Departure City"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CitySearchAutocomplete
                selectedCity={arrivalCity}
                setSelectedCity={setArrivalCity}
                label="Arrival City"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Departure Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                inputProps={{ min: todayStr }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Passengers"
                type="number"
                fullWidth
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Sort By"
                fullWidth
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="priceAsc">Price: Low to High</MenuItem>
                <MenuItem value="priceDesc">Price: High to Low</MenuItem>
                <MenuItem value="durationAsc">Duration: Short to Long</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={searchFlights}
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            {displayedFlights.length === 0 && !loading && (
              <Typography sx={{ mt: 3, textAlign: "center", width: "100%" }}>
                No flights found. Try searching above.
              </Typography>
            )}

            {displayedFlights.map((flight, idx) => (
              <Grid
                item
                xs={12}
                sm={6}
                key={idx}
                sx={{
                  animation: "fadeIn 0.6s ease forwards",
                  opacity: 0,
                  animationDelay: `${idx * 150}ms`,
                }}
              >
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    bgcolor: "rgba(255,255,255,0.9)",
                  }}
                >
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6">
                      {flight.airline || "Airline"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {flight.departureCity} → {flight.arrivalCity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Departure: {flight.departureTime}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Arrival: {flight.arrivalTime}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                      {currency}{" "}
                      {flight.price ? flight.price.toFixed(2) : "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      Duration: {flight.duration || "N/A"}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={() => {
                        console.log("Flight selected:", flight);

                        setSelectedFlight(flight);
                        setBookingDialogOpen(true);
                      }}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {displayedFlights.length < flights.length && (
            <Box sx={{ textAlign: "center", mt: 3, color: "white" }}>
              <Button variant="outlined" onClick={loadMoreFlights}>
                Load More
              </Button>
            </Box>
          )}

          {selectedFlight && (
            <Dialog
              open={bookingDialogOpen}
              onClose={() => setBookingDialogOpen(false)}
            >
              <DialogTitle>Book Flight</DialogTitle>
              <DialogContent>
                <Typography variant="subtitle1" gutterBottom>
                  {selectedFlight.airline} | {selectedFlight.departureCity} →{" "}
                  {selectedFlight.arrivalCity}
                </Typography>
                <TextField
                  label="Departure City"
                  fullWidth
                  margin="normal"
                  value={departureCity?.label || ""}
                />
                <TextField
                  label="Arrival City"
                  fullWidth
                  margin="normal"
                  value={arrivalCity?.label || ""}
                />
                <TextField
                  label="Passengers"
                  fullWidth
                  margin="normal"
                  value={passengers}
                  inputProps={{ min: 1 }}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setBookingDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={async () => {
                    try {
                      const payload = {
                        userId: localStorage.getItem("userId"),
                        airline: selectedFlight.airline,
                        departureCity: selectedFlight.departureCity,
                        arrivalCity: selectedFlight.arrivalCity,
                        departureTime: selectedFlight.departureTime,
                        arrivalTime: selectedFlight.arrivalTime,
                        passengers: passengers,
                        price: selectedFlight.price,
                      };
                      console.log("Payload being sent for booking:", payload);
                      await axiosInstance.post("/flights/book", payload);
                      setSnackbar({
                        open: true,
                        severity: "success",
                        message: "Flight booked successfully!",
                      });
                      setBookingDialogOpen(false);
                    } catch (error) {
                      setSnackbar({
                        open: true,
                        severity: "error",
                        message:
                          error.response?.data?.message || "Booking failed",
                      });
                    }
                  }}
                >
                  Confirm Booking
                </Button>
              </DialogActions>
            </Dialog>
          )}

          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              severity={snackbar.severity}
              onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>

          <style>{`
          @keyframes fadeIn {
            to {
              opacity: 1;
              transform: translateY(0);
            }
            from {
              opacity: 0;
              transform: translateY(10px);
            }
          }
        `}</style>
        </Box>
      </ThemeProvider>
    </>
  );
}
