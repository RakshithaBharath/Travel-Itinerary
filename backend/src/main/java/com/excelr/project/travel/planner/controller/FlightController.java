package com.excelr.project.travel.planner.controller;


import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.excelr.project.travel.planner.exception.TripException;
import com.excelr.project.travel.planner.flight.dto.FlightBookingRequestDTO;
import com.excelr.project.travel.planner.flight.dto.FlightInfo;
import com.excelr.project.travel.planner.service.FlightBookingService;
import com.excelr.project.travel.planner.service.FlightSearchService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightSearchService flightService;
    
    @Autowired
    private FlightBookingService flightbookingservice;

    // 1. Search flights using Travelpayouts API
    @GetMapping("/live-search")
    public ResponseEntity<List<FlightInfo>> getFlights(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam String departureDate,
            @RequestParam int passengers) {

        Map<String, Object> rawResponse = flightService.searchFlights(origin, destination, departureDate, passengers);

        List<FlightInfo> flights = flightService.parseFlightOffers(rawResponse);

        return ResponseEntity.ok(flights);
    }
    
    @PostMapping("/book")
    public ResponseEntity<String> bookFlight(@RequestBody FlightBookingRequestDTO bookingRequest) {
        System.out.println("Passengers received: " + bookingRequest.getPassengers());
        System.out.println(bookingRequest.toString());
        String bookingRef = flightbookingservice.bookFlight(bookingRequest);
        return ResponseEntity.ok("Booking successful! Reference: " + bookingRef);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getFlightsByUserId(@PathVariable Long userId) {
        try {
            List<FlightBookingRequestDTO> flights = flightbookingservice.getFlightDetailsByUserId(userId);
            return ResponseEntity.ok(flights);
        } catch (TripException e) {
            log.error("Fetching flights failed for user id {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during fetching flights:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }
  
}