package com.tolkacheva.food_service.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH},
            fetch = FetchType.EAGER,
            mappedBy = "order")
    @JsonManagedReference   //"ведущая" сторона отношения
    private List<Dish> dishes = new ArrayList<>();

    @Column(name = "total_price")
    private int totalPrice;

    @Column(name = "status")
    private String status;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    private User user;

    @PrePersist
    private void init() {
        createdDate = LocalDateTime.now();
    }

    public void addDishToOrder(Dish dish) {
        dish.setOrder(this);
        dishes.add(dish);
    }
}
