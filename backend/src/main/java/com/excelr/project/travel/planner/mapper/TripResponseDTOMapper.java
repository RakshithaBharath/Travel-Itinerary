package com.excelr.project.travel.planner.mapper;

import com.excelr.project.travel.planner.dto.TripDayResponseDTO;
import com.excelr.project.travel.planner.dto.TripLocationResponseDTO;
import com.excelr.project.travel.planner.dto.TripResponseDTO;
import com.excelr.project.travel.planner.entity.*;

import java.util.List;
import java.util.stream.Collectors;

public class TripResponseDTOMapper {

    public static TripResponseDTO map(Trip trip) {
        return TripResponseDTO.builder()
                .id(trip.getId())
                .title(trip.getTitle())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .notes(trip.getNotes())
                .travelers(trip.getTravelers())
                .budget(trip.getBudget())
                .countryCode(trip.getCountryCode())
                .currency(trip.getCurrency())
                .language(trip.getLanguage())
                .userId(trip.getUser() != null ? trip.getUser().getUserId() : null)
                .days(mapDays(trip.getDays()))
                .build();
    }

    private static List<TripDayResponseDTO> mapDays(List<Day> days) {
        if (days == null) return List.of();
        return days.stream().map(day ->
                TripDayResponseDTO.builder()
                        .id(day.getId())
                        .date(day.getDate())
                        .title(day.getTitle())
                        .notes(day.getNotes())
                        .transportMode(day.getTransportMode())
                        .meals(day.getMeals())
                        .costEstimate(day.getCostEstimate())
                        .locations(mapLocations(day.getLocations()))
                        .build()
        ).collect(Collectors.toList());
    }

    private static List<TripLocationResponseDTO> mapLocations(List<Location> locations) {
        if (locations == null) return List.of();
        return locations.stream().map(loc ->
                TripLocationResponseDTO.builder()
                        .id(loc.getId())
                        .name(loc.getName())
                        .latitude(loc.getLatitude())
                        .longitude(loc.getLongitude())
                        .visitDuration(loc.getVisitDuration())
                        .timeSlot(loc.getTimeSlot())
                        .priority(loc.getPriority())
                        .bookingInfo(loc.getBookingInfo())
                        .photosLinks(loc.getPhotosLinks())
                        .weatherCondition(loc.getWeatherCondition())
                        .temperature(loc.getTemperature())
                        .weatherIcon(loc.getWeatherIcon())
                        .weatherDatetime(loc.getWeatherDateTime())
                        .build()
        ).collect(Collectors.toList());
    }
}
