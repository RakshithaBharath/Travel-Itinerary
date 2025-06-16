import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";

export default function BookingModal({ destination, onClose }) {
  const [booking, setBooking] = useState(false);
  const [travellers, setTravellers] = useState(1);

  const handleSubmit = async () => {
    if (!destination?.id) {
      alert("Destination ID is missing!");
      return;
    }
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login to book.");
      return;
    }

    const url = `http://localhost:8090/api/destinations/book?userId=${userId}&destinationId=${destination.id}&travellers=${travellers}`;

    try {
      setBooking(true);
      const response = await fetch(url, {
        method: "POST",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Booking failed");
      }

      alert("Booking successful!");
      onClose(); // close modal after booking
    } catch (err) {
      alert("Booking failed: " + err.message);
    } finally {
      setBooking(false);
    }
  };

  return (
    <Modal open={!!destination} onClose={onClose}>
      <Box
        sx={{
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Book Trip to {destination?.name}
        </Typography>

        <TextField
          fullWidth
          type="number"
          label="No. of Travellers"
          value={travellers}
          onChange={(e) => setTravellers(e.target.value)}
          inputProps={{ min: 1 }}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={booking}
        >
          {booking ? "Booking..." : "Confirm Booking"}
        </Button>
      </Box>
    </Modal>
  );
}
