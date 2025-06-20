package com.tolkacheva.food_service.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDto {
    private int id;
    private int totalPrice;
    private String status;
    private LocalDateTime createdDate;
    private OrderUserDto user;
    private List<OrderItemDto> dishes;
}
