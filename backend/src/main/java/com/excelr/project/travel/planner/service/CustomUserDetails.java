package com.excelr.project.travel.planner.service;

import com.excelr.project.travel.planner.entity.UserAccount;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
public class CustomUserDetails implements UserDetails {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private final UserAccount userAccount;
    private final String passwordHash;

    public CustomUserDetails(UserAccount userAccount, String passwordHash) {
        this.userAccount = userAccount;
        this.passwordHash = passwordHash;
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(() -> "USER");
    }

    public String getPassword() {
        return passwordHash; // ✅ from UserAuth
    }

    public String getUsername() {
        return userAccount.getEmail();
    }

    public boolean isAccountNonExpired() { return true; }

    public boolean isAccountNonLocked() { return true; }

    public boolean isCredentialsNonExpired() { return true; }

    public boolean isEnabled() { return true; }

}
