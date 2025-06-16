package com.excelr.project.travel.planner.dto;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripLocationResponseDTO {
    private Long id;
    private String name;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String visitDuration;
    private String timeSlot;
    private Boolean priority;
    private String bookingInfo;
    private String photosLinks;

    private String weatherCondition;
    private BigDecimal temperature;
    private String weatherIcon;
    private LocalDateTime weatherDatetime;
}