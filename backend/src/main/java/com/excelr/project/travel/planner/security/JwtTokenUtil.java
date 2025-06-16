package com.excelr.project.travel.planner.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.function.Function;


@Component
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMs}")
    private int jwtExpirationMs;
    
    @Value("${jwt.otpExpirationMs}")
    private int otpExpirationMs;

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public String generateOtpToken(String email, String otp) {
        return Jwts.builder()
                .setSubject(email)
                .claim("otp", otp)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + otpExpirationMs)) // 5 mins
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
    }
    
    public String extractOtp(String token) {
        return extractAllClaims(token).get("otp", String.class);
    }
    
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }

    public boolean validateToken(String token) {
        try {
            final String username = getUsernameFromToken(token);
            final Date expiration = getExpirationDateFromToken(token);
            return (username != null && !expiration.before(new Date()));
        } catch (Exception e) {
            return false;
        }
    }
}