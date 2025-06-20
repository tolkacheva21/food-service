package com.tolkacheva.food_service.services;

import com.tolkacheva.food_service.entities.Dish;
import com.tolkacheva.food_service.entities.Order;
import com.tolkacheva.food_service.entities.User;
import com.tolkacheva.food_service.repositories.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    public Order saveOrder(User user, List<Dish> dishes) {
        Order newOrder = new Order();
        int totalPrice = 0;
        for (Dish d: dishes) {
            Dish dish = new Dish();
            dish.setId(d.getId()); // Используем существующий ID
            dish.setName(d.getName());
            dish.setPrice(d.getPrice());
            dish.setQuantity(d.getQuantity());

            newOrder.addDishToOrder(d);
            totalPrice += dish.getPrice() * dish.getQuantity();
        }
        newOrder.setTotalPrice(totalPrice);
        newOrder.setUser(user);
        newOrder.setStatus("В обработке");
        orderRepository.save(newOrder);
        log.info("Saving new Order {}", newOrder);
        return newOrder;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByUserId(int userId) {
        return orderRepository.findByUserId(userId);
    }

    public void changeOrderStatus(int id, String status) {
        Order newOrder = orderRepository.findById(id).orElse(null);
        newOrder.setStatus(status);
        orderRepository.save(newOrder);
        log.info("Saving new Order with status {}", newOrder.getStatus());
    }

    @Transactional
    public void deleteOrder(int id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        // Отсоединяем блюда от заказа
        for (Dish dish : order.getDishes()) {
            dish.setOrder(null); // Разрываем связь
        }
        order.getDishes().clear(); // Очищаем список

        // Отсоединяем от пользователя
        if (order.getUser() != null) {
            order.getUser().getOrders().remove(order);
        }

        // Удаляем сам заказ
        orderRepository.deleteById(id);

        log.info("Order with id {} was deleted successfully (dishes preserved)", id);
    }
}
