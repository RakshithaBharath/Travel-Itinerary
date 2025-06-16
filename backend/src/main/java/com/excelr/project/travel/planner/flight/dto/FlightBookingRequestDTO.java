package com.excelr.project.travel.planner.flight.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class FlightBookingRequestDTO {
	
	 private Long userId;
	    private String airline;
	    private String departureCity;
	    private String arrivalCity;
	    private LocalDateTime departureTime;
	    private LocalDateTime arrivalTime;
	    private Integer passengers;
	    private Double price;


}
