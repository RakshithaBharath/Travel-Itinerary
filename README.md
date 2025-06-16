Travel Itinerary Planner - Project Documentation

1. Title - Travel Itinerary Planner
2. Description
2.1 Overview
Travel Itinerary Planner is a comprehensive full-stack web application designed to help users plan their travel seamlessly. The platform enables users to search for flights and hotels, book them securely, explore destinations, and organize them into personalized itineraries. With features like authentication, user profile management, cloud storage integration for profile pictures, and OAuth2-based login, the platform ensures a modern, reliable, and user-friendly experience.

2.2 Key Features
•	User Registration and Login 
•	Flight Search & Booking
•	Hotel Search & Booking
•	Destination Exploration with recommendations
•	Itinerary Creation & Management 

4. Detailed Module-wise Features
3.1 User Management
Feature	Description
User Registration	Users can register with name, email, password, phone, gender, etc.
JWT Authentication	Token-based authentication to access secured endpoints


3.2 Flight Booking Module
Feature	Description
Flight Search	Users can search for flights by providing Origin, Destination, Departure Date, and Number of Passengers
Flight Booking	Allows booking of selected flights with passenger details
View Booked Flights	Users can view a list of their booked flights

3.3 Hotel Booking Module
Feature	Description
Hotel Search	Search for hotels based on destination and dates
Hotel Details	View hotel pricing, amenities, and booking availability
Hotel Booking	Book selected hotel rooms for desired dates
Booking Confirmation	Generates booking confirmation reference

3.4 Destination Exploration
Feature	Description
Explore Destinations	View Places to visit based on interest and location 
View Destination Info and Book	View images, brief description, and best visiting times for each place and Book the Destination Trip

3.5 Itinerary Planner
Feature	Description
Create Trip	Users can create and name a trip itinerary
Add Items	Add flights, hotel bookings, and destination places to specific days
Edit/Remove Items	Modify or delete items from the itinerary


3.7 Technologies Used
Layer	Technologies
Frontend	React, Tailwind CSS, Axios
Backend	Spring Boot, Hibernate, REST APIs
Database	Oracle
Authentication	JWT
________________________________________
4. Architecture Overview
4.1 High-Level Architecture
•	Frontend (React)
•	Backend (Spring Boot REST APIs)
•	Database (Oracle)
•	Authentication (JWT + OAuth2)
________________________________________
5. Database Schema (ER Diagram)
5.1 Entities
•	UserAccount 
•	UserAuth 
•	FlightBooking 
•	HotelBooking 
•	Destination 
•	Itinerary – Day Wise and Location Wise Table
________________________________________
6. API Endpoints Summary
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login (JWT)
GET	/api/flights/live-search	Search available flights
POST	/api/flights/book	Book a selected flight
GET	/api/flights/user/{userId}	Get user's booked flights
GET	/api/hotels/search	Search for hotels
POST	/api/hotels/book	Book a selected hotel
GET	/api/destinations/search	Search for destinations
POST	/api/ destinations /book	Book a selected destinations
GET	/api/ destinations /user/{userId}	Get user's booked destinations
POST	/api/itinerary/create	Create itinerary
GET	/api/itinerary/user/{id}	View itineraries by user
________________________________________
7. Future Enhancements
•	Payment Integration (Stripe/PayPal)
•	Role Wise Authentication
•	Profile Photo upload
•	Google/Facebook login authentication
•	Collaborative Trip Planning with friends
•	AI-powered Destination Recommendations
•	PDF Export for Itinerary
________________________________________
8. Conclusion
The Travel Itinerary Planner offers a complete travel planning solution, providing secure booking, profile management, destination exploration, and personalized itineraries in one application. Built with a modern tech stack, this platform is designed to scale, evolve, and serve a wide range of travel enthusiasts.
