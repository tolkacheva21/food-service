package com.tolkacheva.food_service.services;

import com.tolkacheva.food_service.entities.Dish;
import com.tolkacheva.food_service.repositories.DishRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class DishService {
    private final DishRepository dishRepository;

    public List<Dish> allDishes(String name) {
        if (name != null) {
            return dishRepository.findByName(name);
        }
        return  dishRepository.findAll();
    }

    public Dish getDishById(int id) {
        return dishRepository.findById(id).orElse(null);
    }

    public void saveDish(Dish dish) {
        log.info("Saving new Dish {}", dish);
        dishRepository.save(dish);
    }

    public void changeDish(int id, Dish dish) {
        Dish newDish = dishRepository.findById(id).orElse(null);
        newDish.setName(dish.getName());
        newDish.setDescription(dish.getDescription());
        newDish.setWeight(dish.getWeight());
        newDish.setPrice(dish.getPrice());
        dishRepository.save(newDish);
    }

    public void deleteDish(int id) {
        dishRepository.deleteById(id);
    }
}
