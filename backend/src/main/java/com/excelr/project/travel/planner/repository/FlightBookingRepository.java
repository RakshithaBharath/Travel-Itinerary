package com.excelr.project.travel.planner.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.excelr.project.travel.planner.entity.BookingHotel;
import com.excelr.project.travel.planner.entity.FlightBooking;
import com.excelr.project.travel.planner.entity.Trip;
import com.excelr.project.travel.planner.entity.UserAccount;

public interface FlightBookingRepository extends JpaRepository<FlightBooking, Long>{
	List<FlightBooking> findByUserAccount_UserId(Long userId);





}
