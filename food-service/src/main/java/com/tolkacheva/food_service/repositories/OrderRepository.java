package com.tolkacheva.food_service.repositories;

import com.tolkacheva.food_service.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Integer> {
}
