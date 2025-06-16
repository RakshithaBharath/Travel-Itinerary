package com.excelr.project.travel.planner.flight.dto;

import lombok.Data;
import com.excelr.project.travel.planner.flight.dto.Arrival;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Segment {
    private Departure departure;
    private Arrival arrival;
    private String carrierCode;
    private String number;
    // other fields
}
