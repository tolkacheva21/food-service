package com.tolkacheva.food_service.services;

import com.tolkacheva.food_service.entities.User;
import com.tolkacheva.food_service.jwt.JwtTokenProvider;
import com.tolkacheva.food_service.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public boolean createUser(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return false;
        }
        user.setRole("ROLE_USER");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        log.info("Saving new User with email: {}", user.getEmail());
        userRepository.save(user);
        return true;
    }

    public User getUserFromToken(String token) {
        if (!tokenProvider.validateToken(token)) {
            throw new RuntimeException("Invalid token");
        }
        Integer id = tokenProvider.getUserIdFromJwt(token);
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
