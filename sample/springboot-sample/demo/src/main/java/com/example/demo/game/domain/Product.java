package com.example.demo.game.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@NoArgsConstructor
@RedisHash("product")
public class Product {
    @Id
    private String id;

    private String name;

    private Long price;

    public Product(String id, String name, Long price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public void changePrice(Long price) {
        this.price = price;
    }
}