package com.example.UserManagementApp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequestDto {

    @NotBlank
    @Size(min = 2, max = 50)
    private String username;

    @NotBlank
    @Size(max= 70)
    @Email
    private String email;

    @NotBlank
    @Size(min = 5, max = 50)
    private String password;

}
