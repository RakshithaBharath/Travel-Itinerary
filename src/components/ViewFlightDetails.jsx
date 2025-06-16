import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewFlightDetails = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        // ✅ Example assuming 'userId' is stored as a string in localStorage
        const userId = localStorage.getItem("userId");

        if (!userId) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:8090/api/flights/user/${userId}`
        );
        setFlights(response.data);
      } catch (err) {
        console.error("Error fetching flights:", err);
        setError("Unable to fetch flights.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  if (loading) return <div className="p-4">Loading your bookings...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (flights.length === 0)
    return <div className="p-4">No bookings found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Your Flight Bookings</h2>
      <div className="grid gap-4">
        {flights.map((flight, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-xl shadow-md border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold">{flight.airline}</h3>
              <span className="text-gray-500 text-sm">
                Passengers: {flight.passengers}
              </span>
            </div>
            <div className="text-gray-700 mb-1">
              {flight.departureCity} → {flight.arrivalCity}
            </div>
            <div className="text-gray-500 text-sm mb-2">
              Arrival:{" "}
              {flight.arrivalTime
                ? new Date(flight.arrivalTime).toLocaleString()
                : "N/A"}
            </div>
            <div className="font-bold text-lg">
              USD {flight.price.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewFlightDetails;
