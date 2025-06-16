package com.excelr.project.travel.planner.dto;

import lombok.Data;

@Data
public class VerifyOtpRequest {
	private String email;
    private String otp;
    private String newPassword;
    private String jwtToken;

}
