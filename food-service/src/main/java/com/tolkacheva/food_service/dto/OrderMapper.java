package com.tolkacheva.food_service.dto;

import com.tolkacheva.food_service.entities.Dish;
import com.tolkacheva.food_service.entities.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OrderMapper {
    public OrderDto toDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setStatus(order.getStatus());
        dto.setCreatedDate(order.getCreatedDate());

        if (order.getUser() != null) {
            OrderUserDto userDto = new OrderUserDto();
            userDto.setId(order.getUser().getId());
            userDto.setName(order.getUser().getName());
            userDto.setEmail(order.getUser().getEmail());
            dto.setUser(userDto);
        }

        List<OrderItemDto> dishDtos = order.getDishes().stream()
                .map(this::toDishDto)
                .collect(Collectors.toList());

        dto.setDishes(dishDtos);
        return dto;
    }

    public List<OrderDto> toDtoList(List<Order> orders) {
        return orders.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private OrderItemDto toDishDto(Dish dish) {
        OrderItemDto dto = new OrderItemDto();
        dto.setDishId(dish.getId());
        dto.setName(dish.getName());
        dto.setPrice(dish.getPrice());
        dto.setQuantity(dish.getQuantity());
        return dto;
    }
}
