// components/DestinationList.jsx
import {
  Grid,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import DestinationCard from "./DestinationCard";
import BookingModal from "./BookingModal";

function DestinationList() {
  const [destinations, setDestinations] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);

  useEffect(() => {
    loadMore();
  }, []);

  const loadMore = async () => {
    setLoading(true);
    const res = await fetch(
      `http://localhost:8090/api/destinations?page=${page}&size=6`
    );
    const data = await res.json();
    console.log(data);
    setDestinations((prev) => [...prev, ...data]);
    setPage((prev) => prev + 1);
    setLoading(false);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Explore Destinations
      </Typography>
      <Grid container justifyContent="center">
        {destinations.map((dest) => (
          <DestinationCard
            key={dest.id}
            destination={dest}
            onBook={(d) => setSelectedDestination(d)}
          />
        ))}
      </Grid>
      {loading && <CircularProgress />}
      <Button onClick={loadMore} variant="outlined" sx={{ my: 3 }}>
        Load More
      </Button>

      {selectedDestination && (
        <BookingModal
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
        />
      )}
    </Container>
  );
}

export default DestinationList;
