package com.a702.sarkem.redis;

import java.util.Map;

import org.redisson.api.RedissonClient;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.a702.sarkem.model.game.GameSession;
import com.a702.sarkem.model.game.NightVoteMessage;
import com.a702.sarkem.model.player.GameRole;
import com.a702.sarkem.service.GameManager;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class NightVoteSubscriber {
	/*
	 * private final ObjectMapper objectMapper; private final SimpMessagingTemplate
	 * template; private final GamePublisher redisPublisher; private final
	 * GameManager gameManager; private final ChannelTopic topicStartFin; private
	 * final RedissonClient redissonClient; private static final String KEY =
	 * "GameSession";
	 * 
	 * public void sendMessage(String message) { try { NightVoteMessage
	 * nightVoteMessage = objectMapper.readValue(message, NightVoteMessage.class);
	 * String roomId = nightVoteMessage.getRoomId(); Map<GameRole, String> roleVote
	 * = nightVoteMessage.getRoleVoteResult();
	 * 
	 * 
	 * GameSession gameSession = null; String deadPlayerId =
	 * roleVote.get(GameRole.SARK); // 삵이 투표해서 죽은 플래이어 아이디 String protectedPlayerId
	 * = roleVote.get(GameRole.DOCTOR); // 의사가 투표해서 지켜진 플래이어 아이디 String
	 * suspectPlayerId = roleVote.get(GameRole.POLICE); // 경찰이 투표해서 조사받을 플래이어 아이디
	 * String slientPlayerId = roleVote.get(GameRole.ACHI); // 냥아치가 투표해서 조용해야 할 플래이어
	 * 아이디
	 * 
	 * log.info("Room {} NightVote deadPlayer: {}", roomId, deadPlayerId);
	 * log.info("Room {} NightVote protectedPlayer: {}", roomId, protectedPlayerId);
	 * log.info("Room {} NightVote suspectPlayer: {}", roomId, suspectPlayerId);
	 * log.info("Room {} NightVote slientPlayer: {}", roomId, slientPlayerId);
	 * 
	 * // 의사가 살렸을 경우 부활 if (deadPlayerId != null &&
	 * deadPlayerId.equals(protectedPlayerId)) { deadPlayerId = null; }
	 * 
	 * 
	 * } catch (JsonProcessingException e) { e.printStackTrace(); } }
	 * 
	 */
}
