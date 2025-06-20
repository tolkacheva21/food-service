package com.tolkacheva.food_service.dto;

import lombok.Data;

@Data
public class DishDto {
    private Integer id;
    private String name;
    private String description;
    private Integer weight;
    private Integer price;
}
