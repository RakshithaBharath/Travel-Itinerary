package com.excelr.project.travel.planner.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SendOtpResponse {
	private String jwtToken;
    private String message;

}
