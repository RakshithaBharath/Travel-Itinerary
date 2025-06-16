package com.excelr.project.travel.planner.dto;

import lombok.Data;

@Data
public class HotelResponseDTO {
	private String id;
    private String name;
    private String city;
    private double price;
    private String currency;
    private String checkInDate;
    private String checkOutDate;
}
