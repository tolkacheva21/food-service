package com.tolkacheva.food_service.controllers;

import com.tolkacheva.food_service.entities.User;
import com.tolkacheva.food_service.services.UserService;
import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        if (!userService.createUser(user)) {
            throw new RuntimeException("user already exists");
        }
        return user;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    user.getEmail(), user.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        return  ResponseEntity.ok("Login successful");
    }
}
