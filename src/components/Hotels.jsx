import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

export default function Hotels() {
  // States
  const navigate = useNavigate();
  const [city, setCity] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [hotels, setHotels] = useState([]);
  const [displayedHotels, setDisplayedHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adults, setAdults] = useState(1);
  const [currency, setCurrency] = useState("USD");
  const [page, setPage] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "info",
    message: "",
  });
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [rooms, setRooms] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [sortBy, setSortBy] = useState(""); // Sorting state

  const todayStr = new Date().toISOString().split("T")[0];
  const minCheckoutDate = checkIn
    ? new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    : todayStr;

  // Effect: reset displayedHotels when hotels change or sort changes
  useEffect(() => {
    let sortedHotels = [...hotels];
    if (sortBy === "priceAsc") {
      sortedHotels.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "priceDesc") {
      sortedHotels.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "ratingDesc") {
      sortedHotels.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    setDisplayedHotels(sortedHotels.slice(0, PAGE_SIZE));
    setPage(0);
  }, [hotels, sortBy]);

  const searchHotels = async () => {
    if (
      !city ||
      typeof city !== "object" ||
      !city.label ||
      !city.label.trim()
    ) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Please enter city",
      });
      return;
    }
    if (!checkIn || !checkOut) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Please select check-in and check-out dates",
      });
      return;
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Check-out must be after check-in",
      });
      return;
    }
    if (adults < 1) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Number of adults must be at least 1",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.get("/hotels/live-search", {
        params: {
          city: city.label,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          adults,
          currency,
          page: 0,
          size: PAGE_SIZE * 3,
        },
      });
      setHotels(res.data);
      setSnackbar({
        open: true,
        severity: "success",
        message: `${res.data.length} hotels found`,
      });
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message: err.response?.data?.message || err.message,
      });
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreHotels = () => {
    const nextPage = page + 1;
    const nextSlice = hotels.slice(0, PAGE_SIZE * (nextPage + 1));
    setDisplayedHotels(nextSlice);
    setPage(nextPage);
  };

  const openBooking = (hotel) => {
    setSelectedHotel(hotel);
    setRooms(1);
    setSpecialRequests("");
    setBookingOpen(true);
  };

  const closeBooking = () => {
    setBookingOpen(false);
    setSelectedHotel(null);
  };

  const submitBooking = async () => {
    if (rooms < 1) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Number of rooms must be at least 1",
      });
      return;
    }
    try {
      const bookingRequest = {
        hotelName: selectedHotel.name,
        userId: localStorage.getItem("userId"),
        location: city.label,
        imageUrl: selectedHotel.imageUrl,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        price: selectedHotel.price,
        rooms,
        specialRequests,
        currency: currency,
      };
      console.log(bookingRequest);

      const res = await axiosInstance.post("/hotels/book", bookingRequest);
      setBookingRef(res.data.bookingRef || "N/A");
      setBookingConfirmed(true);
      closeBooking();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Booking confirmed!",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message: err.response?.data?.message || err.message,
      });
    }
  };

  if (bookingConfirmed) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            p: 3,
            maxWidth: 600,
            mx: "auto",
            textAlign: "center",
            position: "relative",
            zIndex: 2,
            backgroundColor: "rgba(255,255,255,0.85)",
            borderRadius: 2,
            mt: 6,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Booking Confirmed!
          </Typography>
          <Typography>Your booking reference is:</Typography>
          <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
            {bookingRef}
          </Typography>
          <Button
            sx={{ mt: 3, mr: 2 }}
            variant="outlined"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
          <Button
            sx={{ mt: 3 }}
            variant="contained"
            onClick={() => setBookingConfirmed(false)}
          >
            Search Again
          </Button>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      {/* Background video */}
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
            filter: "brightness(0.5)",
          }}
        >
          <source
            src="https://cdn.pixabay.com/video/2019/08/10/25907-354651355_large.mp4"
            type="video/mp4"
          />
          {/* fallback */}
          Your browser does not support the video tag.
        </video>

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.4)",
          }}
        />
      </Box>

      {/* Main content container */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 900,
          margin: "auto",
          p: 3,
          bgcolor: "rgba(255,255,255,0.2)",
          borderRadius: 2,
          minHeight: "100vh",
          pt: 6,
          pb: 6,
          "& .MuiInputLabel-root": { color: "white" }, // label
          "& .MuiOutlinedInput-root": {
            color: "white", // input text
            "& fieldset": {
              borderColor: "white", // border
            },
            "&:hover fieldset": {
              borderColor: "white",
            },
            "&.Mui-focused fieldset": {
              borderColor: "white",
            },
          },
          "& input::placeholder": {
            color: "rgba(255,255,255,0.7)", // placeholder
          },
        }}
      >
        <Typography variant="h4" gutterBottom textAlign="center" color="white">
          Search Hotels
        </Typography>

        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={12}>
            <CitySearchAutocomplete
              selectedCity={city}
              setSelectedCity={setCity}
              label="Select City"
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              label="Check-in"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              inputProps={{ min: todayStr }}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              label="Check-out"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              inputProps={{ min: minCheckoutDate }}
              disabled={!checkIn}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              label="Adults"
              type="number"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              inputProps={{ min: 1 }}
              disabled={!checkIn}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              select
              label="Currency"
              fullWidth
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="RUB">RUB</option>
              <option value="INR">INR</option>
            </TextField>
          </Grid>

          {/* Sorting dropdown */}
          <Grid item xs={12} sm={12}>
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
              <MenuItem value="ratingDesc">Rating: High to Low</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={searchHotels}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 3 }}>
          {displayedHotels.length === 0 && !loading && (
            <Typography sx={{ mt: 3, textAlign: "center", width: "100%" }}>
              No hotels found. Try searching above.
            </Typography>
          )}

          {displayedHotels.map((hotel, idx) => (
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
                  flexDirection: { xs: "column", sm: "row" },
                  height: "100%",
                  bgcolor: "rgba(255,255,255,0.9)",
                }}
              >
                <Box
                  sx={{ position: "relative", width: { xs: "100%", sm: 160 } }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: "100%", height: 120, objectFit: "cover" }}
                    image={
                      hotel.imageUrl
                        ? hotel.imageUrl.replace(/\.auto$/, ".jpg")
                        : "https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg?cs=srgb&dl=pexels-terry-magallanes-2631746.jpg&fm=jpg"
                    }
                    alt={hotel.name}
                  />
                  {/* Dark overlay on image */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      bgcolor: "rgba(0,0,0,0.25)",
                    }}
                  />
                </Box>

                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6">{hotel.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {hotel.city}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    {currency} {hotel.price ? hotel.price.toFixed(2) : "N/A"}{" "}
                    per night
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    Rating: {hotel.rating ? hotel.rating.toFixed(1) : "N/A"}
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => openBooking(hotel)}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {displayedHotels.length < hotels.length && (
          <Box sx={{ textAlign: "center", mt: 3, color: "white" }}>
            <Button variant="outlined" onClick={loadMoreHotels}>
              Load More
            </Button>
          </Box>
        )}

        <Dialog
          open={bookingOpen}
          onClose={closeBooking}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Book Hotel: {selectedHotel?.name}</DialogTitle>
          <DialogContent>
            <TextField
              label="Check-in"
              type="date"
              fullWidth
              disabled
              InputLabelProps={{ shrink: true }}
              value={checkIn}
              sx={{ mt: 1, mb: 2 }}
            />
            <TextField
              label="Check-out"
              type="date"
              fullWidth
              disabled
              InputLabelProps={{ shrink: true }}
              value={checkOut}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Number of Rooms"
              type="number"
              fullWidth
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value))}
              inputProps={{ min: 1 }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Special Requests"
              fullWidth
              multiline
              rows={3}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeBooking}>Cancel</Button>
            <Button variant="contained" onClick={submitBooking}>
              Confirm Booking
            </Button>
          </DialogActions>
        </Dialog>

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

        {/* Fade in keyframes */}
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
  );
}
