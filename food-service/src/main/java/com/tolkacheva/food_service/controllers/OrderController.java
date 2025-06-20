package com.tolkacheva.food_service.controllers;

import com.tolkacheva.food_service.dto.OrderDto;
import com.tolkacheva.food_service.dto.OrderItemDto;
import com.tolkacheva.food_service.dto.OrderMapper;
import com.tolkacheva.food_service.entities.Dish;
import com.tolkacheva.food_service.entities.Order;
import com.tolkacheva.food_service.entities.User;
import com.tolkacheva.food_service.services.DishService;
import com.tolkacheva.food_service.services.OrderService;
import com.tolkacheva.food_service.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/history")
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;
    private final DishService dishService;
    private final OrderMapper orderMapper;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        List<OrderDto> orderDtos = orderMapper.toDtoList(orders);
        return ResponseEntity.ok().body(orderDtos);
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getOrdersByUserId(@RequestHeader("Authorization") String token) {
        try {
            User user = userService.getUserFromToken(token.replace("Bearer ", ""));
            List<Order> orders = orderService.getOrdersByUserId(user.getId());
            List<OrderDto> orderDtos = orderMapper.toDtoList(orders);
            return ResponseEntity.ok(orderDtos);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestHeader("Authorization") String token,
                                             @RequestBody List<OrderItemDto> items) {
        try {
            User user = userService.getUserFromToken(token.replace("Bearer ", ""));
            List<Dish> dishes = items.stream()
                    .map(item -> {
                        Dish dish = dishService.getDishById(item.getDishId());
                        dish.setQuantity(item.getQuantity());
                        return dish;
                    })
                    .collect(Collectors.toList());
            Order order = orderService.saveOrder(user, dishes);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(null);
        }
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> changeStatus(@PathVariable int id, @RequestBody String status) {
        orderService.changeOrderStatus(id, status);
        return ResponseEntity.ok("Status was changed successful");
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteOrder(@PathVariable int id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok("Order was deleted successful");
        } catch (Exception e) {
            log.error("Error deleting order with id: " + id, e);
            return ResponseEntity.status(500).body("Error deleting order: " + e.getMessage());
        }
    }
}
