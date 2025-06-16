package com.excelr.project.travel.planner.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.excelr.project.travel.planner.entity.UserAccount;
import com.excelr.project.travel.planner.repository.UserAccountRepository;
import com.excelr.project.travel.planner.repository.UserAuthRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private UserAuthRepository userAuthRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. Find user by email
        UserAccount user = userAccountRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        // 2. Get hashed password from UserAuth
        String passwordHash = userAuthRepository.findByUserAccount(user)
            .orElseThrow(() -> new UsernameNotFoundException("Authentication not found for user: " + username))
            .getPasswordHash();

        // 3. Load roles or authorities (assuming USER for now)
        return new CustomUserDetails(user, passwordHash);

    }
}

