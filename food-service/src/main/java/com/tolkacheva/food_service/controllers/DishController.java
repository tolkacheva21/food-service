package com.tolkacheva.food_service.controllers;

import com.tolkacheva.food_service.entities.Dish;
import com.tolkacheva.food_service.services.DishService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dishes")
public class DishController {
    private final DishService dishService;

    @GetMapping("/")
    public List<Dish> getAllDishes(@RequestParam(name = "name", required = false) String name) {
        return dishService.allDishes(name);
    }

    @PostMapping("/admin")
    //@PreAuthorize()
    public Dish createDish(@RequestBody Dish dish) {
        dishService.saveDish(dish);
        return dish;
    }

    @PutMapping("/admin/{id}")
    public Dish changeDish(@PathVariable int id, @RequestBody Dish dish) {
        dishService.changeDish(id, dish);
        return dish;
    }

    @DeleteMapping("/admin/{id}")
    public void deleteDish(@PathVariable int id) {
        dishService.deleteDish(id);
    }
}
