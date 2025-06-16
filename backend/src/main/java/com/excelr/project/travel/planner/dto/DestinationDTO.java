package com.excelr.project.travel.planner.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class DestinationDTO {
	 private Long id;
	    private String name;
	    private String country;
	    private String description;
	    private String imageUrl;
	    private BigDecimal avgPackagePriceInr;

}
