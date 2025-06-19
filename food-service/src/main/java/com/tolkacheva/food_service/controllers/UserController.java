package com.tolkacheva.food_service.controllers;

import com.tolkacheva.food_service.entities.User;
import com.tolkacheva.food_service.jwt.JwtTokenProvider;
import com.tolkacheva.food_service.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        if (!userService.createUser(user)) {
            throw new RuntimeException("user already exists");
        }
        return ResponseEntity.ok().body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    user.getEmail(), user.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        String token = tokenProvider.generateToken(auth);
        Map<String, String> response = new HashMap<>();
        response.put("token", token);

        return  ResponseEntity.ok().body(response);
    }
}
