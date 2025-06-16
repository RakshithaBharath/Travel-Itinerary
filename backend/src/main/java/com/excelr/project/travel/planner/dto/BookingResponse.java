package com.excelr.project.travel.planner.dto;

import lombok.Data;

@Data
public class BookingResponse {
	 private String bookingRef;

	    public BookingResponse(String bookingRef) {
	        this.bookingRef = bookingRef;
	    }


}
