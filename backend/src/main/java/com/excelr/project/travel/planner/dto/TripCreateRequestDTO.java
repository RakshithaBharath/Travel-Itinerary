package com.excelr.project.travel.planner.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class TripCreateRequestDTO {
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private String notes;
    private Integer travelers;
    private BigDecimal budget;
    private String countryCode;
    private String currency;
    private Long userId;  // optional: if set by backend session
    private String language;
    private List<TripDayDTO> days;
}
