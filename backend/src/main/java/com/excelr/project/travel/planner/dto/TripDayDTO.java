package com.excelr.project.travel.planner.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class TripDayDTO {
    private LocalDate date;
    private String title;
    private String notes;
    private String transportMode;
    private String meals;
    private BigDecimal costEstimate;
    private List<TripLocationDTO> locations;
}
