package com.excelr.project.travel.planner.flight.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)

public class Departure {
    private String iataCode;
    private String terminal;
    private String at;  // or LocalDateTime with proper Jackson config
}
