package com.example.UserManagementApp.service;

import com.example.UserManagementApp.dto.LoginRequestDto;
import com.example.UserManagementApp.dto.LoginResponseDto;
import com.example.UserManagementApp.dto.RegisterRequestDto;
import com.example.UserManagementApp.dto.UserDto;
import com.example.UserManagementApp.entity.User;
import com.example.UserManagementApp.jwt.JwtService;
import com.example.UserManagementApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;


    public UserDto registerNormalUser(RegisterRequestDto registerRequestDto){
        if (userRepository.findByUsername(registerRequestDto.getUsername()).isPresent()){
            throw new RuntimeException("User is already registered");
        }

        Set <String> set  = new HashSet<>();
        set.add("ROLE_USER");

        User user = new User();
        user.setUsername(registerRequestDto.getUsername());
        user.setEmail(registerRequestDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequestDto.getPassword()));
        user.setRoles(set);

        User savedUser = userRepository.save(user);

        return convertToUserDto(savedUser);
    }

    public UserDto registerAdminUser(RegisterRequestDto registerRequestDto){
        if (userRepository.findByUsername(registerRequestDto.getUsername()).isPresent()){
            throw new RuntimeException("User is already registered");
        }

        Set <String> set  = new HashSet<>();
        set.add("ROLE_ADMIN");
        set.add("ROLE_USER");

        User user = new User();
        user.setUsername(registerRequestDto.getUsername());
        user.setEmail(registerRequestDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequestDto.getPassword()));
        user.setRoles(set);

        User savedUser = userRepository.save(user);

        return convertToUserDto(savedUser);
    }

    public LoginResponseDto login(LoginRequestDto loginRequestDto){
        User user = userRepository.findByUsername(loginRequestDto.getUsername())
                .orElseThrow(()-> new RuntimeException("User not found"));

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequestDto.getUsername(),
                loginRequestDto.getPassword()));

        String jwtToken = jwtService.generateToken(user);

        return LoginResponseDto.builder()
                .jwtToken(jwtToken)
                .userDto(convertToUserDto(user))
                .build();
    }

    public ResponseEntity <String> logout(){
        // create a expired cookie
        ResponseCookie cookie = ResponseCookie.from("JWT","")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE,cookie.toString())
                .body("LOGGED OUT SUCCESSFULLY");
    }

    public UserDto convertToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setRoles(user.getRoles());
        return userDto;
    }
}
