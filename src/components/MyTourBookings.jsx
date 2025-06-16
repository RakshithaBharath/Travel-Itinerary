import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function MyTourBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          alert("Please login to view bookings.");
          setLoading(false);
          return;
        }

        // API returns a list of destinations directly
        const res = await fetch(
          `http://localhost:8090/api/destinations/user/${userId}`
        );
        const data = await res.json();

        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (bookings.length === 0) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h6">You have no tour bookings yet.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        My Tour Bookings
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {bookings.map((dest) => (
          <Grid
            item
            key={dest.id}
            xs={12}
            sm={6}
            md={4}
            sx={{ display: "flex" }}
          >
            <Card
              sx={{
                maxWidth: 350,
                boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={dest.imageUrl}
                alt={dest.name}
              />
              <CardContent
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
              >
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {dest.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocationOnIcon sx={{ color: "#e67e22", mr: 0.5 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    {dest.country}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    flexGrow: 1, // this makes description take available space
                    mb: 2,
                  }}
                  gutterBottom
                >
                  {dest.description}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#e67e22", fontWeight: 600, mt: "auto" }}
                >
                  ₹ {dest.avgPackagePriceInr.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
