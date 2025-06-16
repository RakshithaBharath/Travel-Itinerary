import React, { useState, useEffect, useRef } from "react";
import Login from "./Login";
import "./Main.css";

const Main = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentUser = localStorage.getItem("username");
  const videoRef = useRef(null);

  const videoList = [
    "https://videos.pexels.com/video-files/5868771/5868771-uhd_2560_1440_30fps.mp4",
  ];

  const handleVideoEnd = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videoList.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Autoplay failed:", error);
        });
      }
    }
  }, [currentIndex]);

  return (
    <div className="main">
      <video
        key={currentIndex} // Helps React reload the video
        className="background-video"
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        preload="auto"
      >
        <source src={videoList[currentIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="hero-heading">
        <h1>
          Travel Smarter & <span>Not Harder</span>
        </h1>
        <p className="par">
          Hi {currentUser || "Guest"}, Turn your travel dreams into reality by
          effortlessly organizing every detail in one place.
        </p>
        {!currentUser && (
          <button className="login-button" onClick={() => setShowLogin(true)}>
            Login to get started
          </button>
        )}
      </div>

      {showLogin && (
        <Login
          onLogin={() => setShowLogin(false)}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  );
};

export default Main;
