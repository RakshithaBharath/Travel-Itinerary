package com.excelr.project.travel.planner.flight.dto;

import lombok.Data;

@Data
public class Arrival {
    private String iataCode;
    private String terminal;
    private String at;
}
