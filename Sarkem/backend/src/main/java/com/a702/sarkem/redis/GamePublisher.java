package com.a702.sarkem.redis;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

<<<<<<< HEAD
import com.a702.sarkem.model.game.ActionMessage;
import com.a702.sarkem.model.game.ErrorMessage;
import com.a702.sarkem.model.game.SystemMessage;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class GamePublisher {
	private final RedisTemplate<String, Object> redisTemplate;

    public void publish(ChannelTopic topic, SystemMessage message) {
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }
    
    public void publish(ChannelTopic topic, ActionMessage message) {
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }
    
    public void publish(ChannelTopic topic, ErrorMessage message) {
=======
import com.a702.sarkem.model.chat.ChatMessage;
import com.a702.sarkem.model.game.SystemMessage;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class GamePublisher {

    private final RedisTemplate<String, Object> redisTemplate;

    public void publish(ChannelTopic topic, SystemMessage message) {
>>>>>>> branch 'BE_GameSystem' of https://lab.ssafy.com/s09-webmobile1-sub2/S09P12A702.git
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }
}
