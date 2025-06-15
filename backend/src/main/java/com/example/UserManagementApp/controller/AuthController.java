package com.example.UserManagementApp.controller;

import com.example.UserManagementApp.dto.LoginRequestDto;
import com.example.UserManagementApp.dto.LoginResponseDto;
import com.example.UserManagementApp.dto.RegisterRequestDto;
import com.example.UserManagementApp.dto.UserDto;
import com.example.UserManagementApp.entity.User;
import com.example.UserManagementApp.repository.UserRepository;
import com.example.UserManagementApp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/registernormaluser")
    public ResponseEntity<UserDto> registerNormalUser(@RequestBody RegisterRequestDto registerRequestDto){
        return ResponseEntity.ok(authService.registerNormalUser(registerRequestDto));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody LoginRequestDto loginRequestDto){
       LoginResponseDto loginResponseDto = authService.login(loginRequestDto);

        ResponseCookie cookie = ResponseCookie.from("JWT", loginResponseDto.getJwtToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(1 * 60 * 60) // 1 hour
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(loginResponseDto.getUserDto());
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(){
        return authService.logout();
    }

    @GetMapping("/getcurrentuser")
    public ResponseEntity <?> getCurrentUser(Authentication authentication){
        if (authentication == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not Authenticated");
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(convertToUserDto(user));
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
