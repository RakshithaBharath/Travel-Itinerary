package com.excelr.project.travel.planner.dto;

import lombok.Data;

@Data
public class LoginResponse {
	private String token;
	private String user;
	private long user_id;

}
