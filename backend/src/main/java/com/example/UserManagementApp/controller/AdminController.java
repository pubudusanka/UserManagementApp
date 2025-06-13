package com.example.UserManagementApp.controller;

import com.example.UserManagementApp.dto.RegisterRequestDto;
import com.example.UserManagementApp.dto.UserDto;
import com.example.UserManagementApp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AuthService authService;

    @PostMapping("/registeradminuser")
    public ResponseEntity<UserDto> registerAdminUser(@RequestBody RegisterRequestDto registerRequestDto){
        return ResponseEntity.ok(authService.registerAdminUser(registerRequestDto));
    }
}
