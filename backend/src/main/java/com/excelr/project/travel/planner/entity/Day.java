package com.excelr.project.travel.planner.entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "days")
@Data
public class Day {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "days_seq_gen")
    @SequenceGenerator(name = "days_seq_gen", sequenceName = "day_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(name = "day_date")
    private LocalDate date;

    @Column(name = "title")
    private String title;

    @Lob
    @Column(name = "notes")
    private String notes;

    @Column(name = "transport_mode")
    private String transportMode;

    @Column(name = "meals")
    private String meals;

    @Column(name = "cost_estimate", precision = 10, scale = 2)
    private BigDecimal costEstimate;
    
    @OneToMany(mappedBy = "day", cascade = CascadeType.ALL)
    private List<Location> locations;
    
    public void addLocation(Location loc) {
        if (this.locations == null) {
            this.locations = new ArrayList<>();
        }
        this.locations.add(loc);
        loc.setDay(this);
    }
}

