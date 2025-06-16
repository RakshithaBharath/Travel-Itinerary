import React, { useState, useEffect, useMemo } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function CitySearchAutocomplete({
  selectedCity,
  setSelectedCity,
  label = "City",
}) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCities = useMemo(
    () =>
      debounce(async (query) => {
        if (!query) {
          setOptions([]);
          return;
        }
        setLoading(true);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              query
            )}&addressdetails=1&limit=5`
          );
          const data = await response.json();

          console.log(data); // see what is returned for Hyderabad query

          const cityOptions = data.map((place) => ({
            label:
              place.address?.city ||
              place.address?.town ||
              place.address?.village ||
              place.display_name,
            lat: place.lat,
            lon: place.lon,
          }));

          setOptions(cityOptions);
        } catch (error) {
          console.error("Error fetching cities:", error);
          setOptions([]);
        } finally {
          setLoading(false);
        }
      }, 500),
    []
  );

  useEffect(() => {
    fetchCities(inputValue);
  }, [inputValue, fetchCities]);

  return (
    <Autocomplete
      fullWidth
      options={options}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.label || ""
      }
      loading={loading}
      value={selectedCity}
      onChange={(event, newValue) => setSelectedCity(newValue)}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      filterOptions={(x) => x} // API handles filtering
      sx={{
        "& .MuiInputBase-input": {
          overflow: "visible !important",
          whiteSpace: "normal !important",
          textOverflow: "clip !important",
          width: "auto !important",
          maxWidth: "100% !important",
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
