package com.excelr.project.travel.planner.entity;



import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trips")
@Data
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "trip_seq_gen")
    @SequenceGenerator(name = "trip_seq_gen", sequenceName = "trip_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user;

    @Column(name = "title", length = 255)
    private String title;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Lob
    @Column(name = "notes")
    private String notes;

    @Column(name = "travelers")
    private Integer travelers;

    @Column(name = "budget", precision = 10, scale = 2)
    private BigDecimal budget;

    @Column(name = "country_code", length = 10)
    private String countryCode;

    @Column(name = "language", length = 10)
    private String language;
    
    @Column(name = "currency", length = 10)
    private String currency;


    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Day> days;
    
    public void addDay(Day day) {
        if (this.days == null) {
            this.days = new ArrayList<>();
        }
        this.days.add(day);
        day.setTrip(this); 
    }


}
