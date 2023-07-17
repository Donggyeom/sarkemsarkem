package com.ssafy.sarkem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sarkem.entity.Person;
import com.ssafy.sarkem.repository.PersonRepository;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class TestController {
	@Autowired
	PersonRepository personRepository;
	
	@GetMapping("/person/{id}")
	public Person getPerson(@PathVariable String id) {		
		Person person = personRepository.findById(id).get();		
//		log.info("person: " + person);		
		return person;
	}
	
	@PostMapping("/person")
	public Person getPerson(@RequestBody Person person) {		
		Person savedPerson = personRepository.save(person);		
//		log.info("savedPerson: " + savedPerson);		
		return savedPerson;			
	}
}
