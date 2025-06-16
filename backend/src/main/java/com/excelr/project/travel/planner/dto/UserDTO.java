package com.excelr.project.travel.planner.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserDTO {

	private long id;

	@NotBlank(message = "Name is required")
	@Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
	private String name;

	@NotBlank(message = "Email is required")
	@Email(message = "Email should be valid")
	private String email;
	
	@NotBlank(message = "Password is required")
	private String password;

	@Pattern(regexp = "^\\+?[0-9]{7,15}$", message = "Phone number is invalid") // simple international format check
	private String phone;

	@Pattern(regexp = "Male|Female|Other", message = "Sex must be Male, Female, or Other")
	private String sex;

	private String provider;
	
	private String preferredCurrency;
	private String preferredLanguage;
	private String profilePicture;
	private int travelFrequent;
	private String defaultLocation;
}
