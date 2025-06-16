import React, { useState } from "react";

const Support = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been submitted!");
    // 🔔 You can POST formData to backend API here
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">Contact Support</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-md p-8 space-y-6"
      >
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring focus:ring-blue-400"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Support;
