package com.example.demo.game.repo;

import org.springframework.data.repository.CrudRepository;

import com.example.demo.game.domain.Product;

public interface ProductRepository extends CrudRepository<Product, String> {
}