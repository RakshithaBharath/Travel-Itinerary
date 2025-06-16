package com.excelr.project.travel.planner.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.excelr.project.travel.planner.entity.UserAccount;

import java.util.Optional;

// UserAccount repository
public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
	Optional<UserAccount> findByEmail(String email);
}
