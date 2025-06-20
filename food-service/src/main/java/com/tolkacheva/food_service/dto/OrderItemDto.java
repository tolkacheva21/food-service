package com.tolkacheva.food_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDto {
    private Integer dishId;
    private String name;
    private int price;
    private Integer quantity;
}
