package com.excelr.project.travel.planner.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "destinations")
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "destination_seq_gen")
    @SequenceGenerator(name = "destination_seq_gen", sequenceName = "destinations_seq", allocationSize = 1)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String country;

    @Column(length = 500)
    private String description;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "avg_package_price_inr", nullable = false, precision = 10, scale = 2)
    private BigDecimal avgPackagePriceInr;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

}
