package com.excelr.project.travel.planner.repository;

import com.excelr.project.travel.planner.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripLocationRepository extends JpaRepository<Location, Long> {
}
