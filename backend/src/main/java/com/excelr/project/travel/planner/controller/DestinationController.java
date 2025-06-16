package com.excelr.project.travel.planner.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.excelr.project.travel.planner.dto.DestinationDTO;
import com.excelr.project.travel.planner.dto.TravelBookingDTO;
import com.excelr.project.travel.planner.service.DestinationService;
import com.excelr.project.travel.planner.service.TravelBookingService;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

	@Autowired
    private  DestinationService destinationService;
    
	@Autowired
    private TravelBookingService bookingService;

    // Example: GET /api/destinations?page=0&size=5
    @GetMapping
    public ResponseEntity<List<DestinationDTO>> getDestinations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        List<DestinationDTO> destinations = destinationService.getDestinations(page, size);
        return ResponseEntity.ok(destinations);
    }
   

    @PostMapping("/book")
    public ResponseEntity<TravelBookingDTO> bookDestination(@RequestParam Long userId, @RequestParam Long destinationId) {
        TravelBookingDTO booking = bookingService.bookDestination(userId, destinationId);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DestinationDTO>> getUserBookings(@PathVariable Long userId) {
        List<DestinationDTO> bookings = bookingService.getBookingsByUser(userId);
        return ResponseEntity.ok(bookings);
    }
}
