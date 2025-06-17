package com.example.UserManagementApp.service;

import com.example.UserManagementApp.dto.ChangePasswordDto;
import com.example.UserManagementApp.dto.UserDto;
import com.example.UserManagementApp.entity.User;
import com.example.UserManagementApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(()->
                new RuntimeException("User not found"));
        return convertToUserDto(user);
    }

    public UserDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(()->
                new RuntimeException("User not found"));
        return convertToUserDto(user);
    }

    public List<UserDto> getAllUsers() {
        List<User>listOfUsers = userRepository.findAll();
        return listOfUsers.stream()
                .map(this::convertToUserDto)
                .collect(Collectors.toList());
    }

    public UserDto changePassword(Long id, ChangePasswordDto changePasswordDto){
        User user = userRepository.findById(id).orElseThrow(()->
                new RuntimeException("User not found"));
        if (!passwordEncoder.matches(changePasswordDto.getCurrentPassword(),user.getPassword())){
            throw new RuntimeException("Current password is incorrect");
        }

        if (changePasswordDto.getNewPassword().equals(changePasswordDto.getConfirmPassword())){
            throw new RuntimeException("New & Confirm passwords are not same");
        }

        user.setPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
        User savedUser = userRepository.save(user);

        return convertToUserDto(savedUser);
    }

    public UserDto updateUser(Long id, UserDto userDto){
        User user = userRepository.findById(id).orElseThrow(()->
                new RuntimeException("User not found"));
        user.setEmail(userDto.getEmail());
        user.setUsername(userDto.getUsername());

        User savedUser = userRepository.save(user);
        return convertToUserDto(savedUser);
    }

    public void deleteUser(Long id){
        userRepository.deleteById(id);
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
