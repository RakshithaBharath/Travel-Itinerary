package com.excelr.project.travel.planner.repository;

import com.excelr.project.travel.planner.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByUser_UserId(Long userId);
}