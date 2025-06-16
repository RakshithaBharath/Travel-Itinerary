package com.excelr.project.travel.planner.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ExternalProvider")
public class ExternalProvider {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "externalprovider_seq_gen")
    @SequenceGenerator(name = "externalprovider_seq_gen", sequenceName = "externalprovider_seq", allocationSize = 1)
    @Column(name = "provider_id")
    private Long providerId;

    @Column(name = "name", unique = true, nullable = false, length = 50)
    private String name;

    @Lob
    @Column(name = "config")
    private String config; // JSON stored as text

}
