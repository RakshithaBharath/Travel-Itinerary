package com.excelr.project.travel.planner.flight.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true) // add this too, just in case other unknown fields appear
public class FlightOffer {

	private String type;
    private String id;
    private List<Itinerary> itineraries;
    private Price price;
    private String source;  // add this field

}
