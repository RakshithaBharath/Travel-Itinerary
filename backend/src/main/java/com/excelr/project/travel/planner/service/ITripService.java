package com.excelr.project.travel.planner.service;

import java.util.List;

import com.excelr.project.travel.planner.dto.TripCreateRequestDTO;
import com.excelr.project.travel.planner.entity.Trip;
import com.excelr.project.travel.planner.exception.UserException;

public interface ITripService {
	Trip createItinerary(TripCreateRequestDTO requestDTO) throws UserException;
    Trip updateItinerary(Long tripId, TripCreateRequestDTO requestDTO);
    void deleteItinerary(Long tripId);
    List<Trip> getTripsByUserId(Long userId);

}
