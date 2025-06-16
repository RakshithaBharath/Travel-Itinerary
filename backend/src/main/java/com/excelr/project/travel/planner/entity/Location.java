package com.excelr.project.travel.planner.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "locations")
@Data
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "locations_seq_gen")
    @SequenceGenerator(name = "locations_seq_gen", sequenceName = "location_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "day_id", nullable = false)
    private Day day;

    @Column(name = "name", length = 500)
    private String name;

    @Column(name = "latitude", precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "visit_duration", length = 10)
    private String visitDuration;

    @Column(name = "time_slot", length = 50)
    private String timeSlot;

    @Column(name = "priority")
    private Boolean priority;

    @Column(name = "booking_info", length = 500)
    private String bookingInfo;

    @Column(name = "photos_links", length = 1000)
    private String photosLinks;

    // Weather-related fields
    @Column(name = "weather_condition", length = 100)
    private String weatherCondition;

    @Column(name = "temperature", precision = 5, scale = 2)
    private BigDecimal temperature;

    @Column(name = "weather_icon", length = 10)
    private String weatherIcon;

    @Column(name = "weather_datetime")
    private LocalDateTime weatherDateTime;
    

}
