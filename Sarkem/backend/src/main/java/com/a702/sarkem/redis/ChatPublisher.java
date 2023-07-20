package com.a702.sarkem.redis;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import com.a702.sarkem.model.chat.ChatMessage;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ChatPublisher {
	
    private final RedisTemplate<String, Object> redisTemplate;
    
    public void publish(ChannelTopic topic, ChatMessage message) {
    	redisTemplate.convertAndSend(topic.getTopic(), message);
    }

}
