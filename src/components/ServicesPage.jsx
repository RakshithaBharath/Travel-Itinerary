import React from "react";
import { useNavigate } from "react-router-dom";
import Services from "../components/Services";

export default function ServicesPage() {
  const navigate = useNavigate();

  const handleSelect = (service) => {
    if (service === "flight") navigate("/flights");
    else if (service === "hotel") navigate("/hotels");
  };

  return <Services onSelect={handleSelect} />;
}
