package com.excelr.project.travel.planner.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.excelr.project.travel.planner.entity.Role;
import com.excelr.project.travel.planner.entity.UserAccount;
import com.excelr.project.travel.planner.entity.UserRole;

import jakarta.transaction.Transactional;

//UserRole repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
	// Find all roles by UserAccount
	List<UserRole> findByUserAccount(UserAccount userAccount);

	// Find all UserRoles by Role
	List<UserRole> findByRole(Role role);
	@Transactional
	@Modifying
	@Query("DELETE FROM UserRole ur WHERE ur.userAccount = :userAccount")
	void deleteAllByUserAccount(@Param("userAccount") UserAccount userAccount);

}