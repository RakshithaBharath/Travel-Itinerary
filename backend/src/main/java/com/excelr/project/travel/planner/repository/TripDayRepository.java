package com.excelr.project.travel.planner.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.excelr.project.travel.planner.entity.Day;

public interface TripDayRepository extends JpaRepository<Day, Long> {
}