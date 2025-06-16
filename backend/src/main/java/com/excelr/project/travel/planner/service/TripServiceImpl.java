package com.excelr.project.travel.planner.service;

import com.excelr.project.travel.planner.dto.TripCreateRequestDTO;
import com.excelr.project.travel.planner.dto.TripDayDTO;
import com.excelr.project.travel.planner.dto.TripLocationDTO;
import com.excelr.project.travel.planner.entity.Day;
import com.excelr.project.travel.planner.entity.Location;
import com.excelr.project.travel.planner.entity.Trip;
import com.excelr.project.travel.planner.entity.UserAccount;
import com.excelr.project.travel.planner.exception.TripException;
import com.excelr.project.travel.planner.exception.UserException;
import com.excelr.project.travel.planner.repository.TripRepository;
import com.excelr.project.travel.planner.repository.UserAccountRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TripServiceImpl implements ITripService {

    private final UserAccountRepository userAccountRepository;
    private final TripRepository tripRepository;

    @Override
    @Transactional
    public Trip createItinerary(TripCreateRequestDTO requestDTO) throws UserException {
    	
        Trip trip = new Trip();
        trip.setTitle(requestDTO.getTitle());
        trip.setStartDate(requestDTO.getStartDate());
        trip.setEndDate(requestDTO.getEndDate());
        trip.setNotes(requestDTO.getNotes());
        trip.setTravelers(requestDTO.getTravelers());
        trip.setBudget(requestDTO.getBudget());
        trip.setCountryCode(requestDTO.getCountryCode());
        trip.setCurrency(requestDTO.getCurrency());
        trip.setLanguage(requestDTO.getLanguage());        

        UserAccount user = userAccountRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new UserException("User not found with ID: " + requestDTO.getUserId()));
        trip.setUser(user);

        log.info("User found",user.getName());
        
        // Step 1: Save Trip first and flush to get the ID in DB
        trip = tripRepository.save(trip);
        tripRepository.flush();
        log.info("Inserted Into Trip",trip.getId());
        
        List<Day> days = new ArrayList<>();

        for (TripDayDTO dayDTO : requestDTO.getDays()) {
            Day day = new Day();
            day.setTrip(trip); // ✅ Set foreign key
            day.setDate(dayDTO.getDate());
            day.setTitle(dayDTO.getTitle());
            day.setNotes(dayDTO.getNotes());
            day.setTransportMode(dayDTO.getTransportMode());
            day.setMeals(dayDTO.getMeals());
            day.setCostEstimate(dayDTO.getCostEstimate());

            List<Location> locations = new ArrayList<>();
            for (TripLocationDTO locDTO : dayDTO.getLocations()) {
                Location loc = new Location();
                loc.setDay(day); // ✅ Set FK
                loc.setName(locDTO.getName());
                loc.setLatitude(locDTO.getLatitude());
                loc.setLongitude(locDTO.getLongitude());
                loc.setVisitDuration(locDTO.getVisitDuration());
                loc.setTimeSlot(locDTO.getTimeSlot());
                loc.setPriority(Boolean.TRUE.equals(locDTO.getPriority()));
                loc.setBookingInfo(locDTO.getBookingInfo());
                loc.setPhotosLinks(locDTO.getPhotosLinks());
                locations.add(loc);
            }

            day.setLocations(locations);
            days.add(day);
        }

        trip.setDays(days); // ✅ link Days back to Trip

        // Step 2: Save the updated trip (now with valid Trip ID and linked days)
        return tripRepository.save(trip);
    }
    @Override
    public Trip updateItinerary(Long tripId, TripCreateRequestDTO requestDTO) {
        Trip existing = tripRepository.findById(tripId)
                .orElseThrow(() -> new TripException("Trip not found with ID: " + tripId));

        existing.getDays().clear();

        existing.setTitle(requestDTO.getTitle());
        existing.setStartDate(requestDTO.getStartDate());
        existing.setEndDate(requestDTO.getEndDate());
        existing.setNotes(requestDTO.getNotes());
        existing.setTravelers(requestDTO.getTravelers());
        existing.setBudget(requestDTO.getBudget());

        List<Day> days = new ArrayList<>();
        for (TripDayDTO dayDTO : requestDTO.getDays()) {
            Day day = new Day();
            day.setDate(dayDTO.getDate());
            day.setTitle(dayDTO.getTitle());
            day.setNotes(dayDTO.getNotes());
            day.setTransportMode(dayDTO.getTransportMode());
            day.setMeals(dayDTO.getMeals());
            day.setCostEstimate(dayDTO.getCostEstimate());
            day.setTrip(existing);

            List<Location> locations = new ArrayList<>();
            for (TripLocationDTO locDTO : dayDTO.getLocations()) {
                Location loc = new Location();
                loc.setName(locDTO.getName());
                loc.setLatitude(locDTO.getLatitude());
                loc.setLongitude(locDTO.getLongitude());
                loc.setVisitDuration(locDTO.getVisitDuration());
                loc.setTimeSlot(locDTO.getTimeSlot());
                loc.setPriority(Boolean.TRUE.equals(locDTO.getPriority()));
                loc.setBookingInfo(locDTO.getBookingInfo());
                loc.setPhotosLinks(locDTO.getPhotosLinks());
                loc.setDay(day);
                locations.add(loc);
            }

            day.setLocations(locations);
            days.add(day);
        }

        existing.setDays(days);
        return tripRepository.save(existing);
    }

    @Override
    public void deleteItinerary(Long tripId) {
        if (!tripRepository.existsById(tripId)) {
            throw new TripException("Trip not found with ID: " + tripId);
        }
        tripRepository.deleteById(tripId);
    }

    @Override
    public List<Trip> getTripsByUserId(Long userId) {
        return tripRepository.findByUser_UserId(userId);
    }
}
