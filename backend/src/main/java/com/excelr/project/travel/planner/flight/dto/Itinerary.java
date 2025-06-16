package com.excelr.project.travel.planner.flight.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)

public class Itinerary {
    private String duration;
    private List<Segment> segments;
}