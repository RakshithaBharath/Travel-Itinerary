package com.excelr.project.travel.planner.service;

import org.springframework.web.multipart.MultipartFile;

import com.excelr.project.travel.planner.dto.ChangePasswordDTO;
import com.excelr.project.travel.planner.dto.EditUserDTO;
import com.excelr.project.travel.planner.dto.LoginResponse;
import com.excelr.project.travel.planner.dto.UserDTO;
import com.excelr.project.travel.planner.dto.UserLoginDTO;
import com.excelr.project.travel.planner.dto.UserRegisterDTO;
import com.excelr.project.travel.planner.enums.OtpPurpose;
import com.excelr.project.travel.planner.exception.UserException;

public interface IUserService {

	//Register User and return UserDTO
	UserDTO register(UserRegisterDTO request) throws UserException;

	// User login, returns JWT token
	LoginResponse login(UserLoginDTO request) throws UserException;

	// Fetch user details by userId
	UserDTO getUserById(Long userId) throws UserException;

	// Edit user details (name, phone, preferredCurrency, etc.)
	UserDTO editUser(Long userId, EditUserDTO request) throws UserException;

	// Change user password (requires old password confirmation)
	void changePassword(Long userId, ChangePasswordDTO request) throws UserException;

	// Deactivate user account (soft delete or status update)
	void deactivateUser(Long userId) throws UserException;

	// Upload or change profile picture (returns URL)
	String uploadProfilePicture(Long userId, MultipartFile file) throws UserException;

	// OTP-based authentication flows

	// Send OTP for given email/phone and purpose (e.g. RESET_PASSWORD)
	void sendOtp(String email, OtpPurpose purpose) throws UserException;

	// Verify OTP code sent to email/phone for the given purpose
	boolean verifyOtp(String email, String otpCode, OtpPurpose purpose) throws UserException;

	// Reset password after OTP verification
	void resetPasswordWithOtp(String email, String newPassword) throws UserException;
}
