package com.excelr.project.travel.planner.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.excelr.project.travel.planner.entity.BookingHotel;
import com.excelr.project.travel.planner.entity.Trip;
import com.excelr.project.travel.planner.entity.UserAccount;

@Repository
public interface BookingHotelRepository extends JpaRepository<BookingHotel, Long> {
	List<BookingHotel> findByUserAccount_UserId(Long userId);

}
