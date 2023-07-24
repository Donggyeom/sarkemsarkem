package com.a702.sarkem.service;

import java.util.Map;

import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Service;

import com.a702.sarkem.model.game.GameSession;
import com.a702.sarkem.model.game.SystemMessage;
import com.a702.sarkem.model.game.SystemMessage.SystemCode;
import com.a702.sarkem.model.gameroom.GameRoom;
import com.a702.sarkem.redis.ChatPublisher;
import com.a702.sarkem.redis.ChatSubscriber;
import com.a702.sarkem.redis.GamePublisher;
import com.a702.sarkem.redis.SystemSubscriber;
import com.a702.sarkem.repository.GameSessionRedisRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class GameManager {

	private final Map<String, GameRoom> gameRoomMap;
	private final Map<String, GameSession> gameSessionMap;
	private final GameSessionRedisRepository gameSessionRedisRepository;
	private final GameSession gamession;
	
	// 채팅방(topic)에 발행되는 메시지를 처리할 Listner
	private final RedisMessageListenerContainer redisMessageListener;
	// redis pub/sub
	private final SystemSubscriber systemSubscriber;
	private final GamePublisher gamePublisher;
	private final ChatSubscriber chatSubscriber;
	private final ChatPublisher chatPublisher;
	
	// topic 관리
	private Map<String, ChannelTopic> topics;

	public void createGameRoom(String roomId) {
		// 게임방 생성
		GameRoom newGame = new GameRoom();
		gameRoomMap.put(roomId, newGame);
		String strRoomTopic = "GAMEROOM_" + roomId;
		String strChatTopic = "CHAT_" + roomId;
		ChannelTopic roomTopic = new ChannelTopic(strRoomTopic);
		ChannelTopic chatTopic = new ChannelTopic(strChatTopic);
		topics.put(strRoomTopic, roomTopic);
		topics.put(strChatTopic, chatTopic);
		redisMessageListener.addMessageListener(systemSubscriber, roomTopic);
		redisMessageListener.addMessageListener(chatSubscriber, chatTopic);
	}

	// 추방 처리
	private void proceedExclusion(String roomId, String playerId) {

		GameSession session = gameSessionMap.get(roomId);

		// TODO: 게인세션에서 추방 처리

		// 시스템 코드 "BE_EXCLUDED" 전송
		SystemMessage message = new SystemMessage(SystemCode.BE_EXCLUDED, null);
		ChannelTopic gameTopic = topics.get("GAMEROOM_" + roomId);
		gamePublisher.publish(gameTopic, message);
	}


}
