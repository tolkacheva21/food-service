package com.tolkacheva.food_service.repositories;

import com.tolkacheva.food_service.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByEmail(String email);
}
