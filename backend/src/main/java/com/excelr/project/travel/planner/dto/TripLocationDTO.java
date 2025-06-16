package com.excelr.project.travel.planner.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TripLocationDTO {
	private String name;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String visitDuration;
    private String timeSlot;
    private Boolean priority;
    private String bookingInfo;
    private String photosLinks;

    // Weather fields
    private String weatherCondition;
    private Double temperature;
    private String weatherIcon;
    private LocalDateTime weatherDatetime;
}
