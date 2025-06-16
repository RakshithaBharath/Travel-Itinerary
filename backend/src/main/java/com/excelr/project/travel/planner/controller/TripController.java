package com.excelr.project.travel.planner.controller;

import com.excelr.project.travel.planner.dto.TripCreateRequestDTO;
import com.excelr.project.travel.planner.dto.TripResponseDTO;
import com.excelr.project.travel.planner.entity.Trip;
import com.excelr.project.travel.planner.exception.TripException;
import com.excelr.project.travel.planner.mapper.TripResponseDTOMapper;
import com.excelr.project.travel.planner.service.ITripService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
@Slf4j
public class TripController {

    private final ITripService tripService;

    @PostMapping
    public ResponseEntity<?> createTrip(@Valid @RequestBody TripCreateRequestDTO requestDTO) {
        try {
            Trip trip = tripService.createItinerary(requestDTO);
            TripResponseDTO responseDTO = TripResponseDTOMapper.map(trip);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (TripException e) {
            log.error("Trip creation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during trip creation", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @PutMapping("/{tripId}")
    public ResponseEntity<?> updateTrip(@PathVariable Long tripId, @Valid @RequestBody TripCreateRequestDTO requestDTO) {
        try {
            Trip trip = tripService.updateItinerary(tripId, requestDTO);
            TripResponseDTO responseDTO = TripResponseDTOMapper.map(trip);
            return ResponseEntity.ok(responseDTO);
        } catch (TripException e) {
            log.error("Trip update failed for id {}: {}", tripId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during trip update", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<?> deleteTrip(@PathVariable Long tripId) {
        try {
            tripService.deleteItinerary(tripId);
            return ResponseEntity.ok("Trip deleted successfully.");
        } catch (TripException e) {
            log.error("Trip deletion failed for id {}: {}", tripId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during trip deletion", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getTripsByUserId(@PathVariable Long userId) {
        try {
            List<Trip> trips = tripService.getTripsByUserId(userId);
            List<TripResponseDTO> responseDTOs = trips.stream()
                    .map(TripResponseDTOMapper::map)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responseDTOs);
        } catch (TripException e) {
            log.error("Fetching trips failed for user id {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during fetching trips", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }
}