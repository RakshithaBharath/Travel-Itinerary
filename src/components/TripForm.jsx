import React, { useState, useEffect } from "react";
import "./TripForm.css";
import axios from "axios";

import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";

const OPENWEATHER_API_KEY = "7f2f1f0ed77ef7f235d0e22173e921e3";

const currencyOptions = [
  { code: "USD", label: "US Dollar" },
  { code: "EUR", label: "Euro" },
  { code: "INR", label: "Indian Rupee" },
  // add more currencies as needed
];

const languageOptions = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  // add more languages as needed
];

// Helper function to get tomorrow's date ISO string
const getTomorrowISO = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

export default function TripForm() {
  const tomorrowISO = getTomorrowISO();

  const [trip, setTrip] = useState({
    title: "",
    startDate: "",
    endDate: "",
    notes: "",
    travelers: 1,
    budget: 0,
    countryCode: "",
    currency: "USD",
    language: "en",
    userId: localStorage.getItem("userId"),
    days: [],
  });

  const [errors, setErrors] = useState({});
  const [locationSuggestions, setLocationSuggestions] = useState({});

  // When startDate or endDate changes, update days array accordingly
  useEffect(() => {
    if (!trip.startDate || !trip.endDate) {
      setTrip((prev) => ({ ...prev, days: [] }));
      return;
    }

    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    if (end < start) {
      setTrip((prev) => ({ ...prev, days: [] }));
      return;
    }

    const daysCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    setTrip((prev) => {
      const oldDays = prev.days;
      const newDays = [];

      for (let i = 0; i < daysCount; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];

        // Reuse old day if same date
        const existingDay = oldDays.find((d) => d.date === dateStr);
        newDays.push(
          existingDay || {
            date: dateStr,
            title: "",
            notes: "",
            transportMode: "",
            meals: "",
            costEstimate: 0,
            locations: [
              {
                name: "",
                latitude: "",
                longitude: "",
                visitDuration: "",
                timeSlot: "",
                priority: false,
                bookingInfo: "",
                photosLinks: "",
                weatherCondition: "",
                weatherIcon: "",
                temperature: "",
              },
            ],
          }
        );
      }

      return { ...prev, days: newDays };
    });
  }, [trip.startDate, trip.endDate]);

  // Handle trip-level changes
  const handleTripChange = (field, value) => {
    setTrip((prev) => ({ ...prev, [field]: value }));
  };

  // Handle day-level changes
  const handleDayChange = (dayIndex, field, value) => {
    setTrip((prev) => {
      const newDays = [...prev.days];
      newDays[dayIndex] = { ...newDays[dayIndex], [field]: value };
      return { ...prev, days: newDays };
    });
  };

  // Handle location-level changes
  const handleLocationChange = (dayIndex, locIndex, field, value) => {
    setTrip((prev) => {
      const newDays = [...prev.days];
      const day = newDays[dayIndex];
      const newLocations = [...day.locations];
      newLocations[locIndex] = { ...newLocations[locIndex], [field]: value };
      newDays[dayIndex] = { ...day, locations: newLocations };
      return { ...prev, days: newDays };
    });
  };

  // Add a new location to a day
  const addLocation = (dayIndex) => {
    setTrip((prev) => {
      const newDays = [...prev.days];
      const day = newDays[dayIndex];
      newDays[dayIndex] = {
        ...day,
        locations: [
          ...day.locations,
          {
            name: "",
            latitude: "",
            longitude: "",
            visitDuration: "",
            timeSlot: "",
            priority: false,
            bookingInfo: "",
            photosLinks: "",
            weatherCondition: "",
            weatherIcon: "",
            temperature: "",
          },
        ],
      };
      return { ...prev, days: newDays };
    });
  };

  // Remove a location from a day
  const removeLocation = (dayIndex, locIndex) => {
    setTrip((prev) => {
      const newDays = [...prev.days];
      const day = newDays[dayIndex];
      if (day.locations.length === 1) return prev; // prevent removing last location
      const newLocations = day.locations.filter((_, i) => i !== locIndex);
      newDays[dayIndex] = { ...day, locations: newLocations };
      return { ...prev, days: newDays };
    });
  };

  // Fetch location suggestions from Nominatim OpenStreetMap API
  const fetchLocationSuggestions = async (dayIndex, locIndex, query) => {
    if (!query) {
      setLocationSuggestions((prev) => ({
        ...prev,
        [`${dayIndex}_${locIndex}`]: [],
      }));
      return;
    }
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=5`;
      const response = await fetch(url);
      const data = await response.json();
      setLocationSuggestions((prev) => ({
        ...prev,
        [`${dayIndex}_${locIndex}`]: data,
      }));
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  // When user selects a location from autocomplete
  const handleSelectLocation = (dayIndex, locIndex, selected) => {
    handleLocationChange(dayIndex, locIndex, "name", selected.display_name);
    handleLocationChange(dayIndex, locIndex, "latitude", selected.lat);
    handleLocationChange(dayIndex, locIndex, "longitude", selected.lon);

    // Fetch weather for selected location
    fetchWeather(selected.lat, selected.lon, dayIndex, locIndex);
  };

  // Fetch weather info from OpenWeatherMap
  const fetchWeather = async (lat, lon, dayIndex, locIndex) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=7f2f1f0ed77ef7f235d0e22173e921e3`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      if (data.weather && data.weather.length > 0 && data.main) {
        const condition = data.weather[0].main;
        const icon = data.weather[0].icon;
        const temp = data.main.temp;

        handleLocationChange(dayIndex, locIndex, "weatherCondition", condition);
        handleLocationChange(dayIndex, locIndex, "weatherIcon", icon);
        handleLocationChange(dayIndex, locIndex, "temperature", temp);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // Validate trip data before submit
  const validate = () => {
    const errs = {};
    if (!trip.title.trim()) errs.title = "Trip title is required";
    if (!trip.startDate) errs.startDate = "Start date is required";
    if (!trip.endDate) errs.endDate = "End date is required";
    if (trip.startDate && trip.startDate < tomorrowISO)
      errs.startDate = "Start date must be tomorrow or later";
    if (trip.endDate && trip.startDate && trip.endDate < trip.startDate)
      errs.endDate = "End date cannot be before start date";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await axios.post(
        "http://localhost:8090/api/trips",
        trip
      );
      console.log("Trip inserted successful:", response.data);
      alert("Trip inserted successfully!");
    } catch (error) {
      console.error(" failed to insert:", error);
      alert("Insertion failed!");
    }

    // Output the trip JSON (without userId or anything extra)
    alert("Trip JSON output printed in console.");
    console.log("Trip JSON:", trip);

    console.log("Trip data to submit:", JSON.stringify(trip));
  };

  return (
    <div className="bodyCard">
      <Box sx={{ maxWidth: 900, margin: "auto", p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Trip Planner Form
        </Typography>

        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            {/* Trip basic info */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Trip Title"
                value={trip.title}
                onChange={(e) => handleTripChange("title", e.target.value)}
                fullWidth
                required
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={trip.startDate}
                onChange={(e) => handleTripChange("startDate", e.target.value)}
                fullWidth
                required
                error={!!errors.startDate}
                helperText={errors.startDate}
                inputProps={{ min: tomorrowISO }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={trip.endDate}
                onChange={(e) => handleTripChange("endDate", e.target.value)}
                fullWidth
                required
                error={!!errors.endDate}
                helperText={errors.endDate}
                inputProps={{
                  min: trip.startDate || tomorrowISO,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Notes"
                multiline
                rows={3}
                value={trip.notes}
                onChange={(e) => handleTripChange("notes", e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                label="Number of Travelers"
                type="number"
                inputProps={{ min: 1 }}
                value={trip.travelers}
                onChange={(e) =>
                  handleTripChange("travelers", Math.max(1, +e.target.value))
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                label="Budget"
                type="number"
                inputProps={{ min: 0 }}
                value={trip.budget}
                onChange={(e) =>
                  handleTripChange("budget", Math.max(0, +e.target.value))
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                label="Country Code"
                value={trip.countryCode}
                onChange={(e) =>
                  handleTripChange("countryCode", e.target.value.toUpperCase())
                }
                fullWidth
                inputProps={{ maxLength: 2 }}
                helperText="ISO 2-letter country code"
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="currency-label">Currency</InputLabel>
                <Select
                  labelId="currency-label"
                  value={trip.currency}
                  label="Currency"
                  onChange={(e) => handleTripChange("currency", e.target.value)}
                >
                  {currencyOptions.map((cur) => (
                    <MenuItem key={cur.code} value={cur.code}>
                      {cur.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="language-label">Language</InputLabel>
                <Select
                  labelId="language-label"
                  value={trip.language}
                  label="Language"
                  onChange={(e) => handleTripChange("language", e.target.value)}
                >
                  {languageOptions.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Dynamic days section */}
            {trip.days.map((day, dayIndex) => (
              <Paper
                key={day.date}
                variant="outlined"
                sx={{ p: 2, mt: 3, width: "100%" }}
              >
                <Typography variant="h6" gutterBottom>
                  Day {dayIndex + 1} - {day.date}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Day Title"
                      value={day.title}
                      onChange={(e) =>
                        handleDayChange(dayIndex, "title", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Day Notes"
                      value={day.notes}
                      onChange={(e) =>
                        handleDayChange(dayIndex, "notes", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Transport Mode"
                      value={day.transportMode}
                      onChange={(e) =>
                        handleDayChange(
                          dayIndex,
                          "transportMode",
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Meals"
                      value={day.meals}
                      onChange={(e) =>
                        handleDayChange(dayIndex, "meals", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Cost Estimate"
                      type="number"
                      inputProps={{ min: 0 }}
                      value={day.costEstimate}
                      onChange={(e) =>
                        handleDayChange(
                          dayIndex,
                          "costEstimate",
                          Math.max(0, +e.target.value)
                        )
                      }
                      fullWidth
                    />
                  </Grid>

                  {/* Locations for the day */}
                  {day.locations.map((loc, locIndex) => {
                    const key = `${dayIndex}_${locIndex}`;
                    const suggestions = locationSuggestions[key] || [];
                    return (
                      <Paper
                        key={key}
                        variant="outlined"
                        sx={{ p: 2, mt: 2, width: "100%" }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={5}>
                            <Autocomplete
                              freeSolo
                              options={suggestions.map((s) => s)}
                              getOptionLabel={(option) =>
                                typeof option === "string"
                                  ? option
                                  : option.display_name || ""
                              }
                              inputValue={loc.name}
                              onInputChange={(e, val, reason) => {
                                if (reason === "input") {
                                  handleLocationChange(
                                    dayIndex,
                                    locIndex,
                                    "name",
                                    val
                                  );
                                  fetchLocationSuggestions(
                                    dayIndex,
                                    locIndex,
                                    val
                                  );
                                }
                              }}
                              onChange={(e, value) => {
                                if (value && typeof value !== "string") {
                                  handleSelectLocation(
                                    dayIndex,
                                    locIndex,
                                    value
                                  );
                                }
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Location Name"
                                  fullWidth
                                />
                              )}
                            />
                          </Grid>

                          <Grid item xs={6} sm={2}>
                            <TextField
                              label="Latitude"
                              value={loc.latitude}
                              onChange={(e) =>
                                handleLocationChange(
                                  dayIndex,
                                  locIndex,
                                  "latitude",
                                  e.target.value
                                )
                              }
                              fullWidth
                            />
                          </Grid>

                          <Grid item xs={6} sm={2}>
                            <TextField
                              label="Longitude"
                              value={loc.longitude}
                              onChange={(e) =>
                                handleLocationChange(
                                  dayIndex,
                                  locIndex,
                                  "longitude",
                                  e.target.value
                                )
                              }
                              fullWidth
                            />
                          </Grid>

                          <Grid item xs={6} sm={1}>
                            <TextField
                              label="Duration (hrs)"
                              type="number"
                              inputProps={{ min: 0 }}
                              value={loc.visitDuration}
                              onChange={(e) =>
                                handleLocationChange(
                                  dayIndex,
                                  locIndex,
                                  "visitDuration",
                                  e.target.value
                                )
                              }
                              fullWidth
                            />
                          </Grid>

                          <Grid item xs={6} sm={2}>
                            <TextField
                              label="Time Slot"
                              placeholder="e.g. 10am-12pm"
                              value={loc.timeSlot}
                              onChange={(e) =>
                                handleLocationChange(
                                  dayIndex,
                                  locIndex,
                                  "timeSlot",
                                  e.target.value
                                )
                              }
                              fullWidth
                            />
                          </Grid>

                          <Grid item xs={12} sm={3}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={loc.priority}
                                  onChange={(e) =>
                                    handleLocationChange(
                                      dayIndex,
                                      locIndex,
                                      "priority",
                                      e.target.checked
                                    )
                                  }
                                />
                              }
                              label="Priority"
                            />
                          </Grid>

                          <Grid item xs={12} sm={9}>
                            <TextField
                              label="Booking Info"
                              value={loc.bookingInfo}
                              onChange={(e) =>
                                handleLocationChange(
                                  dayIndex,
                                  locIndex,
                                  "bookingInfo",
                                  e.target.value
                                )
                              }
                              fullWidth
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Photos/Links"
                              value={loc.photosLinks}
                              onChange={(e) =>
                                handleLocationChange(
                                  dayIndex,
                                  locIndex,
                                  "photosLinks",
                                  e.target.value
                                )
                              }
                              fullWidth
                            />
                          </Grid>

                          {/* Weather info display */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            {loc.weatherIcon && (
                              <img
                                src={`https://openweathermap.org/img/wn/${loc.weatherIcon}@2x.png`}
                                alt={loc.weatherCondition}
                                style={{ marginRight: 8 }}
                              />
                            )}
                            <Typography variant="body2">
                              {loc.weatherCondition
                                ? `${loc.weatherCondition}, ${loc.temperature} °C`
                                : "No weather data"}
                            </Typography>
                          </Grid>

                          <Grid
                            item
                            xs={12}
                            sm={12}
                            sx={{ textAlign: "right" }}
                          >
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => removeLocation(dayIndex, locIndex)}
                              disabled={day.locations.length === 1}
                            >
                              Remove Location
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    );
                  })}

                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <Button
                      variant="contained"
                      onClick={() => addLocation(dayIndex)}
                    >
                      Add Location
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Grid item xs={12} sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" color="primary">
                Submit Trip
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </div>
  );
}
