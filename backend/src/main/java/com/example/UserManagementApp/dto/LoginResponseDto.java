package com.example.UserManagementApp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDto {

    private String jwtToken;
    private UserDto userDto;
}
