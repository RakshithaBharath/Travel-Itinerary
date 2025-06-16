package com.excelr.project.travel.planner.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "BOOKED_TRIPS")
public class BookedTrip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // UserAccount reference instead of userId
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private UserAccount userAccount;

    @Column(name = "DESTINATION")
    private String destination;

    @Column(name = "DAYS")
    private Integer days;

    @Column(name = "TRAVEL_TYPE")
    private String travelType;

    @Column(name = "PREFERENCES", length = 500)
    private String preferences;

    @Column(name = "BUDGET")
    private Double budget;

    @Column(name = "CURRENCY", length = 10)
    private String currency;

    @Lob
    @Column(name = "ITINERARY")
    private String itinerary;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private String imageUrl;


}
