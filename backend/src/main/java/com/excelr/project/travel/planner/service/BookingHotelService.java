package com.excelr.project.travel.planner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.excelr.project.travel.planner.dto.BookingRequestDTO;
import com.excelr.project.travel.planner.dto.Hotel;
import com.excelr.project.travel.planner.dto.HotelResponseDTO;
import com.excelr.project.travel.planner.entity.BookingHotel;
import com.excelr.project.travel.planner.entity.Trip;
import com.excelr.project.travel.planner.entity.UserAccount;
import com.excelr.project.travel.planner.exception.UserException;
import com.excelr.project.travel.planner.repository.BookingHotelRepository;
import com.excelr.project.travel.planner.repository.UserAccountRepository;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class BookingHotelService {

    @Autowired
    private BookingHotelRepository bookingHotelRepository;
    
    @Autowired
    private UserAccountRepository accountRepository;

    @Autowired
    private JavaMailSender mailSender;

    public String bookHotel(BookingRequestDTO bookingRequest) {
        BookingHotel booking = new BookingHotel();

        booking.setHotelName(bookingRequest.getHotelName());
        booking.setCityCode(bookingRequest.getLocation());
        booking.setCheckIn(LocalDate.parse(bookingRequest.getCheckInDate()));
        booking.setCheckOut(LocalDate.parse(bookingRequest.getCheckOutDate()));
        booking.setRooms(bookingRequest.getRooms());
        booking.setSpecialRequests(bookingRequest.getSpecialRequests());
        booking.setBookingRef(generateBookingRef());
        booking.setPrice(bookingRequest.getPrice());
        booking.setCurrency(bookingRequest.getCurrency());

        UserAccount user = null;
		try {
			user = accountRepository.findById(bookingRequest.getUserId())
			        .orElseThrow(() -> new UserException("User not found with ID: " + bookingRequest.getUserId()));
		} catch (UserException e) {
			e.printStackTrace();
		}

        log.info("User found",user.getName());
        log.info("User Info",user.toString());

        booking.setUserAccount(user);

        
        log.info(bookingRequest.toString());
       
        log.info(booking.toString());
        bookingHotelRepository.save(booking);

        sendBookingConfirmationEmail(user.getEmail(), booking);

        return booking.getBookingRef();
    }

    private String generateBookingRef() {
        return "BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private void sendBookingConfirmationEmail(String toEmail, BookingHotel booking) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Booking Confirmation - " + booking.getBookingRef());
        message.setText("Dear Customer,\n\nYour booking is confirmed.\n\nDetails:\nHotel: " 
            + booking.getHotelName() 
            + "\nCheck-in: " + booking.getCheckIn() 
            + "\nCheck-out: " + booking.getCheckOut() 
            + "\nRooms: " + booking.getRooms()
            + "\nBooking Reference: " + booking.getBookingRef()
            + booking.getCurrency() + "\nPrice: "+booking.getPrice()
            + "\n\nThank you for booking with us!");

        mailSender.send(message);
    }
    
    public List<HotelResponseDTO> getHotelsByUserId(Long userId) {
    	List<BookingHotel> hotels = bookingHotelRepository.findByUserAccount_UserId(userId);

    	List<HotelResponseDTO> hotelDTOs = hotels.stream()
    	        .map(hotel -> {
    	            HotelResponseDTO h = new HotelResponseDTO();
    	            h.setId(hotel.getId().toString());
    	            h.setName(hotel.getHotelName());
    	            h.setCity(hotel.getCityCode());
    	            h.setPrice(hotel.getPrice());
    	            h.setCurrency(hotel.getCurrency());
    	            h.setCheckInDate(hotel.getCheckIn().toString());
    	            h.setCheckOutDate(hotel.getCheckOut().toString());
    	           
    	            return h;
    	        })
    	        .collect(Collectors.toList());
		return hotelDTOs;
    }
}
