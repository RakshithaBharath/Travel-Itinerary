package com.excelr.project.travel.planner.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "UserAccount")
public class UserAccount  {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "useraccount_seq_gen")
	@SequenceGenerator(name = "useraccount_seq_gen", sequenceName = "useraccount_seq", allocationSize = 1)
	@Column(name = "user_id")
	private long userId;

	@Column(nullable = false, length = 100)
	private String name;

	@Column(nullable = false, unique = true, length = 150)
	private String email;
	
	@Column(length = 20)
	private String phone;

	@Column(length = 10)
	private String sex;

	@Column(name = "preferred_currency", length = 10)
	private String preferredCurrency;

	@Column(name = "preferred_language", length = 10)
	private String preferredLanguage;

	@Column(name = "travel_frequent")
	private Boolean travelFrequent = false;

	@Column(name = "default_location", length = 100)
	private String defaultLocation;

	@Column(name = "profile_picture", length = 255)
	private String profilePicture;

	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

}
