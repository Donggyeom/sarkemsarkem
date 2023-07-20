package com.a702.sarkem.service;

import org.springframework.stereotype.Service;

import com.a702.sarkem.redis.GamePublisher;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class GameManager {
	
	private final GamePublisher systemPublisher;

	
}
