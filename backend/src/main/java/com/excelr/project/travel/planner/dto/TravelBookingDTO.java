package com.excelr.project.travel.planner.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TravelBookingDTO {
	   private Long id;
	    private Long userId;
	    private Long destinationId;
	    private LocalDateTime bookingDate;

}
