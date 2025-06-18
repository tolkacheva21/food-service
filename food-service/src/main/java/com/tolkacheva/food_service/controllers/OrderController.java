package com.tolkacheva.food_service.controllers;

import com.tolkacheva.food_service.entities.Dish;
import com.tolkacheva.food_service.entities.Order;
import com.tolkacheva.food_service.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/history")
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/admin")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PostMapping("/admin")
    public Order createOrder(@RequestBody Dish... dishes) {
        return orderService.saveOrder(dishes);
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<String> changeStatus(@PathVariable int id, @RequestBody String status) {
        orderService.changeOrderStatus(id, status);
        return ResponseEntity.ok("Status was changed successful");
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable int id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok("Order was deleted successful");
    }
}
