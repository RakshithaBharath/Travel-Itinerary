package com.excelr.project.travel.planner.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "UserAuth")
public class UserAuth {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "userauth_seq_gen")
    @SequenceGenerator(name = "userauth_seq_gen", sequenceName = "userauth_seq", allocationSize = 1)
    @Column(name = "user_auth_id")
    private Long userAuthId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount userAccount;

    @Column(nullable = false, length = 50)
    private String provider; // e.g., "LOCAL", "GOOGLE", "FACEBOOK"

    @Column(name = "provider_user_id", nullable = false, length = 200)
    private String providerUserId;

    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    @Column(length = 255)
    private String salt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

}
