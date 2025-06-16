import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn"; // MUI icon

export default function DestinationCard({ destination, onBook }) {
  return (
    <Card
      sx={{
        width: 320,
        height: 430,
        m: 2,
        borderRadius: 3,
        boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
        transition: "transform 0.4s ease, box-shadow 0.4s ease",
        perspective: 1000,
        cursor: "pointer",
        "&:hover": {
          transform: "rotateY(8deg) translateY(-10px)",
          boxShadow: "0 20px 40px rgba(230,126,34,0.4)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={destination.imageUrl}
          alt={destination.name}
          sx={{
            transition: "transform 0.5s ease",
            "&:hover": { transform: "scale(1.1)" },
          }}
        />
        {/* Gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "70px",
            background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        />
      </Box>

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 700,
            mb: 0.5,
            color: "#2c3e50",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {destination.name}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
            color: "#34495e",
          }}
        >
          <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: "#e67e22" }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
            {destination.country}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            mb: 1,
          }}
        >
          {destination.description}
        </Typography>
        <Box sx={{ mt: "auto" }}>
          <Typography
            variant="h6"
            sx={{
              color: "#e67e22",
              fontWeight: 600,
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            ₹ {destination.avgPackagePriceInr.toLocaleString()}
            {/* You can add a rupee icon here if you want */}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#e67e22",
              fontWeight: "bold",
              fontFamily: "'Poppins', sans-serif",
              borderRadius: 2,
              boxShadow: "0 5px 15px rgba(230,126,34,0.4)",
              transition: "background-color 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                backgroundColor: "#cf711f",
                boxShadow: "0 8px 25px rgba(207,113,31,0.7)",
                transform: "scale(1.05)",
              },
            }}
            onClick={() => onBook(destination)}
          >
            Book Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
