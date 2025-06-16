import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    sex: "",
    password: "",
    preferredCurrency: "",
    preferredLanguage: "",
    defaultLocation: "",
  });

  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/");
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleGenderChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      sex: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending:", formData);

    try {
      const response = await axios.post(
        "http://localhost:8090/api/user/auth/register",
        formData
      );
      console.log("Registration successful:", response.data);
      alert("User registered successfully!");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed!");
    }
  };

  return (
    <>
      <div className="text-center mb-3">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleBack}
        >
          ⬅ Back
        </button>
      </div>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="card shadow-lg rounded-4 p-4"
          style={{
            width: "100%",
            maxWidth: "450px",
            backgroundColor: "#ffffff",
          }}
        >
          <div className="card-body">
            <h4 className="card-title text-center mb-4 text-primary">
              CREATE ACCOUNT
            </h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="Enter Your Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  EMAIL *
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  PASSWORD *
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter Your Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">GENDER *</label>
                <br />
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="male"
                    name="sex"
                    value="Male"
                    checked={formData.sex === "Male"}
                    onChange={handleGenderChange}
                    required
                  />
                  <label className="form-check-label" htmlFor="male">
                    Male
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="female"
                    name="sex"
                    value="Female"
                    checked={formData.sex === "Female"}
                    onChange={handleGenderChange}
                    required
                  />
                  <label className="form-check-label" htmlFor="female">
                    Female
                  </label>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  CONTACT NUMBER *
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="form-control"
                  placeholder="Enter Your Contact Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="preferredCurrency" className="form-label">
                  PREFERRED CURRENCY
                </label>
                <input
                  type="text"
                  id="preferredCurrency"
                  className="form-control"
                  placeholder="e.g., INR, USD"
                  value={formData.preferredCurrency}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="preferredLanguage" className="form-label">
                  PREFERRED LANGUAGE
                </label>
                <input
                  type="text"
                  id="preferredLanguage"
                  className="form-control"
                  placeholder="e.g., English"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="defaultLocation" className="form-label">
                  DEFAULT LOCATION
                </label>
                <input
                  type="text"
                  id="defaultLocation"
                  className="form-control"
                  placeholder="e.g., Bangalore"
                  value={formData.defaultLocation}
                  onChange={handleChange}
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary btn">
                  CREATE
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
