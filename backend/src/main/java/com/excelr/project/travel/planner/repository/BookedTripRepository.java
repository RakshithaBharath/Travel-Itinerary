package com.excelr.project.travel.planner.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.excelr.project.travel.planner.entity.BookedTrip;
import com.excelr.project.travel.planner.entity.UserAccount;

import java.util.List;

public interface BookedTripRepository extends JpaRepository<BookedTrip, Long> {
    List<BookedTrip> findByUserAccount(UserAccount userAccount);
}
