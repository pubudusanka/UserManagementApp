package com.example.UserManagementApp.jwt;

import com.example.UserManagementApp.entity.User;
import com.example.UserManagementApp.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Autowired
    private UserRepository userRepository;

    @Value("${jwt.secret}")
    private  String secretKey;
    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    //method to Extract the userId
    public Long extractUserId(String jwtToken){
        String userIdString = extractClaim(jwtToken, claims -> claims.get("userId", String.class));
        return userIdString != null ? Long.parseLong(userIdString) : null;
    }

    //method to Extract the username
    public String extractUsername(String jwtToken){
        return extractClaim(jwtToken, Claims::getSubject);
    }

    private <T> T extractClaim(String jwtToken, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(jwtToken);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String jwtToken){
        return Jwts
                .parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(jwtToken)
                .getPayload();
    }

    public SecretKey getSignInKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateToken(UserDetails user){
        return generateToken(new HashMap(),user);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails user){
        Map<String, Object> claims = new HashMap(extraClaims);
        Long userId = userRepository.findByUsername(user.getUsername()).get().getId();
        String userIdString = String.valueOf(userId);
        claims.put("userId",userIdString );

        return Jwts
                .builder()
                .claims(claims)
                .subject(user.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+ jwtExpiration))
                .signWith(getSignInKey())
                .compact();
    }

    public boolean isTokenValid(String jwtToken, User user){
        final Long userIdfromToken = extractUserId(jwtToken);
        final Long userIdDetails = user.getId();

        return (userIdfromToken != null && userIdfromToken.equals(userIdDetails)
                                    && !isTokenExpired(jwtToken));
    }

    private boolean isTokenExpired(String jwtToken){
        return extractExpiration(jwtToken).before(new Date());
    }

    private Date extractExpiration(String jwtToken){
        return extractClaim(jwtToken, Claims::getExpiration);
    }


}
