import React, { useEffect } from "react";

const HomePage = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Tailwind fade-in styles */}
      <style>{`
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1s ease-out, transform 1s ease-out;
        }
        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1513113406068-fff36fa8f987?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="bg-black bg-opacity-50 absolute inset-0"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-pulse">
            Plan Your Dream Trip
          </h1>
          <p className="text-xl mb-6">
            AI-powered itinerary planner tailored just for you
          </p>
          <a
            href="#explore"
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-6 rounded-full transition duration-300"
          >
            Explore Now
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="explore" className="py-16 px-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-10">What We Offer</h2>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              img: "https://images.unsplash.com/photo-1573068057232-fa17a193d54d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              alt: "Flights",
              title: "Flight & Hotel Booking",
              desc: "Compare and book your perfect flight and stay, all in one place.",
            },
            {
              img: "https://source.unsplash.com/400x300/?itinerary",
              alt: "Itinerary",
              title: "Smart Itinerary",
              desc: "AI-generated plans customized to your interests and travel style.",
            },
            {
              img: "https://source.unsplash.com/400x300/?maps,travel",
              alt: "Map",
              title: "Interactive Maps",
              desc: "Visualize your journey with real-time maps and weather updates.",
            },
          ].map(({ img, alt, title, desc }, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all fade-in"
            >
              <img
                src={img}
                alt={alt}
                className="rounded-xl mb-4 w-full object-cover"
                style={{
                  height: "200px",
                  minHeight: "200px",
                  maxHeight: "200px",
                }}
              />
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Animated Destination Cards */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10">
          Top Destinations
        </h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto">
          {["paris", "bali", "egypt", "iceland"].map((place, idx) => (
            <div
              key={idx}
              className="rounded-2xl shadow-lg hover:scale-105 transition-all w-full relative overflow-hidden"
              style={{ paddingTop: "75%" }} // 4:3 aspect ratio padding trick
            >
              <img
                src={`https://source.unsplash.com/600x450/?${place}`}
                alt={place}
                className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-yellow-400 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Your Journey Now</h2>
        <p className="mb-6">
          Create your personalized itinerary in minutes with our smart planner.
        </p>
        <a
          href="/login"
          className="bg-black text-white font-semibold py-2 px-6 rounded-full hover:bg-gray-800 transition"
        >
          Get Started
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>&copy; 2025 Travel Planner. All rights reserved.</p>
      </footer>
    </>
  );
};

export default HomePage;
