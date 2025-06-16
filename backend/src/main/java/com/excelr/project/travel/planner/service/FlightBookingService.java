package com.excelr.project.travel.planner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


import com.excelr.project.travel.planner.entity.FlightBooking;
import com.excelr.project.travel.planner.entity.UserAccount;
import com.excelr.project.travel.planner.exception.UserException;
import com.excelr.project.travel.planner.flight.dto.FlightBookingRequestDTO;
import com.excelr.project.travel.planner.repository.FlightBookingRepository;
import com.excelr.project.travel.planner.repository.UserAccountRepository;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class FlightBookingService {

	@Autowired
	private FlightBookingRepository flightBookingRepository;

	@Autowired
	private UserAccountRepository accountRepository;

	@Autowired
	private JavaMailSender mailSender;

	public String bookFlight(FlightBookingRequestDTO bookingRequest) {
		FlightBooking booking = new FlightBooking();

		// Set booking details from DTO (assumed you have these fields)
		booking.setAirline(bookingRequest.getAirline());
		booking.setOrigin(bookingRequest.getDepartureCity());
		booking.setDestination(bookingRequest.getArrivalCity());
		booking.setDepartureDate(bookingRequest.getDepartureTime()); // might need to convert string to LocalDateTime
		booking.setPassengers(bookingRequest.getPassengers());
		booking.setPrice(bookingRequest.getPrice());
		booking.setBookingStatus(generateBookingRef());
		booking.setBookedAt(LocalDateTime.now());

		UserAccount user = null;
		try {
			user = accountRepository.findById(bookingRequest.getUserId())
					.orElseThrow(() -> new UserException("User not found with ID: " + bookingRequest.getUserId()));
		} catch (UserException e) {
			e.printStackTrace();
		}

		log.info("User found: {}", user.getName());
		booking.setUserAccount(user);

		log.info("Flight booking request: {}", bookingRequest.toString());
		log.info("Flight booking entity: {}", booking.toString());

		flightBookingRepository.save(booking);

		sendBookingConfirmationEmail(user.getEmail(), booking);

		return booking.getBookingStatus();
	}

	private String generateBookingRef() {
		return "FL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
	}

	private void sendBookingConfirmationEmail(String toEmail, FlightBooking booking) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(toEmail);
		message.setSubject("Flight Booking Confirmation - " + booking.getBookingStatus());
		message.setText("Dear Customer,\n\nYour flight booking is confirmed.\n\nDetails:\nAirline: "
				+ booking.getAirline() + "\nFrom: " + booking.getOrigin() + "\nTo: " + booking.getDestination()
				+ "\nDeparture Time: " + booking.getDepartureDate() + "\nPassengers: " + booking.getPassengers()
				+ "\nBooking Reference: " + booking.getBookingStatus() + "\nPrice in USD: " + booking.getPrice() + " "
				+ booking.getPrice() + "\n\nThank you for booking with us!");

		mailSender.send(message);
	}

	public List<FlightBookingRequestDTO> getFlightDetailsByUserId(Long userId) {
		List<FlightBooking> flights = flightBookingRepository.findByUserAccount_UserId(userId);
		List<FlightBookingRequestDTO> flightDTOs = flights.stream().map(flight -> {
			FlightBookingRequestDTO flightDTO = new FlightBookingRequestDTO();
			flightDTO.setAirline(flight.getAirline());
			flightDTO.setDepartureCity(flight.getOrigin());
			flightDTO.setArrivalCity(flight.getDestination());
			flightDTO.setPassengers(flight.getPassengers());
			flightDTO.setPrice(flight.getPrice());
			flightDTO.setArrivalTime(flight.getDepartureDate());

			return flightDTO;
		}).collect(Collectors.toList());

		return flightDTOs;

	}
}
