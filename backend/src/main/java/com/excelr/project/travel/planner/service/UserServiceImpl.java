package com.excelr.project.travel.planner.service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.excelr.project.travel.planner.config.EmailService;
import com.excelr.project.travel.planner.dto.ChangePasswordDTO;
import com.excelr.project.travel.planner.dto.EditUserDTO;
import com.excelr.project.travel.planner.dto.LoginResponse;
import com.excelr.project.travel.planner.dto.UserDTO;
import com.excelr.project.travel.planner.dto.UserLoginDTO;
import com.excelr.project.travel.planner.dto.UserRegisterDTO;
import com.excelr.project.travel.planner.entity.Role;
import com.excelr.project.travel.planner.entity.UserAccount;
import com.excelr.project.travel.planner.entity.UserAuth;
import com.excelr.project.travel.planner.entity.UserRole;
import com.excelr.project.travel.planner.enums.OtpPurpose;
import com.excelr.project.travel.planner.exception.UserException;
import com.excelr.project.travel.planner.repository.RoleRepository;
import com.excelr.project.travel.planner.repository.UserAccountRepository;
import com.excelr.project.travel.planner.repository.UserAuthRepository;
import com.excelr.project.travel.planner.repository.UserRoleRepository;
import com.excelr.project.travel.planner.security.JwtTokenUtil;
import com.excelr.project.travel.planner.util.OtpHolder;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserServiceImpl implements IUserService {

	@Autowired
	private UserAccountRepository userAccountRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private UserAuthRepository userAuthRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private Cloudinary cloudinary;

	@Autowired
	private EmailService emailService;

	private final Map<String, OtpHolder> otpStorage = new ConcurrentHashMap<>();

	private final long OTP_VALIDITY_MILLIS = 5 * 60 * 1000; // 5 minutes

	public UserDTO register(UserRegisterDTO request) throws UserException {

		log.info("Inside Service Class - Register");
		if (userAccountRepository.findByEmail(request.getEmail()).isPresent()) {
			log.info("Checking if Email already Exists and throwing error");
			throw new UserException("Email already registered");
		}

		UserAccount userAccount = new UserAccount();
		userAccount.setName(request.getName());
		userAccount.setEmail(request.getEmail());
		userAccount.setPhone(request.getPhone());
		userAccount.setSex(request.getSex());
		userAccount.setPreferredCurrency(request.getPreferredCurrency());
		userAccount.setPreferredLanguage(request.getPreferredLanguage());
		userAccount.setDefaultLocation(request.getDefaultLocation());

		// Save user to get ID generated
		log.info("Saving Details into Repo");
		userAccount = userAccountRepository.save(userAccount);

		// Create UserAuth for local provider
		UserAuth userAuth = new UserAuth();
		userAuth.setUserAccount(userAccount);
		userAuth.setProvider("local");

		// Encode password
		userAuth.setPasswordHash(passwordEncoder.encode(request.getPassword()));
		userAuth.setProviderUserId(userAccount.getEmail()); // or some unique identifier

		userAuthRepository.save(userAuth);

		// Assign default role USER
		Role userRole = roleRepository.findByRoleName("USER")
				.orElseThrow(() -> new UserException("Default role USER not found"));

		// 3. Create UserRole linking user and role
		UserRole userRoleLink = new UserRole();
		userRoleLink.setUserAccount(userAccount);
		userRoleLink.setRole(userRole);

		// 4. Save UserRole
		userRoleRepository.save(userRoleLink);
		;

		// userAccountRepository.save(userAccount); // save updated roles

		log.info("Registering user: " + request.getEmail());
		log.info("Encoded password being saved: " + passwordEncoder.encode(request.getPassword()));
		// 5. Convert entity to DTO and return
		return convertToDTO(userAccount);

	}

	@Override
	public LoginResponse login(UserLoginDTO request) throws UserException {
		// TODO Auto-generated method stub
		UserAccount user = userAccountRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new UserException("Invalid email or password"));

		UserAuth userAuth = userAuthRepository.findByUserAccount(user)
				.orElseThrow(() -> new UserException("Authentication data not found"));

		if (!passwordEncoder.matches(request.getPassword(), userAuth.getPasswordHash())) {
			throw new UserException("Invalid email or password");
		}

		// Generate and return JWT token
		LoginResponse loginResponse = new LoginResponse();
		loginResponse.setToken(jwtTokenUtil.generateToken(user.getEmail()));
		loginResponse.setUser(user.getName());
		loginResponse.setUser_id(user.getUserId());
		
		log.info(loginResponse.getUser());
		return loginResponse; 
		 
	}

	@Override
	public UserDTO getUserById(Long userId) throws UserException {
		// TODO Auto-generated method stub
		log.info("Get User By Id- Inside Service Class");
		UserAccount user = userAccountRepository.findById(userId)
				.orElseThrow(() -> new UserException("User not found with ID: " + userId));
		return convertToDTO(user);
	}

	@Override
	public UserDTO editUser(Long userId, EditUserDTO request) throws UserException {
		// TODO Auto-generated method stub
		log.info("Edit User- Inside Service Class");
		UserAccount user = userAccountRepository.findById(userId)
				.orElseThrow(() -> new UserException("User not found"));

		if (request.getName() != null)
			user.setName(request.getName());
		if (request.getPhone() != null)
			user.setPhone(request.getPhone());
		if (request.getPreferredCurrency() != null)
			user.setPreferredCurrency(request.getPreferredCurrency());
		if (request.getPreferredLanguage() != null)
			user.setPreferredLanguage(request.getPreferredLanguage());
		if (request.getDefaultLocation() != null)
			user.setDefaultLocation(request.getDefaultLocation());

		user = userAccountRepository.save(user);
		return convertToDTO(user);
	}

	@Override
	public void changePassword(Long userId, ChangePasswordDTO request) throws UserException {
		// TODO Auto-generated method stub
		UserAccount user = userAccountRepository.findById(userId)
				.orElseThrow(() -> new UserException("User not found"));

		UserAuth userAuth = userAuthRepository.findByUserAccount(user)
				.orElseThrow(() -> new UserException("Authentication data not found"));

		log.info("Raw password: " + request.getOldPassword());
		log.info("Encoded password: " + userAuth.getPasswordHash());
		log.info("Matches: " + passwordEncoder.matches(request.getOldPassword(), userAuth.getPasswordHash()));
		log.info(userAuth.getPasswordHash());

		if (!passwordEncoder.matches(request.getOldPassword(), userAuth.getPasswordHash())) {
			throw new UserException("Old password is incorrect");
		}

		userAuth.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
		userAuthRepository.save(userAuth);

	}

	@Override
	public void deactivateUser(Long userId) throws UserException {
		// TODO Auto-generated method stub
		Optional<UserAccount> userOptional = userAccountRepository.findById(userId);

		if (!userOptional.isPresent()) {
			throw new UserException("User not found");
		}

		UserAccount user = userOptional.get();
		log.info(user.getName());
		//  Delete user account
		//userAccountRepository.delete(user);
	}

	@Override
	public String uploadProfilePicture(Long userId, MultipartFile file) throws UserException {
		// TODO Auto-generated method stub
		UserAccount user = userAccountRepository.findById(userId)
				.orElseThrow(() -> new UserException("User not found"));

		try {
			var uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
			String url = uploadResult.get("secure_url").toString();
			user.setProfilePicture(url);
			userAccountRepository.save(user);
			return url;
		} catch (Exception e) {
			log.error("Error uploading profile picture", e);
			throw new UserException("Failed to upload profile picture");
		}
	}

	@Override
	public void sendOtp(String email, OtpPurpose purpose) throws UserException {
		// TODO Auto-generated method stub
		log.info("Sending OTP to {} for purpose {}", email, purpose);

		// Generate 6-digit OTP
		String otp = String.format("%06d", (int) (Math.random() * 1000000));

		// Store OTP with purpose and timestamp
		otpStorage.put(email, new OtpHolder(otp, purpose));

		// Send OTP via email (or SMS if you integrate it)
		try {
			emailService.sendOtpEmail(email, otp);
			log.info("OTP sent to {}", email);
		} catch (Exception e) {
			log.error("Failed to send OTP: {}", e.getMessage());
			throw new UserException("Failed to send OTP. Please try again.");
		}
	}

	@Override
	public boolean verifyOtp(String email, String otpCode, OtpPurpose purpose) throws UserException {
		// TODO Auto-generated method stub
		log.info("Verifying OTP {} for {} and purpose {}", otpCode, email, purpose);

		OtpHolder holder = otpStorage.get(email);

		if (holder == null) {
			throw new UserException("No OTP found for this email/phone");
		}

		long currentTime = System.currentTimeMillis();
		if (!holder.getOtp().equals(otpCode)) {
			throw new UserException("Invalid OTP");
		}

		if (holder.getPurpose() != purpose) {
			throw new UserException("OTP purpose mismatch");
		}

		if (currentTime - holder.getTimestamp() > OTP_VALIDITY_MILLIS) {
			otpStorage.remove(email);
			throw new UserException("OTP expired");
		}

		otpStorage.remove(email); // OTP used
		return true;
	}

	@Override
	public void resetPasswordWithOtp(String email, String newPassword) throws UserException {
		// TODO Auto-generated method stub
		UserAccount user = userAccountRepository.findByEmail(email)
				.orElseThrow(() -> new UserException("User not found"));

		UserAuth userAuth = userAuthRepository.findByUserAccount(user)
				.orElseThrow(() -> new UserException("Authentication data not found"));

		userAuth.setPasswordHash(passwordEncoder.encode(newPassword));
		userAuthRepository.save(userAuth);
	}

	private UserDTO convertToDTO(UserAccount user) {
		UserDTO dto = new UserDTO();
		dto.setId(user.getUserId());
		dto.setName(user.getName());
		dto.setEmail(user.getEmail());
		dto.setPhone(user.getPhone());
		dto.setSex(user.getSex());
		dto.setPreferredCurrency(user.getPreferredCurrency());
		dto.setPreferredLanguage(user.getPreferredLanguage());
		dto.setDefaultLocation(user.getDefaultLocation());
		return dto;
	}

}
