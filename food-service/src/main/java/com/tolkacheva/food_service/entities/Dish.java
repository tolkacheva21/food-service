package com.tolkacheva.food_service.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dishes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Dish {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "weight")
    private int weight;

    @Column(name = "price")
    private int price;

    @ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    @JsonBackReference  //"ведомая" сторона отношения
    private Order order;

    @Transient // поле не будет сохраняться в БД
    private Integer quantity;

    @PrePersist
    @PreUpdate
    private void prepareForSave() {
        this.quantity = null;
    }
}
