package com.excelr.project.travel.planner.flight.dto;

import lombok.Data;

@Data
public class FlightInfo {
	  private String flightId;
	    private String carrierCode;
	    private String flightNumber;
	    private String departureAirport;
	    private String arrivalAirport;
	    private String departureTime;
	    private String arrivalTime;
	    private String duration;
	    private double price;
	    private String currency;

}
