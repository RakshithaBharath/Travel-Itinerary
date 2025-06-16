package com.excelr.project.travel.planner.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.excelr.project.travel.planner.entity.ExternalProvider;

//ExternalProvider repository
public interface ExternalProviderRepository extends JpaRepository<ExternalProvider, Long> {
 Optional<ExternalProvider> findByName(String name);
}

