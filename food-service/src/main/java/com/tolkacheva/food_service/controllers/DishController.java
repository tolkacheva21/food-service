package com.tolkacheva.food_service.controllers;

import com.tolkacheva.food_service.entities.Dish;
import com.tolkacheva.food_service.services.DishService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dishes")
@CrossOrigin(origins = "http://localhost:3000")
public class DishController {
    private final DishService dishService;

    @GetMapping
    public ResponseEntity<List<Dish>> getAllDishes(@RequestParam(name = "name", required = false) String name) {
        List<Dish> dishes = dishService.allDishes(name);
        return ResponseEntity.ok().body(dishes);
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Dish> createDish(@RequestBody Dish dish) {
        dishService.saveDish(dish);
        return ResponseEntity.ok().body(dish);
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Dish> changeDish(@PathVariable int id, @RequestBody Dish dish) {
        dishService.changeDish(id, dish);
        return ResponseEntity.ok().body(dish);
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteDish(@PathVariable int id) {
        dishService.deleteDish(id);
        return ResponseEntity.ok("Dish deleted successful");
    }
}
