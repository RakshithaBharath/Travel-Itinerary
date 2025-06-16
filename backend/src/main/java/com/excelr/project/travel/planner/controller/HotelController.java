package com.excelr.project.travel.planner.controller;

import com.excelr.project.travel.planner.dto.BookingRequestDTO;
import com.excelr.project.travel.planner.dto.BookingResponse;
import com.excelr.project.travel.planner.dto.ErrorResponse;
import com.excelr.project.travel.planner.dto.Hotel;
import com.excelr.project.travel.planner.dto.HotelResponseDTO;
import com.excelr.project.travel.planner.exception.TripException;
import com.excelr.project.travel.planner.exception.UserException;
import com.excelr.project.travel.planner.service.BookingHotelService;
import com.excelr.project.travel.planner.service.HotelService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/hotels")
public class HotelController {

	private final HotelService hotelService;

	private final BookingHotelService bookingHotelService;

	public HotelController(HotelService hotelService, BookingHotelService bookingHotelService) {
		this.hotelService = hotelService;
		this.bookingHotelService = bookingHotelService;
	}

	@GetMapping("/live-search")
	public ResponseEntity<List<Hotel>> liveSearch(@RequestParam String city, @RequestParam String checkInDate,
			@RequestParam String checkOutDate, @RequestParam Integer adults,
			@RequestParam(defaultValue = "USD") String currency, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {

		List<Hotel> hotels = hotelService.searchHotels(city, checkInDate, checkOutDate, adults, currency, page, size);
		return ResponseEntity.ok(hotels);
	}

	@PostMapping("/book")
	public ResponseEntity<?> bookHotel(@RequestBody BookingRequestDTO bookingRequest) throws UserException {
		try {
			String bookingRef = bookingHotelService.bookHotel(bookingRequest);
			return ResponseEntity.ok(new BookingResponse(bookingRef));
		} catch (Exception e) {
			// Unexpected errors
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse("Internal Server Error", "Something went wrong"));
		}
	}
	
	 @GetMapping("/user/{userId}")
	    public ResponseEntity<?> getHotelsByUserId(@PathVariable Long userId) {
	        try {
	            List<HotelResponseDTO> hotels = bookingHotelService.getHotelsByUserId(userId);
	            return ResponseEntity.ok(hotels);
	        } catch (TripException e) {
	            log.error("Fetching trips failed for user id {}: {}", userId, e.getMessage());
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
	        } catch (Exception e) {
	            log.error("Unexpected error during fetching trips", e);
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
	        }
	    }
}
