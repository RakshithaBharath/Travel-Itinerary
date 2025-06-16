import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue in React (optional, but recommended)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ItineraryDisplay = ({ trip }) => {
  console.log(trip);
  if (!trip) {
    return (
      <div className="container my-5">
        <h3 className="text-danger text-center">No trip data available.</h3>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-primary fw-bold">{trip.title}</h1>

      {/* Trip Summary */}
      <div className="p-4 rounded shadow bg-light border border-primary mb-5">
        <div className="row gy-3">
          <div className="col-md-3 text-center text-md-start">
            <h5 className="text-info">📅 Dates</h5>
            <p className="fs-5">
              {trip.startDate} &rarr; {trip.endDate}
            </p>
          </div>
          <div className="col-md-3 text-center text-md-start">
            <h5 className="text-info">👥 Travelers</h5>
            <p className="fs-5">{trip.travelers}</p>
          </div>
          <div className="col-md-3 text-center text-md-start">
            <h5 className="text-info">💰 Budget</h5>
            <p className="fs-5">
              {trip.currency ?? "INR"} {trip.budget}
            </p>
          </div>
          <div className="col-md-3 text-center text-md-start">
            <h5 className="text-info">📝 Notes</h5>
            <p className="fs-6 fst-italic">{trip.notes || "No notes added"}</p>
          </div>
        </div>
      </div>

      {/* Itinerary Days */}
      <h3 className="mb-4 text-success">🗓️ Itinerary Days</h3>

      {Array.isArray(trip.days) && trip.days.length > 0 ? (
        trip.days.map((day, idx) => (
          <div
            key={idx}
            className="card mb-5 border-success shadow-lg"
            style={{ borderWidth: "2px" }}
          >
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                Day {idx + 1}: {day.title}
              </h4>
              <small>{day.date}</small>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-4">
                  <p>
                    <strong>🚗 Transport:</strong>{" "}
                    {day.transportMode || <em>Not specified</em>}
                  </p>
                </div>
                <div className="col-md-4">
                  <p>
                    <strong>🍴 Meals:</strong>{" "}
                    {day.meals || <em>Not specified</em>}
                  </p>
                </div>
                <div className="col-md-4">
                  <p>
                    <strong>💵 Cost Est.:</strong>{" "}
                    {day.costEstimate ? (
                      `${trip.currency ?? "INR"} ${day.costEstimate}`
                    ) : (
                      <em>Not estimated</em>
                    )}
                  </p>
                </div>
              </div>

              <p>
                <strong>📝 Notes:</strong> {day.notes || <em>No notes</em>}
              </p>

              <h5 className="mt-4 mb-3 text-primary">📍 Locations</h5>

              {Array.isArray(day.locations) && day.locations.length > 0 ? (
                <div className="row">
                  {/* Left: Locations List */}
                  <div className="col-md-6">
                    {day.locations.map((loc, i) => (
                      <div
                        key={i}
                        className="card mb-3 border-info shadow-sm"
                        style={{ borderWidth: "1.5px" }}
                      >
                        <div className="card-body">
                          <h6>{loc.name}</h6>
                          <p>
                            <strong>Coords:</strong> ({loc.latitude},{" "}
                            {loc.longitude})
                          </p>
                          <p>
                            <strong>Duration:</strong>{" "}
                            {loc.visitDuration || "N/A"}
                          </p>
                          <p>
                            <strong>Time Slot:</strong> {loc.timeSlot || "N/A"}
                          </p>
                          <p>
                            <strong>Priority:</strong>{" "}
                            {loc.priority ? "⭐ Yes" : "No"}
                          </p>
                          <p>
                            <strong>Booking:</strong>{" "}
                            {loc.bookingInfo || "None"}
                          </p>
                          <p>
                            <strong>Temp:</strong> {loc.temperature || "N/A"} °C
                          </p>
                          <p>
                            <strong>Weather:</strong>{" "}
                            {loc.weatherCondition || "N/A"}
                          </p>
                          <p>
                            <strong>Weather Time:</strong>{" "}
                            {loc.weatherDatetime || "N/A"}
                          </p>
                          {loc.photosLinks && (
                            <img
                              src={loc.photosLinks}
                              alt={loc.name}
                              className="img-fluid rounded mt-2"
                              style={{ maxHeight: "150px", objectFit: "cover" }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right: Map */}
                  <div className="col-md-6">
                    <MapContainer
                      center={[
                        day.locations[0].latitude,
                        day.locations[0].longitude,
                      ]}
                      zoom={10}
                      scrollWheelZoom={false}
                      style={{ height: "350px", borderRadius: "8px" }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {day.locations.map((loc, i) => (
                        <Marker
                          key={i}
                          position={[loc.latitude, loc.longitude]}
                        >
                          <Popup>
                            <strong>{loc.name}</strong>
                            <br />
                            {loc.bookingInfo || "No booking info"}
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </div>
              ) : (
                <p className="fst-italic">No locations added for this day.</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted">No trip days found.</p>
      )}
    </div>
  );
};

export default ItineraryDisplay;
