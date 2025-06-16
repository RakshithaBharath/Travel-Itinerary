package com.excelr.project.travel.planner.dto;

import lombok.Data;

@Data
public class BookingRequestDTO {
	private String hotelName;
    private String location;
    private String imageUrl;
    private String checkInDate;
    private String checkOutDate;
    private int rooms;
    private String specialRequests;
	private long UserId;
	private long price;
	private String currency;

}
