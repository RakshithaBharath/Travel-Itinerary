package com.excelr.project.travel.planner.service;

import com.excelr.project.travel.planner.dto.SendOtpResponse;
import com.excelr.project.travel.planner.dto.VerifyOtpRequest;

public interface IOtpService {
	public SendOtpResponse sendOtp(String email);
	public void verifyOtpAndResetPassword(VerifyOtpRequest request);

}
