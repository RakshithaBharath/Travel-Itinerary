package com.excelr.project.travel.planner.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "travel_bookings")
public class TravelBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "travel_bookings")
    @SequenceGenerator(name = "travel_bookings", sequenceName = "travel_bookings_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private UserAccount user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    @Column(name = "booking_date", nullable = false)
    private LocalDateTime bookingDate = LocalDateTime.now();

    // getters & setters
}