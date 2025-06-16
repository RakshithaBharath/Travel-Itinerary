import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const HotelBookingsPage = () => {
  const [hotelBookings, setHotelBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `http://localhost:8090/api/hotels/user/${localStorage.getItem(
            "userId"
          )}`
        );
        const data = await response.json();
        setHotelBookings(data);
      } catch (error) {
        console.error("Failed to fetch hotel bookings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        textAlign="center"
        sx={{ fontWeight: 700, mb: 4 }}
      >
        Your Hotel Bookings
      </Typography>

      {hotelBookings.length === 0 ? (
        <Typography variant="h6" color="text.secondary" textAlign="center">
          No bookings found.
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {hotelBookings.map((hotel) => (
            <Grid item key={hotel.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
                  borderRadius: 3,
                }}
              >
                {/* Optional: You can add an image here if you have one */}
                {/* <CardMedia
                  component="img"
                  height="180"
                  image={hotel.imageUrl || "default-image.jpg"}
                  alt={hotel.name}
                /> */}

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    <HotelIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    {hotel.name}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      color: "text.secondary",
                    }}
                  >
                    <LocationCityIcon sx={{ mr: 0.7 }} />
                    <Typography variant="subtitle2">{hotel.city}</Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      color: "text.secondary",
                    }}
                  >
                    <AttachMoneyIcon sx={{ mr: 0.7 }} />
                    <Typography variant="subtitle2">
                      {hotel.price} {hotel.currency}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "text.secondary",
                    }}
                  >
                    <CalendarTodayIcon sx={{ mr: 0.7 }} />
                    <Typography variant="body2" sx={{ mr: 2 }}>
                      Check-In: {hotel.checkInDate || "-"}
                    </Typography>
                    <Typography variant="body2">
                      Check-Out: {hotel.checkOutDate || "-"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box textAlign="center" mt={5}>
        <Button variant="contained" onClick={() => navigate(-1)}>
          ⟵ Back
        </Button>
      </Box>
    </Container>
  );
};

export default HotelBookingsPage;
