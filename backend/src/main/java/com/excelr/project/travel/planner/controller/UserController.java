package com.excelr.project.travel.planner.controller;

import com.excelr.project.travel.planner.dto.*;
import com.excelr.project.travel.planner.enums.OtpPurpose;
import com.excelr.project.travel.planner.exception.InvalidOtpException;
import com.excelr.project.travel.planner.exception.UserAuthNotFoundException;
import com.excelr.project.travel.planner.exception.UserException;
import com.excelr.project.travel.planner.exception.UserNotFoundException;
import com.excelr.project.travel.planner.service.IOtpService;
import com.excelr.project.travel.planner.service.IUserService;

import io.jsonwebtoken.JwtException;
import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/user")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private IUserService userService;
    
    @Autowired
    private IOtpService iOtpService;

    @PostMapping("/auth/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegisterDTO request) {
        try {
            UserDTO userDTO = userService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(userDTO);
        } catch (UserException e) {
            log.error("Registration failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e);
        } catch (Exception e) {
            log.error("Unexpected error during registration", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody UserLoginDTO request) {
        try {
            LoginResponse loginResponse = userService.login(request);
            return ResponseEntity.ok(loginResponse);
        } catch (UserException e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during login", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        try {
            UserDTO userDTO = userService.getUserById(userId);
            return ResponseEntity.ok(userDTO);
        } catch (UserException e) {
            log.error("Get user failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while fetching user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> editUser(@PathVariable Long userId, @Valid @RequestBody EditUserDTO request) {
        try {
            UserDTO updatedUser = userService.editUser(userId, request);
            return ResponseEntity.ok(updatedUser);
        } catch (UserException e) {
            log.error("Edit user failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while editing user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @PostMapping("/{userId}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable Long userId, @Valid @RequestBody ChangePasswordDTO request) {
        try {
            userService.changePassword(userId, request);
            return ResponseEntity.ok("Password changed successfully");
        } catch (UserException e) {
            log.error("Change password failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while changing password", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deactivateUser(@PathVariable Long userId) {
        try {
            userService.deactivateUser(userId);
            return ResponseEntity.ok("User deactivated successfully");
        } catch (UserException e) {
            log.error("Deactivate user failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while deactivating user", e.getStackTrace());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @PostMapping("/{userId}/profile-picture")
    public ResponseEntity<?> uploadProfilePicture(@PathVariable Long userId, @RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = userService.uploadProfilePicture(userId, file);
            return ResponseEntity.ok(imageUrl);
        } catch (UserException e) {
            log.error("Upload profile picture failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while uploading profile picture", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @PostMapping("/auth/send-otp")
    public ResponseEntity<SendOtpResponse> sendOtp(@RequestBody SentOTPRequest request) {
        log.info("Received OTP send request for email: {}", request.getEmail());
        try {
            SendOtpResponse response = iOtpService.sendOtp(request.getEmail());
            log.info("OTP sent successfully to email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (UserNotFoundException e) {
            log.warn("User not found for email: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new SendOtpResponse(null, "User not found with email: " + request.getEmail()));
        } catch (Exception e) {
            log.error("Error sending OTP to email: {}", request.getEmail(), e.getStackTrace());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new SendOtpResponse(null, "Failed to send OTP. Please try again."));
        }
    }

    @PostMapping("/auth/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody VerifyOtpRequest request) {
        log.info("Received OTP verification request for token: {}", request.getJwtToken());
        try {
        	iOtpService.verifyOtpAndResetPassword(request);
            log.info("Password reset successful.");
            return ResponseEntity.ok("Password reset successful");
        } catch (InvalidOtpException e) {
            log.warn("Invalid OTP entered for token: {}", request.getJwtToken(),e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired OTP.");
        } catch (JwtException e) {
            log.warn("Invalid JWT token: {}", request.getJwtToken());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        } catch (UserAuthNotFoundException e) {
            log.warn("UserAuth not found during OTP verification.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User authentication not found.");
        } catch (Exception e) {
            log.error("Unexpected error during password reset.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to reset password.");
        }
    }


    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPasswordWithOtp(@RequestParam String email, @RequestParam String newPassword) {
        try {
            userService.resetPasswordWithOtp(email, newPassword);
            return ResponseEntity.ok("Password reset successfully");
        } catch (UserException e) {
            log.error("Reset password failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while resetting password", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }
}
