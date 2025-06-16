// src/components/TripPlannerForm.jsx
import React, { useState } from "react";
import axios from "axios";

const currencies = ["USD", "EUR", "INR", "GBP"];
const travelTypes = ["Solo", "Couple", "Family"];
const preferencesList = ["Adventure", "Relaxation", "Culture", "Nature"];

export default function TripPlannerForm({ onTripsGenerated }) {
  const [formData, setFormData] = useState({
    destination: "",
    days: 5,
    travelType: "Solo",
    preferences: "Adventure",
    budget: 1000,
    currency: "USD",
  });
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "destination" && value.length > 2) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`)
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data);
        });
    }
  };

  const handleSelectSuggestion = (place) => {
    setFormData({ ...formData, destination: place.display_name });
    setSuggestions([]);
  };

  const handleSliderChange = (e) => {
    setFormData({ ...formData, budget: parseInt(e.target.value, 10) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/trips/generate", formData);
      onTripsGenerated(res.data);
    } catch (error) {
      console.error("Error generating trips:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800">Plan Your Trip 🧳</h2>

      <div className="relative">
        <label className="block text-sm font-medium">Destination</label>
        <input
          type="text"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded"
          required
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
            {suggestions.map((sug) => (
              <li
                key={sug.place_id}
                className="p-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleSelectSuggestion(sug)}
              >
                {sug.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Days</label>
        <input
          type="number"
          name="days"
          value={formData.days}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded"
          min="1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Travel Type</label>
        <select
          name="travelType"
          value={formData.travelType}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded"
        >
          {travelTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Preferences</label>
        <select
          name="preferences"
          value={formData.preferences}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded"
        >
          {preferencesList.map((pref) => (
            <option key={pref} value={pref}>
              {pref}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">
          Budget: {formData.currency} {formData.budget}
        </label>
        <input
          type="range"
          name="budget"
          value={formData.budget}
          onChange={handleSliderChange}
          min="100"
          max="10000"
          className="w-full mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Currency</label>
        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded"
        >
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        {loading ? "Planning..." : "Generate Trip 🧠"}
      </button>
    </form>
  );
}
