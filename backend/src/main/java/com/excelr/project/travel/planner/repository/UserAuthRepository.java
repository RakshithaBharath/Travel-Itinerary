package com.excelr.project.travel.planner.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.excelr.project.travel.planner.entity.UserAccount;
import com.excelr.project.travel.planner.entity.UserAuth;

import jakarta.transaction.Transactional;

//UserAuth repository
public interface UserAuthRepository extends JpaRepository<UserAuth, Long> {
	Optional<UserAuth> findByProviderAndProviderUserId(String provider, String providerUserId);

	Optional<UserAuth> findByUserAccount(UserAccount userAccount);
	
	@Transactional
	@Modifying
	@Query("DELETE FROM UserRole ur WHERE ur.userAccount = :userAccount")
	void deleteAllByUserAccount(@Param("userAccount") UserAccount userAccount);

}

