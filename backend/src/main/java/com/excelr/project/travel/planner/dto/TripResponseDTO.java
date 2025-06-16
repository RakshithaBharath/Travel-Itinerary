package com.excelr.project.travel.planner.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripResponseDTO {
    private Long id;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private String notes;
    private int travelers;
    private BigDecimal budget;
    private String countryCode;
    private String language;
    private Long userId;
    private String currency;


    private List<TripDayResponseDTO> days;
}
