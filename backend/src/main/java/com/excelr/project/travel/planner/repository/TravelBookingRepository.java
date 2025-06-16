package com.excelr.project.travel.planner.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.excelr.project.travel.planner.entity.TravelBooking;

public interface TravelBookingRepository extends JpaRepository<TravelBooking, Long> {
	List<TravelBooking> findByUser_UserId(Long userId);

}
