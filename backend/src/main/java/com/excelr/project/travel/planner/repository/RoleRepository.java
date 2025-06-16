package com.excelr.project.travel.planner.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.excelr.project.travel.planner.entity.Role;

//Role repository
public interface RoleRepository extends JpaRepository<Role, Long> {
	Optional<Role> findByRoleName(String roleName);
}

