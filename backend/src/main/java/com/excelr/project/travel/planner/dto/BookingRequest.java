package com.excelr.project.travel.planner.dto;

import lombok.Data;

@Data
public class BookingRequest {
	private String hotelName;
	private long UserId;
    private String location;
    private String imageUrl;
    private String checkInDate;
    private String checkOutDate;
    private Integer rooms;
    private String specialRequests;
}
