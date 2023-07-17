package com.ssafy.sarkem.repository;

import org.springframework.data.repository.CrudRepository;

import com.ssafy.sarkem.entity.Person;

public interface PersonRepository extends CrudRepository<Person, String>{

}
