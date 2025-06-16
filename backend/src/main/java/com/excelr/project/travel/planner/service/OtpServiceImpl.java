package com.excelr.project.travel.planner.service;

import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.excelr.project.travel.planner.config.EmailService;
import com.excelr.project.travel.planner.dto.SendOtpResponse;
import com.excelr.project.travel.planner.dto.VerifyOtpRequest;
import com.excelr.project.travel.planner.entity.UserAccount;
import com.excelr.project.travel.planner.entity.UserAuth;
import com.excelr.project.travel.planner.repository.UserAccountRepository;
import com.excelr.project.travel.planner.repository.UserAuthRepository;
import com.excelr.project.travel.planner.security.JwtTokenUtil;

import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class OtpServiceImpl implements IOtpService {
	
	@Autowired
    private EmailService emailService;

    @Autowired
    private JwtTokenUtil jwtUtil;

    @Autowired
    private UserAccountRepository userRepository;
    
    @Autowired
    private UserAuthRepository userAuthRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public SendOtpResponse sendOtp(String email) {
        Optional<UserAccount> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
       log.info(otp);
        emailService.sendOtpEmail(email, otp);
        String jwtToken = jwtUtil.generateOtpToken(email, otp);

        return new SendOtpResponse(jwtToken, "OTP sent to email");
    }

    public void verifyOtpAndResetPassword(VerifyOtpRequest request) {
        Claims claims = jwtUtil.extractAllClaims(request.getJwtToken());
        String tokenOtp = claims.get("otp", String.class);
        String tokenEmail = claims.getSubject();

        if (!tokenEmail.equals(request.getEmail()) || !tokenOtp.equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP or Email");
        }

        UserAccount user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        
        UserAuth userAuth = userAuthRepository.findByUserAccount(user)
                .orElseThrow(() -> new RuntimeException("User not found"));

            // 🔐 Securely encode new password
            userAuth.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));

            userAuthRepository.save(userAuth); // Save updated password

    }


}
