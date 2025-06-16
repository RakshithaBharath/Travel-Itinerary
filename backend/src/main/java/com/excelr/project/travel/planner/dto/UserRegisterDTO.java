package com.excelr.project.travel.planner.dto;

import lombok.Data;

@Data
public class UserRegisterDTO {
	 private String name;
	    private String email;
	    private String phone;
	    private String sex;
	    private String password;
	    private String preferredCurrency;
	    private String preferredLanguage;
	    private String defaultLocation;

}
