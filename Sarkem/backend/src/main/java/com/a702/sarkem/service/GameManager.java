package com.a702.sarkem.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Service;

import com.a702.sarkem.exception.GameRoomNotFoundException;
import com.a702.sarkem.model.game.GameSession;
import com.a702.sarkem.model.game.GameSession.PhaseType;
import com.a702.sarkem.model.game.dto.GameOptionDTO;
import com.a702.sarkem.model.game.message.SystemMessage;
import com.a702.sarkem.model.game.message.SystemMessage.SystemCode;
import com.a702.sarkem.model.gameroom.GameRoom;
import com.a702.sarkem.model.player.GameRole;
import com.a702.sarkem.model.player.Player;
import com.a702.sarkem.model.player.RolePlayer;
import com.a702.sarkem.redis.ChatPublisher;
import com.a702.sarkem.redis.ChatSubscriber;
import com.a702.sarkem.redis.GamePublisher;
import com.a702.sarkem.redis.SystemSubscriber;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class GameManager {

	private final Map<String, GameRoom> gameRoomMap; // Key: roomId
	private final Map<String, GameSession> gameSessionMap; // Key: roomId

	// 채팅방(topic)에 발행되는 메시지를 처리할 Listner
	private final RedisMessageListenerContainer redisMessageListener;
	// redis pub/sub
	private final SystemSubscriber systemSubscriber;
	private final GamePublisher gamePublisher;
	private final ChatSubscriber chatSubscriber;
	private final ChatPublisher chatPublisher;
	// topic 관리
	private Map<String, ChannelTopic> topics = new HashMap<>();

	private ChannelTopic getGameTopic(String roomId) {
		return topics.get("GAME_" + roomId);
	}

	private ChannelTopic getChatTopic(String roomId) {
		return topics.get("CHAT_" + roomId);
	}

	/**
	 * 게임코드 랜덤 생성(16진수 5자리)
	 */
	public String gameCodeGenerate() {
		char[] tmp = new char[5];
		for (int i = 0; i < tmp.length; i++) {
			int div = (int) Math.floor(Math.random() * 2);

			if (div == 0) { // 0이면 숫자로
				tmp[i] = (char) (Math.random() * 10 + '0');
			} else { // 1이면 알파벳
				tmp[i] = (char) (Math.random() * 26 + 'A');
			}
		}
		return new String(tmp);
	}

	/**
	 * 게임방 생성
	 * 
	 * @param roomId
	 */
	public void createGameRoom(String roomId) {
		// 게임방, 게임 세션 생성
		GameRoom newGameRoom = new GameRoom(roomId); // 게임룸 생성
		gameRoomMap.put(roomId, newGameRoom);
		String newGameId = gameCodeGenerate(); // 새 게임 코드 획득
		newGameRoom.setGameId(newGameId);
		GameSession newGame = new GameSession(roomId, newGameId); // 새 게임 세션 생성
		gameSessionMap.put(newGameId, newGame);

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

	// 플레이어 나가기
	public void deletePlayer(String roomId, String playerId) {
		GameRoom gameRoom = gameRoomMap.get(roomId);
		gameRoom.deletePlayer(playerId);

		// 더 이상 게임 세션에 남은 인원이 없을 때
		if (gameRoom.getPlayerCount() == 0) {
			// gameRoom 정보와 redis topic 삭제
			gameRoomMap.remove(roomId);
			gameSessionMap.remove(roomId);
			topics.remove(getGameTopic(roomId));
			topics.remove(getChatTopic(roomId));
		} else if (getHostId(roomId).equals(playerId)) {
			// 방장 변경하기
			setHostId(roomId, gameRoom.getPlayersId().get(0));
			System.out.println("방장이 변경되었습니다." + playerId + " " + getHostId(roomId));
		}
	}

	// 호스트 아이디 지정해주기
	public void setHostId(String roomId, String playerId) {
		GameRoom gameRoom = gameRoomMap.get(roomId);
		gameRoom.setHostId(playerId);
		gameRoomMap.put(roomId, gameRoom);
	}

	// 현재 게임 세션 호스트 호출하기
	public String getHostId(String roomId) {
		GameRoom gameRoom = gameRoomMap.get(roomId);
		return gameRoom.getHostId();
	}

	/**
	 * 게임룸 정보 조회
	 */
	public GameRoom getGameRoom(String roomId) {
		return gameRoomMap.get(roomId);
	}
	
	/**
	 * 게임세션 정보 조회
	 */
	public GameSession getGameSession(String roomId) {
		GameRoom room = gameRoomMap.get(roomId);
		String gameId = room.getGameId();
		if (gameId == null) return null;
		return gameSessionMap.get(gameId);
	}

	/**
	 * 게임방 방장 여부 확인
	 */
	public boolean isHost(String roomId, String playerId) {
		if (playerId == null)
			return false;

		GameRoom gameRoom = gameRoomMap.get(roomId);
		String hostId = gameRoom.getHostId();
		if (!playerId.equals(hostId))
			return false;

		return true;
	}

	/**
	 * 플레이어 게임방 연결
	 */
	public boolean connectPlayer(String roomId, Player player) {
		GameRoom gameRoom = gameRoomMap.get(roomId);
		if (gameRoom.getPlayerCount() < 10) {
			List<Player> playerList = gameRoom.getPlayers();
			playerList.add(player);
			if (gameRoom.getHostId() == null)
				gameRoom.setHostId(player.getPlayerId());
			return true;
		} else {
			return false;
		}
	}


	/**
	 * 게임방 정보 조회
	 * 
	 * @param roomId
	 * @return GameRoom 객체
	 */
	public GameRoom retrieveGameRoom(String roomId) throws GameRoomNotFoundException {
		GameRoom gameRoom = gameRoomMap.get(roomId);
		if (gameRoom == null)
			throw new GameRoomNotFoundException(roomId + " 게임방을 찾을 수 없습니다.");

		return gameRoomMap.get(roomId);
	}

	/**
	 * 게임 설정 변경
	 */
	public void gameOptionChange(String roomId, String playerId, GameOptionDTO option) {

		GameRoom room = gameRoomMap.get(roomId);
		// 방장과 플레이어 일치 여부 확인
		if (!room.getHostId().equals(playerId)) {
			return;
		}

		// 플레이어 수와 역할 수 일치 여부 확인
		String hostId = room.getHostId();

		// 회의 시간 변경
		int meetingTime = option.getMeetingTime();
		if (meetingTime < 15 || meetingTime > 180) {
			sendNoticeMessageToPlayer(roomId, hostId, "회의 시간은 15s ~ 180s 사이로 설정 가능합니다.");
			return;
		}

		// session 변경
		GameSession gameSession = getGameSession(roomId);
		gameSession.setMeetingTime(option.getMeetingTime());
		gameSession.setCitizenCount(option.getCitizenCount());
		gameSession.setSarkCount(option.getSarkCount());
		gameSession.setDoctorCount(option.getDoctorCount());
		gameSession.setPoliceCount(option.getPoliceCount());
		gameSession.setDetectiveCount(option.getDetectiveCount());
		gameSession.setPsychologistCount(option.getPsychologistCount());
		gameSession.setBullyCount(option.getBullyCount());
		log.debug(gameSession.toString());
		sendGameOptionChangedMessage(roomId, option);
	}

	/**
	 * 현재 플레이어 수와 옵션에 설정된 직업의 수 일치 여부 확인
	 * 
	 * @param roomId
	 * @return
	 */
	public boolean checkStartable(String roomId) {
		// 플레이어 수와 역할 수 일치 여부 확인
		GameRoom room = gameRoomMap.get(roomId);
		GameSession gameSession = getGameSession(roomId);
		log.debug(room.toString());
		log.debug(gameSession.toString());
		if (room == null || gameSession == null) return false;
		
		int playerCount = room.getPlayerCount();
		int optionRoleCount = gameSession.getTotalRoleCnt();
		log.debug("플레이어 수 : " + playerCount + "\n 설정된 직업 수 : " + optionRoleCount);

		if (playerCount != optionRoleCount)
			return false;
		return true;
	}

	/**
	 * 게임 시작 ======= 게임 쓰레드 시작
	 */
	public void gameStart(String roomId) {
		// 게임 러너 생성 및 시작
		GameRoom gameRoom = gameRoomMap.get(roomId);
		GameSession gameSession = getGameSession(roomId);
		ChannelTopic gameTopic = topics.get("GAME_" + roomId);
		ChannelTopic chatTopic = topics.get("CHAT_" + roomId);
		GameThread gameThread = new GameThread(this, gameRoom, gameSession, gameTopic, chatTopic);
		gameThread.run();
	}

	/**
	 * 대상 선택
	 */
	public void selectTarget(String roomId, String playerId, Map<String, String> target) {
		GameSession gameSession = getGameSession(roomId);
		String targetId = target.get("target");
		
		RolePlayer player = (RolePlayer) gameSession.getPlayer(playerId); // 타겟을 지목한 플레이어
		RolePlayer newTargetPlayer = (RolePlayer) gameSession.getPlayer(targetId); // 플레이어가 새로 지목한 타겟 플레이어
		
		log.debug(player.getNickname()+"의 타겟아이디는 "+targetId);
		log.debug(player.getNickname()+"의 타겟은 "+newTargetPlayer.getNickname());
		// 밤 직업 별 투표 // 투표하는 애들은 삵, 의사, 경찰, 심리학자, 냥아치
		if(gameSession.getPhase().equals(PhaseType.NIGHT)) {
			List<RolePlayer> players = gameSession.getPlayers(); // 전체 플레이어
			List<String> thisPlayers = new ArrayList<>(); // 이 직업을 가진 플레이어들id
			for(RolePlayer rPlayer : players) {
				if(player.getRole().equals(rPlayer.getRole())) {
					rPlayer.setTargetConfirmed(false); // 이미 선택완료한 사람들 있을 수도 있으니까 선택완료false해주기
					rPlayer.setTarget(targetId); // 직업이 일치하는 플레이어들의 타겟 동일하게 설정
					thisPlayers.add(rPlayer.getPlayerId());
				}
			}
			HashMap<String, String> votingMap = new HashMap<>();
			// 일단은 파람에 타겟을 보내볼게
			votingMap.put("target", targetId);
//			votingMap.put("role", player.getRole().toString());
			sendVoteSituationOnlyMessage(roomId, thisPlayers, votingMap);
		}
		
		// 낮 투표
		if(gameSession.getPhase().equals(PhaseType.DAY)) {
			log.debug("낮셀렉트 시작");
			// 이전에 지목한 타겟이 없을 때
			if (player.getTarget() == null || "".equals(player.getTarget())) {
				newTargetPlayer.setVotedCnt(newTargetPlayer.getVotedCnt() + 1); // 현재 타겟이 받은 투표수++
				player.setTarget(targetId); // 현재 타겟 업데이트
			} // 기존 타겟과 새로 지목한 타겟이 다르면
			else if (!player.getTarget().equals(targetId)) {
				RolePlayer targetedPlayer = (RolePlayer) gameSession.getPlayer(player.getTarget()); // 플레이어의 기존 타겟이었던 플레이어
				targetedPlayer.setVotedCnt(targetedPlayer.getVotedCnt() - 1); // 기존 타겟이 받은 투표수--
				if (newTargetPlayer != null) {
					newTargetPlayer.setVotedCnt(newTargetPlayer.getVotedCnt() + 1); // 현재 타겟이 받은 투표수++
				}
				player.setTarget(targetId); // 현재 타겟 업데이트
			}
			sendVoteSituationMessage(roomId, mergeTargets(gameSession.getPlayers()));
		}
		
	}

	// 선택된 대상들 Map으로 묶어주는 함수
	public Map<String, Integer> mergeTargets(List<RolePlayer> players) {
		HashMap<String, Integer> targets = new HashMap<>();
		for (RolePlayer rPlayer : players) {
			targets.put(rPlayer.getPlayerId(), rPlayer.getVotedCnt());
		}
		return targets;
	}

	/**
	 * 대상 선택 완료
	 */
	public void selectedTarget(String roomId, String playerId) {
		GameSession gameSession = getGameSession(roomId);
		RolePlayer rPlayer = (RolePlayer) gameSession.getPlayer(playerId);
		rPlayer.setTargetConfirmed(true);
		
		String targetId = rPlayer.getTarget();
		String targetNickname = "";
		RolePlayer targetPlayer = gameSession.getPlayer(targetId);
		if (targetPlayer == null) {
			targetId = "";
			targetNickname = "";
		}
		HashMap<String, String> param = new HashMap<>();
		param.put("playerId", playerId);
		param.put("targetId", targetId);
		param.put("targetNickname", targetNickname);
		log.debug(param.toString());
		// 누가 누구 지목했는지 메시지 보내기
		sendTargetSelectionEndMessage(roomId, playerId, param);
		
		// 밤 투표 "경찰" 직업 전체가 투표 완료했을 때
		if(rPlayer.getRole().equals(GameRole.POLICE)) {
			
		}
	}


	
	// 추방 투표 처리
	public void expulsionVote(String roomId, Map<String, Boolean> voteOX) {
		GameSession gameSession = getGameSession(roomId);
		Boolean voteResult = voteOX.get("result");
		// 투표자수++
		gameSession.setExpulsionVotePlayerCnt(gameSession.getExpulsionVotePlayerCnt() + 1);
		if (voteResult) { // 추방 투표 찬성수 ++
			gameSession.setExpulsionVoteCnt(gameSession.getExpulsionVoteCnt() + 1);
		}
		// 끝날 조건
		if (gameSession.getExpulsionVoteCnt() == gameSession.getPlayers().size() // 모두가 투표를 했거나
				|| gameSession.getExpulsionVoteCnt() >= (gameSession.getPlayers().size() + 1) / 2) { // 찬성 투표가 과반수 이상일 때
			// 과반수 이상 찬성일 때 => 추방 대상자한테 메시지 보내기
			if (gameSession.getExpulsionVoteCnt() >= (gameSession.getPlayers().size() + 1) / 2) {
				sendExcludedMessage(roomId, gameSession.getExpulsionTargetId());
				// 실제로 추방하기
				RolePlayer expulsionPlayer = gameSession.getPlayer(gameSession.getExpulsionTargetId());
				expulsionPlayer.setAlive(false);
				// 채팅방 입장시키기
				
			} 
			// 추방 투표 결과 전송 // 저녁 페이즈 종료
			HashMap<String, String> result = new HashMap<>();
			// 추방 당한 사람 아이디를 파람으로 전달
			result.put("expulsionPlayer", gameSession.getExpulsionTargetId());
			sendEndTwilightVoteMessage(roomId, result);
		}
	}

	/**
	 * 시스템 메시지를 대상에게 전송
	 * 
	 * @param roomId
	 * @param target
	 * @param code
	 * @param param
	 */
	public void sendSystemMessage(String roomId, String target, SystemCode code, Object param) {
		ChannelTopic gameTopic = getGameTopic(roomId);
		SystemMessage systemMessage = new SystemMessage(code, roomId, target, param);
		log.debug(systemMessage.toString());
		gamePublisher.publish(gameTopic, systemMessage);
	}

	/**
	 * 시스템 메시지를 대상에게 전송
	 * 
	 * @param roomId
	 * @param targets
	 * @param code
	 * @param param
	 */
	public void sendSystemMessage(String roomId, List<String> targets, SystemCode code, Object param) {
		ChannelTopic gameTopic = getGameTopic(roomId);
		for (String target : targets) {
			sendSystemMessage(roomId, target, code, param);
		}
	}

	/**
	 * 시스템 메시지를 모두에게 전송
	 * 
	 * @param roomId
	 * @param code
	 * @param param
	 */
	public void sendSystemMessageToAll(String roomId, SystemCode code, Object param) {
		GameRoom gameRoom = gameRoomMap.get(roomId);
		List<String> players = gameRoom.getPlayersId();
		sendSystemMessage(roomId, players, code, param);
	}

	// 0. 공통기능
	/**
	 * "안내메시지" 메시지를 대상에게 전송
	 * 
	 * @param playerId
	 * @param message
	 */
	public void sendNoticeMessageToPlayer(String roomId, String playerId, String message) {
		HashMap<String, String> param = new HashMap<>();
		param.put("message", message);
		List<String> targets = new ArrayList<>();
		targets.add(playerId);
		sendSystemMessage(roomId, targets, SystemCode.NOTICE_MESSAGE, param);
	}

	/**
	 * "안내메시지" 메시지를 대상들에게 전송
	 * 
	 * @param playersId
	 * @param message
	 */
	public void sendNoticeMessageToPlayers(String roomId, String[] playersId, String message) {
		HashMap<String, String> param = new HashMap<>();
		param.put("message", message);
		List<String> targets = new ArrayList<>();
		for (int i = 0; i < playersId.length; i++) {
			targets.add(playersId[i]);
		}
		sendSystemMessage(roomId, targets, SystemCode.NOTICE_MESSAGE, param);
	}

	/**
	 * "안내메시지" 메시지를 모두에게 전송
	 * 
	 * @param message
	 */
	public void sendNoticeMessageToAll(String roomId, String message) {
		HashMap<String, String> param = new HashMap<>();
		param.put("message", message);
		sendSystemMessageToAll(roomId, SystemCode.NOTICE_MESSAGE, param);
	}
	// 0. 공통기능 끝

	// 1. 게임 로비
	// "게임방 설정" 메시지 전송
	public void sendGameOptionMessage(String roomId, String playerId) {
		GameSession gameSession = getGameSession(roomId);
		GameOptionDTO option = gameSession.getGameOption();
		
		sendSystemMessage(roomId, playerId, SystemCode.OPTION_CHANGED, option);
	}

	// "게임방 설정 변경" 메시지 전송
	public void sendGameOptionChangedMessage(String roomId, GameOptionDTO option) {
		GameRoom gameRoom = getGameRoom(roomId);
		String hostId = gameRoom.getHostId();
		List<Player> players = getGameRoom(roomId).getPlayers();
		
		if (hostId == null || hostId.equals("")) {
			log.debug("방장 정보가 없습니다.");
			return;
		}
		
		List<String> playersId = new ArrayList<>();
		for (Player p : players) {
			String pId = p.getPlayerId();
			if (hostId.equals(pId)) continue;
			
			playersId.add(pId);
		}
		sendSystemMessage(roomId, playersId, SystemCode.OPTION_CHANGED, option);
	}

	// "게임시작" 메시지 전송
	public void sendGameStartMessage(String roomId) {
		GameRoom gameRoom = gameRoomMap.get(roomId);
		List<String> playersId = gameRoom.getPlayersId();
		sendSystemMessage(roomId, playersId, SystemCode.GAME_START, null);
	}
	// 1. 게임 로비 끝

	// 2. 게임 진행
	// "대상선택" 메시지 전송
	public void sendTargetSelectionMessage(String roomId) {
		sendSystemMessageToAll(roomId, SystemCode.TARGET_SELECTION, null);
	}

	// "대상선택 종료" 메시지 전송
	public void sendTargetSelectionEndMessage(String roomId, String playerId, Map<String, String> selected) {
		sendSystemMessage(roomId, playerId, SystemCode.TARGET_SELECTION_END, selected);
	}

	// "역할배정" 메시지 전송
	public void sendRoleAssignMessage(String roomId) {
		GameSession gameSession = getGameSession(roomId);
		List<RolePlayer> rPlayers = gameSession.getPlayers();
		Map<String, GameRole> param = new HashMap<>();
		for (RolePlayer rp : rPlayers) {
			param.put("role", rp.getRole());
			sendSystemMessage(roomId, rp.getPlayerId(), SystemCode.ROLE_ASSIGNED, param);
		}
	}

	// "낮 페이즈" 메시지 전송
	public void sendDayPhaseMessage(String roomId) {
		sendSystemMessageToAll(roomId, SystemCode.PHASE_DAY, null);
	}

	// "저녁 페이즈" 메시지 전송
	public void sendTwilightPhaseMessage(String roomId) {
		sendSystemMessageToAll(roomId, SystemCode.PHASE_TWILIGHT, null);
	}

	// "저녁 투표 시작" 메시지 전송
	public void sendTwilightVoteMessage(String roomId) {
		sendSystemMessageToAll(roomId, SystemCode.TWILIGHT_VOTE, null);
	}

	// "밤 페이즈" 메시지 전송
	public void sendNightPhaseMessage(String roomId) {
		sendSystemMessageToAll(roomId, SystemCode.PHASE_NIGHT, null);
	}

	// "낮 투표 종료" 메시지 전송
	public void sendEndDayVoteMessage(String roomId, Map<String, String> param) {
		sendSystemMessageToAll(roomId, SystemCode.DAY_VOTE_END, param);
	}

	// "저녁 투표 종료" 메시지 전송
	public void sendEndTwilightVoteMessage(String roomId, Map<String, String> param) {
		sendSystemMessageToAll(roomId, SystemCode.TWILIGHT_VOTE_END, param);
	}

	// "추방당함" 메시지 전송
	public void sendExcludedMessage(String roomId, String playerId) {
		sendSystemMessage(roomId, playerId, SystemCode.BE_EXCLUDED, null);
	}

	// "사냥당함" 메시지 전송
	public void sendHuntedMessage(String roomId) {
		sendSystemMessageToAll(roomId, SystemCode.BE_HUNTED, null);
	}

	// "투표현황" 메시지 전송
	public void sendVoteSituationMessage(String roomId, Map<String, Integer> votedSituation) {
		sendSystemMessageToAll(roomId, SystemCode.VOTE_SITUATION, votedSituation);
	}
	
	// "밤 투표현황" 대상자들한테만 메시지 전송 *
	public void sendVoteSituationOnlyMessage(String roomId, List<String> players, Map<String, String> votingSituation) {
		sendSystemMessage(roomId, players, SystemCode.VOTE_SITUATION, votingSituation);
	}

	// "심리분석 시작" 메시지 전송 *
	public void sendPsychoStartMessage(String roomId, String playerId) {
		sendSystemMessage(roomId, playerId, SystemCode.PSYCHOANALYSIS_START, null);
	}

	// "협박당함" 메시지 전송 *
	public void sendThreatingMessage(String roomId, String playerId) {
		sendSystemMessage(roomId, playerId, SystemCode.BE_THREATED, null);
	}

	// "히든미션 시작" 메시지 전송 **
	public void sendHiddenMissionStartMessage(String roomId, String[] playerId) {
		List<String> targets = new ArrayList<>();
		for (int i = 0; i < playerId.length; i++) {
			targets.add(playerId[i]);
		}
		sendSystemMessage(roomId, targets, SystemCode.MISSION_START, null);
	}

	// "히든미션 성공" 메시지 전송
	public void sendHiddenMissionSuccessMessage(String roomId) {
		sendSystemMessageToAll(roomId, SystemCode.MISSION_SUCCESS, null);
	}
	// 2. 게임 진행 끝

	// 3. 게임 종료
	// "게임종료" 메시지 전송
	public void sendGameEndMessage(String roomId) {
		sendSystemMessageToAll(roomId, SystemCode.GAME_END, null);
	}

	// "게임준비" 메시지 전송
	public void sendGameReadyMessage(String roomId) {
		sendSystemMessageToAll(roomId, SystemCode.GAME_READY, null);
	}
	// 3. 게임 종료 끝

}
