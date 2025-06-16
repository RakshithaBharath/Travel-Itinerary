import React from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Grid,
  createTheme,
  ThemeProvider,
} from "@mui/material";

// Theme with rich colors and subtle shadows
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#f50057" },
    background: { default: "#f0f4f8" },
    text: { primary: "#222" },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h3: { fontWeight: 700 },
    body1: { fontSize: "1.1rem" },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
          },
        },
      },
    },
  },
});

// Replace these URLs with your preferred themed images (free sources: Unsplash, Pexels)
const flightImage =
  "https://images.pexels.com/photos/1154619/pexels-photo-1154619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"; // plane flying sky
const hotelImage =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"; // cozy hotel lobby

export default function Services({ onSelect }) {

    const navigate = useNavigate(); // Inside Login component


  <Services
    onSelect={(service) => {
      if (service === "flight") navigate("/flights");
      else if (service === "hotel") navigate("/hotels");
    }}
  />;
  // fallback: console.log if no onSelect passed

  const handleClick = (service) => {
    if (onSelect) onSelect(service);
    else console.log("Selected service:", service);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          p: { xs: 3, md: 6 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h3" gutterBottom>
          Choose Your Service
        </Typography>
        <Grid container spacing={5} sx={{ mt: 3, maxWidth: 1000, mx: "auto" }}>
          <Grid item xs={6}>
            <Card>
              <CardActionArea onClick={() => handleClick("flight")}>
                <Box
                  sx={{
                    height: 280,
                    backgroundImage: `url(${flightImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                  }}
                />
                <CardContent>
                  <Typography variant="h5" component="div" color="primary">
                    Flights
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Find and book the best flights for your journey.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card>
              <CardActionArea onClick={() => handleClick("hotel")}>
                <Box
                  sx={{
                    height: 280,
                    backgroundImage: `url(${hotelImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                  }}
                />
                <CardContent>
                  <Typography variant="h5" component="div" color="secondary">
                    Hotels
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Explore and book cozy hotels at your destination.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
