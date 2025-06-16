package com.excelr.project.travel.planner.dto;

import lombok.Data;

@Data
public class Hotel {

	private String id;
    private String name;
    private String city;
    private double price;
    private String currency;
    private String imageUrl;
    private String affiliateLink;
    private int rating;
}
