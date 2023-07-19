package com.a702.sarkem.game.repo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Repository;

import com.a702.sarkem.game.model.ChatRoom;
import com.a702.sarkem.game.model.GameRoom;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Repository
public class GameRepository {
	
	// 
    private static final String GAME_ROOMS = "GAME_ROOM";

    private final RedisTemplate<String, Object> redisTemplate;

	// 게임방(topic)에 발행되는 메시지 처리를 위한 Listner
    private final RedisMessageListenerContainer redisMessageListener;
    // 게임방 관리
    private HashOperations<String, String, GameRoom> hashOpsGameRoom;
    // topic 관리
    private Map<String, ChannelTopic> topics;
    
    @PostConstruct
    private void init() {
    	hashOpsGameRoom = redisTemplate.opsForHash();
        topics = new HashMap<>();
    }
    
    // 게임방 리스트 반환
    public List<GameRoom> findAllGameRoom() {
        return hashOpsGameRoom.values(GAME_ROOMS);
    }

    // 게임방 반환 
    public GameRoom findGameRoomById(String roomId) {
        return hashOpsGameRoom.get(GAME_ROOMS, roomId);
    }
    
    
    
}
