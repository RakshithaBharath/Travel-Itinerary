package com.excelr.project.travel.planner.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TripGenerateResponse {
    private List<TripData> trips;


}
