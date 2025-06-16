package com.excelr.project.travel.planner.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "BookingHotel")
@Data
public class BookingHotel {
	 @Id
	    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "booking_seq_gen")
	    @SequenceGenerator(name = "booking_seq_gen", sequenceName = "BOOKING_SEQ", allocationSize = 1)
	    private Long id;

	    @Column(name = "HOTEL_NAME", nullable = false)
	    private String hotelName;

	    @Column(name = "CITY_CODE", nullable = false, length = 10)
	    private String cityCode;

	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "USER_ID", nullable = false)
	    private UserAccount userAccount;


	    @Column(name = "CHECK_IN")
	    private LocalDate checkIn;

	    @Column(name = "CHECK_OUT")
	    private LocalDate checkOut;

	    @Column(name = "ROOMS")
	    private int rooms;

	    @Column(name = "SPECIAL_REQUESTS", length = 2000)
	    private String specialRequests;

	    @Column(name = "BOOKING_REF", unique = true, length = 50)
	    private String bookingRef;
	    
	    @Column(name = "PRICE")
	    private Long price;
	    
	    @Column(name = "CURRENCY")
	    private String currency;

}
