package com.excelr.project.travel.planner.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "UserRole")
public class UserRole {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "userrole_seq_gen")
    @SequenceGenerator(name = "userrole_seq_gen", sequenceName = "userrole_seq", allocationSize = 1)
    @Column(name = "user_role_id")
    private Long userRoleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount userAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;
}
