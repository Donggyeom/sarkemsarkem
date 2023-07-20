package com.a702.sarkem.redis;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import com.a702.sarkem.model.chat.ChatMessage;
import com.a702.sarkem.model.game.SystemMessage;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class GamePublisher {

    private final RedisTemplate<String, Object> redisTemplate;

    public void publish(ChannelTopic topic, SystemMessage message) {
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }
}
