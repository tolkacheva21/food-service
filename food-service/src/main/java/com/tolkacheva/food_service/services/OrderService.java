package com.tolkacheva.food_service.services;

import com.tolkacheva.food_service.entities.Dish;
import com.tolkacheva.food_service.entities.Order;
import com.tolkacheva.food_service.repositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    public Order saveOrder(Dish... dishes) {
        Order newOrder = new Order();
        int totalPrice = 0;
        for (Dish d: dishes) {
            newOrder.addDishToOrder(d);
            totalPrice += d.getPrice();
        }
        newOrder.setTotalPrice(totalPrice);
        newOrder.setStatus("Заказ готовится");
        orderRepository.save(newOrder);
        log.info("Saving new Order {}", newOrder);
        return newOrder;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public void changeOrderStatus(int id, String status) {
        Order newOrder = orderRepository.findById(id).orElse(null);
        newOrder.setStatus(status);
        orderRepository.save(newOrder);
        log.info("Saving new Order with status {}", newOrder.getStatus());
    }

    public void deleteOrder(int id) {
        orderRepository.deleteById(id);
    }
}
