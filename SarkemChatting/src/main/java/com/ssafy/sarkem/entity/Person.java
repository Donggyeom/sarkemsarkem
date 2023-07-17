package com.ssafy.sarkem.entity;

import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import lombok.Data;

@Data
@RedisHash("person")
public class Person {
	public enum Gender {
		MALE, FEMALE
	}
	
	@Id
	private String id;	// uniqueId 와 같이 id 외에 다른 변수명도 가능
	
	private String name;
	private int age;
	private Gender gender;
	
	List<String> tag;
	private Map<String, String> mapData;
	private List<School> schoolList;
	private Company company;
}
