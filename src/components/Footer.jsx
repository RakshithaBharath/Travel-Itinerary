import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="brand">
          <h2>Travel</h2>
          <p>Turning destinations into memories ✈️</p>
        </div>

        <div className="links">
          <h4>Company</h4>
          <ul>
            <li>
              <Link to="/about" className="hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-primary">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/support" className="text-gray-700 hover:text-blue-600">
                Support
              </Link>
            </li>
          </ul>
        </div>

        <div className="socials">
          <h4>Follow Us</h4>
          <div className="icons">
            <a href="https://www.facebook.com/login.php" target="_blank">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com/accounts/login/" target="_blank">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.instagram.com/accounts/login/" target="_blank">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.youtube.com/" target="_blank">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} TravelEase. Designed with ❤️ for
          explorers.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
