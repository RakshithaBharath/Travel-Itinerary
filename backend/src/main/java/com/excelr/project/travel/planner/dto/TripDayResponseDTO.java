package com.excelr.project.travel.planner.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripDayResponseDTO {
    private Long id;
    private LocalDate date;
    private String title;
    private String notes;
    private String transportMode;
    private String meals;
    private BigDecimal costEstimate;

    private List<TripLocationResponseDTO> locations;
}