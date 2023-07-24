package com.a702.sarkem.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Service;

import com.a702.sarkem.exception.GameOptionSettingException;
import com.a702.sarkem.exception.GameRoomNotFoundException;
import com.a702.sarkem.model.GameOptionDTO;
import com.a702.sarkem.model.game.GameSession;
import com.a702.sarkem.model.game.message.SystemMessage;
import com.a702.sarkem.model.game.message.SystemMessage.SystemCode;
import com.a702.sarkem.model.gameroom.GameRoom;
import com.a702.sarkem.model.player.Player;
import com.a702.sarkem.redis.ChatPublisher;
import com.a702.sarkem.redis.ChatSubscriber;
import com.a702.sarkem.redis.GamePublisher;
import com.a702.sarkem.redis.SystemSubscriber;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class GameManager {

	private final Map<String, GameRoom> gameRoomMap;	// Key: roomId
	private final Map<String, GameSession> gameSessionMap;	// Key: roomId

	// 채팅방(topic)에 발행되는 메시지를 처리할 Listner
    private final RedisMessageListenerContainer redisMessageListener;
    // redis pub/sub
    private final SystemSubscriber systemSubscriber;
	private final GamePublisher gamePublisher;
	private final ChatSubscriber chatSubscriber;
	private final ChatPublisher chatPublisher;
	// topic 관리
	private Map<String, ChannelTopic> topics = new HashMap<>();
	
	/**
	 * 게임코드 랜덤 생성(16진수 5자리)
	 */
	public String gameCodeGenerate() {
		char[] tmp = new char[5];
		for(int i=0; i<tmp.length; i++) {
			int div = (int) Math.floor( Math.random() * 2 );
			
			if(div == 0) { // 0이면 숫자로
				tmp[i] = (char) (Math.random() * 10 + '0') ;
			}else { //1이면 알파벳
				tmp[i] = (char) (Math.random() * 26 + 'A') ;
			}
		}
		return new String(tmp);
	}
	
	/**
	 * 게임방 생성
	 * @param roomId
	 */
	public void createGameRoom(String roomId) {
		// 게임방, 게임 세션 생성
		GameRoom newGameRoom = new GameRoom(roomId);		// 게임룸 생성
		gameRoomMap.put(roomId, newGameRoom);
		String newGameId = gameCodeGenerate();		// 새 게임 코드 획득
		newGameRoom.setGameId(newGameId);
		GameSession newGame = new GameSession(roomId, newGameId);	// 새 게임 세션 생성 
		gameSessionMap.put(roomId, newGame);
		
		// reids topic 생성
		String strRoomTopic = "GAME_" + roomId;
		String strChatTopic = "CHAT_" + roomId;
		ChannelTopic roomTopic = new ChannelTopic(strRoomTopic);
		ChannelTopic chatTopic = new ChannelTopic(strChatTopic);
		topics.put(strRoomTopic, roomTopic);
		topics.put(strChatTopic, chatTopic);
		redisMessageListener.addMessageListener(systemSubscriber, roomTopic);
		redisMessageListener.addMessageListener(chatSubscriber, chatTopic);
	}
	
	/**
	 * 플레이어 게임방 연결 
	 */
	public void connectPlayer(String roomId, Player player) {
		GameRoom gameRoom = gameRoomMap.get(roomId);
		List<Player> playerList = gameRoom.getPlayers();
		playerList.add(player);
	}
	
	/**
	 * 게임방 정보 조회
	 * 
	 * @param roomId 
	 * @return GameRoom 객체
	 */
	public GameRoom retrieveGameRoom(String roomId) throws GameRoomNotFoundException {
		GameRoom gameRoom = gameRoomMap.get(roomId);
		if (gameRoom == null) throw new GameRoomNotFoundException(roomId + " 게임방을 찾을 수 없습니다.");
		
		return gameRoomMap.get(roomId);
	}
	
	/**
	 * 게임 설정 변경
	 */
	public void gameOptionChange(String roomId, GameOptionDTO option) throws GameOptionSettingException {
		// 플레이어 수와 역할 수 일치 여부 확인
		GameRoom room = gameRoomMap.get(roomId);
		int playerCount = room.getPlayerCount();
		int optionRoleCount = option.getTotalRoleCount();
		if (playerCount != optionRoleCount) throw new GameOptionSettingException("플레이어 수와 역할 수가 일치하지 않습니다.");
		
		// TODO: 역할 별 최소, 최대 수 검증 필요
		// 삵은 1~3까지만 설정 가능
		int sarkCount = option.getSarkCount();
		if (sarkCount < 0 || sarkCount > 3) throw new GameOptionSettingException("삵은 1 ~ 3 사이로 설정 가능합니다.");
		
		// 회의 시간 변경
		int meetingTime = option.getMeetingTime();
		if (meetingTime < 30 || meetingTime > 180) throw new GameOptionSettingException("회의 시간은 30s ~ 180s 사이로 설정 가능합니다.");
		
		// redis 메시지 전송
	}
	
	/**
	 * 게임 시작
	 */
	public void gameStart(String roomId) {
		// 게임 러너 생성 및 시작
		GameRoom gameRoom = gameRoomMap.get(roomId);
		GameSession gameSession = gameSessionMap.get(roomId);
		ChannelTopic gameTopic = topics.get("GAME_"+roomId);
		ChannelTopic chatTopic = topics.get("CHAT_"+roomId);
		GameThread gameThread = new GameThread(gameRoom, gameSession, gameTopic, chatTopic);
		gameThread.run();
	}
	
	/**
	 * 추방 처리 
	 * @param roomId
	 * @param playerId
	 */
	private void proceedExclusion(String roomId, String playerId) {
		
		GameSession session = gameSessionMap.get(roomId);
		
		// TODO: 게인세션에서 추방 처리
		
		// 시스템 코드 "BE_EXCLUDED" 전송
		SystemMessage message = new SystemMessage(roomId, SystemCode.BE_EXCLUDED, null);
		ChannelTopic gameTopic = topics.get("GAMEROOM_" + roomId);
		gamePublisher.publish(gameTopic, message);
	}

	class GameThread extends Thread {
		
		private GameRoom gameRoom;
		private GameSession gameSession;
		private ChannelTopic gameTopic;
		private ChannelTopic chatTopic;
		
		public GameThread(GameRoom gameRoom, GameSession gameSession, ChannelTopic gameTopic, ChannelTopic chatTopic) {
			this.gameRoom = gameRoom;
			this.gameSession = gameSession;
			this.gameTopic = gameTopic;
			this.chatTopic = chatTopic;
		}

		@Override
		public void run() {
			// TODO: 게임 로직 구현
			// "GAME_START" 시스템 메시지 전송
			GameOptionDTO dto = new GameOptionDTO();
			SystemMessage message = new SystemMessage(gameRoom.getRoomId(), SystemCode.GAME_START, dto);
			gamePublisher.publish(gameTopic, message);
			
		}
		
	}
}


