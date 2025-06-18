package com.tolkacheva.food_service.repositories;

import com.tolkacheva.food_service.entities.Dish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DishRepository extends JpaRepository<Dish, Integer> {
    List<Dish> findByName(String name);
}
