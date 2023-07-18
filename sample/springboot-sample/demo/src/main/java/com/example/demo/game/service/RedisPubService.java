package com.example.demo.game.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.example.demo.game.domain.ChatMessage;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RedisPubService {
    private final RedisTemplate<String, Object> redisTemplate;

    public void sendMessage(ChatMessage chatMessage) {
        redisTemplate.convertAndSend("topic1", chatMessage);

    }
}