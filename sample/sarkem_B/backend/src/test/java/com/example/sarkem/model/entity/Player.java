package com.example.sarkem.model.entity;

import org.springframework.data.annotation.Id;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@Setter
@Builder
public class Player {
	@Id
	private final String id;
	private final String nickname;
	private GameRole role;
	
}
