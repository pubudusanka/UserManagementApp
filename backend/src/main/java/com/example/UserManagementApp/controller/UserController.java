package com.example.UserManagementApp.controller;

import com.example.UserManagementApp.dto.ChangePasswordDto;
import com.example.UserManagementApp.dto.UserDto;
import com.example.UserManagementApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/getuserbyid/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id){
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/getuserbyusername/{username}")
    public ResponseEntity<UserDto> getUserByUsername(@PathVariable String username){
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

    @GetMapping("/getallusers")
    public ResponseEntity <List <UserDto>> getAllUsers(){
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/changepassword/{id}")
    public ResponseEntity <UserDto> changePassword(@PathVariable Long id, ChangePasswordDto changePasswordDto){
        return ResponseEntity.ok(userService.changePassword(id, changePasswordDto));
    }

    @PutMapping("/updateuser/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto userDto){
        return ResponseEntity.ok(userService.updateUser(id, userDto));
    }

    @DeleteMapping("/deleteuser/{id}")
    public ResponseEntity <Void> deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
