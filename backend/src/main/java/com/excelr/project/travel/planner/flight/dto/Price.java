package com.excelr.project.travel.planner.flight.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Price {
    @JsonProperty("currencyCode")
    private String currency;
    private String total;

}
