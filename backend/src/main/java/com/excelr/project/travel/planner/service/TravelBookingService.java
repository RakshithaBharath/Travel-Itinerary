package com.excelr.project.travel.planner.service;


import org.springframework.stereotype.Service;

import com.excelr.project.travel.planner.dto.DestinationDTO;
import com.excelr.project.travel.planner.dto.TravelBookingDTO;
import com.excelr.project.travel.planner.entity.Destination;
import com.excelr.project.travel.planner.entity.TravelBooking;
import com.excelr.project.travel.planner.entity.UserAccount;
import com.excelr.project.travel.planner.repository.DestinationRepository;
import com.excelr.project.travel.planner.repository.TravelBookingRepository;
import com.excelr.project.travel.planner.repository.UserAccountRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TravelBookingService {

    private final TravelBookingRepository bookingRepo;
    private final UserAccountRepository userRepo;
    private final DestinationRepository destinationRepo;

    public TravelBookingService(TravelBookingRepository bookingRepo, UserAccountRepository userRepo, DestinationRepository destinationRepo) {
        this.bookingRepo = bookingRepo;
        this.userRepo = userRepo;
        this.destinationRepo = destinationRepo;
    }

    public TravelBookingDTO bookDestination(Long userId, Long destinationId) {
        UserAccount user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Destination dest = destinationRepo.findById(destinationId).orElseThrow(() -> new RuntimeException("Destination not found"));

        TravelBooking booking = new TravelBooking();
        booking.setUser(user);
        booking.setDestination(dest);

        TravelBooking saved = bookingRepo.save(booking);

        TravelBookingDTO dto = new TravelBookingDTO();
        dto.setId(saved.getId());
        dto.setUserId(user.getUserId());
        dto.setDestinationId(dest.getId());
        dto.setBookingDate(saved.getBookingDate());

        return dto;
    }

    public List<DestinationDTO> getBookingsByUser(Long userId) {
        List<TravelBooking> bookings = bookingRepo.findByUser_UserId(userId);

        return bookings.stream()
            .map(TravelBooking::getDestination) // get the Destination entity from each booking
            .map(dest -> {
                DestinationDTO dto = new DestinationDTO();
                dto.setId(dest.getId());
                dto.setName(dest.getName());
                dto.setCountry(dest.getCountry());
                dto.setDescription(dest.getDescription());
                dto.setImageUrl(dest.getImageUrl());
                dto.setAvgPackagePriceInr(dest.getAvgPackagePriceInr());
                return dto;
            })
            .collect(Collectors.toList());
    }

}