package com.a702.sarkem.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Service;

import com.a702.sarkem.exception.GameRoomNotFoundException;
import com.a702.sarkem.model.chat.ChatMessage;
import com.a702.sarkem.model.chat.ChatMessage.MessageType;
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
import com.a702.sarkem.repo.GameLogRepository;
import com.a702.sarkem.repo.InGameRoleRepository;

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
	
	private final GameLogRepository gameLogRepository;
	private final InGameRoleRepository inGameRoleRepository;

	public ChannelTopic getGameTopic(String roomId) {
		return topics.get("GAME_" + roomId);
	}

	public ChannelTopic getChatTopic(String roomId) {
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
	 * 플레이어 연결 여부 업데이트
	 */
	public void updatePlayerSession(String roomId, String playerId) {
		GameSession gameSession = getGameSession(roomId);
		if (gameSession == null) return;
		Player player = gameSession.getPlayer(playerId);
		if (player == null) return;
		player.setLastUpdateTime(LocalDateTime.now());
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
		log.debug("createGameRoom - GameRoom : " + newGameRoom);
		
		if (!createGameSession(roomId)) {
			log.debug("게임세션 생성 실패");
			return;
		}

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
	 * 게임세션 생성
	 * 
	 * @param roomId
	 */
	public boolean createGameSession(String roomId) {
		GameRoom gameRoom = getGameRoom(roomId);
		if (gameRoom == null) return false;
		String newGameId = gameCodeGenerate(); // 새 게임 코드 획득
		GameSession prevGame = gameSessionMap.get(gameRoom.getGameId());
		GameSession newGame = null;
		if (prevGame != null) newGame = new GameSession(roomId, newGameId, prevGame.getGameOption()); // 새 게임 세션 생성
		else newGame = new GameSession(roomId, newGameId); // 새 게임 세션 생성
		gameRoom.setGameId(newGameId);
		gameSessionMap.put(newGameId, newGame);
		log.debug("createGameRoom - GameSession : " + newGame);
		return true;
	}

	// 플레이어 나가기
	public void deletePlayer(String roomId, String playerId) {
		GameRoom gameRoom = gameRoomMap.get(roomId);

		if (gameRoom == null) {
			log.debug(roomId + " 게임 룸 정보가 없습니다.");
			return;
		}
		gameRoom.deletePlayer(playerId);
		// 더 이상 게임 세션에 남은 인원이 없을 때
		if (gameRoom.getPlayerCount() == 0) {
			// gameRoom 정보와 redis topic 삭제
			gameRoomMap.remove(roomId);
			gameSessionMap.remove(roomId);
			topics.remove(getGameTopic(roomId));
			topics.remove(getChatTopic(roomId));
		} else if (getHostId(roomId).equals(playerId)) {
			String nextHost = gameRoom.getPlayersId().get(0);
			// 방장 변경하기
			setHostId(roomId, nextHost);
			sendChangeHostMessage(roomId, nextHost);
			sendNoticeMessageToPlayer(roomId, nextHost, "호스트가 귀하로 변경되었습니다.", PhaseType.NIGHT); // TODO ready페이즈로 변경해야함
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
		GameSession gameSession = getGameSession(roomId);
		// 방장과 플레이어 일치 여부 확인
		if (!room.getHostId().equals(playerId)) {
			return;
		}

		// 플레이어 수와 역할 수 일치 여부 확인
		String hostId = room.getHostId();

		// 회의 시간 변경
		int meetingTime = option.getMeetingTime();
		if (meetingTime < 15 || meetingTime > 180) {
			sendNoticeMessageToPlayer(roomId, hostId, "회의 시간은 15s ~ 180s 사이로 설정 가능합니다.", PhaseType.NIGHT); // TODO ready페이즈로 변경해야함
			return;
		}

		// session 변경
		gameSession.setMeetingTime(option.getMeetingTime());
		gameSession.setCitizenCount(option.getCitizenCount());
		gameSession.setSarkCount(option.getSarkCount());
		gameSession.setDoctorCount(option.getDoctorCount());
		gameSession.setPoliceCount(option.getPoliceCount());
		gameSession.setDetectiveCount(option.getDetectiveCount());
		gameSession.setPsychologistCount(option.getPsychologistCount());
		gameSession.setBullyCount(option.getBullyCount());

		//log.debug(gameSession.toString());
		sendGameOptionChangedMessage(roomId, option);
	}

	/**
	 * 현재 플레이어 수와 옵션에 설정된 직업의 수 일치 여부 확인
	 *
	 * @param roomId
	 * @return
	 */
	public boolean checkStartable(String roomId, String playerId) {
		// 플레이어 수와 역할 수 일치 여부 확인
		GameRoom room = gameRoomMap.get(roomId);
		GameSession gameSession = getGameSession(roomId);
		log.debug(room.toString());
		log.debug(gameSession.toString());
		if (room == null || gameSession == null) return false;

		int playerCount = room.getPlayerCount();
		int optionRoleCount = gameSession.getCitizenCount() + gameSession.getSarkCount() + gameSession.getDoctorCount()
				 + gameSession.getPoliceCount() + gameSession.getBullyCount()
				+ gameSession.getDetectiveCount() + gameSession.getPsychologistCount();

		// int optionRoleCount = gameSession.getTotalRoleCount();
		log.debug("플레이어 수 : " + playerCount + "\n 설정된 직업 수 : " + optionRoleCount);


		if (playerCount != optionRoleCount) {
			sendNoticeMessageToPlayer(roomId, playerId, "플레이어 수와 역할 수가 일치하지 않습니다.", PhaseType.NIGHT);// TODO ready페이즈로 변경해야함
			return false;
		} 
		// TODO: 테스트를 위해 아래 elif문 일단 주석, 나중에 주석 풀어야함
//		else if(playerCount<6) {
//			sendNoticeMessageToPlayer(roomId, playerId, "최소 6명 이상 플레이 가능합니다.", PhaseType.READY);
//			return false;
//		}
		// 삵이 한명인데 탐정이 있으면 안됨
		else if(gameSession.getSarkCount()==1&&gameSession.getDetectiveCount()>0) { 
			sendNoticeMessageToPlayer(roomId, playerId, "삵이 2명 이상일 때 탐정 직업을 가질 수 있습니다.", PhaseType.NIGHT);// TODO ready페이즈로 변경해야함
			return false;
		}
		// 삵이 아예 없으면 안됨
		else if(gameSession.getSarkCount()==0) { 
			sendNoticeMessageToPlayer(roomId, playerId, "삵이 1명 이상 있어야합니다.", PhaseType.NIGHT);// TODO ready페이즈로 변경해야함
			return false;
		}
		// 삵이 시민팀 수보다 많거나 같으면 안됨
		else if(gameSession.getSarkCount()>=(playerCount+1)/2) { 
			sendNoticeMessageToPlayer(roomId, playerId, "삵은 시민팀 수보다 적어야합니다.", PhaseType.NIGHT);// TODO ready페이즈로 변경해야함
			return false;
		}
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
		DBService dbService = new DBService(gameLogRepository, inGameRoleRepository);
		GameThread gameThread = new GameThread(this, dbService, gameRoom, gameSession, gameTopic, chatTopic);
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

		// 이미 셀렉티드를 했는데 다시 셀렉트 하려고 하면 안됨
		if(player.isTargetConfirmed()) return;

		if (newTargetPlayer == null) targetId = "";	// 타겟 플레이어를 찾지 못한 경우 targetId를 공백 문자열로 저장

		log.debug("selectTarget : " + player + "의 타겟은 " + newTargetPlayer);
		// 이전 대상과 현재 대상이 같은 경우 별도 행동 X
		if ( targetId.equals(player.getTarget()) ) return;

		// 낮 투표
		if(gameSession.getPhase().equals(PhaseType.DAY)) {
			// 지목 대상 투표수 업데이트
			if (newTargetPlayer != null) {
				newTargetPlayer.setVotedCnt(newTargetPlayer.getVotedCnt() + 1); // 현재 타겟이 받은 투표수++
			}

			// 이전 지목 대상 투표수 업데이트
			RolePlayer prevTarget = (RolePlayer) gameSession.getPlayer(player.getTarget());
			if ( prevTarget != null ) {
				prevTarget.setVotedCnt(prevTarget.getVotedCnt() - 1);
			}
			player.setTarget(targetId); // 현재 타겟 업데이트

			// 투표 현황 메시지 전송
			sendVoteSituationMessage(roomId, mergeTargets(gameSession.getAlivePlayers()));
		}

		// 밤 직업 별 투표
		// 투표하는 애들은 삵, 의사, 경찰, 심리학자, 냥아치
		if(gameSession.getPhase().equals(PhaseType.NIGHT)) {
			log.debug("밤 특수능력 대상 지목");

			GameRole role = player.getRole();	// 현재 플레이어의 직업

			// 삵인 경우 논의해서 하나만 투표
			if(role.equals(GameRole.SARK)) {
				// 히든미션이 발행됐는데 성공 못했으면 바로 리턴
				if(gameSession.isBHiddenMissionStatus() && !gameSession.isBHiddenMissionSuccess()) return;
				// 같은 직업(삵)을 가진 플레이어들의 타겟을 모두 업데이트
				for(RolePlayer sark : gameSession.getRolePlayers(GameRole.SARK)) {
					// 이미 투표 완료를 한 삵의 경우 다시 투표완료하라고 메시지 보내줘야함
					if(sark.isTargetConfirmed()) {
						sendNoticeMessageToPlayer(roomId, sark.getPlayerId(), "사냥 대상이 변경되었습니다.\n다시 대상 지목을 완료해주세요.", gameSession.getPhase());
						sark.setTargetConfirmed(false);	// 선택완료false해주기
					}
					// 삵들 타겟 동일하게 설정
					sark.setTarget(targetId);
				}
				// 투표 현황 메시지 전송(삵들한테만)
				HashMap<String, String> votingMap = new HashMap<>();
				votingMap.put("target", targetId);
				sendVoteSituationOnlyMessage(roomId, gameSession.getRolePlayersId(GameRole.SARK), votingMap);
			}else {
				// 나머지애들은 각자 투표
				player.setTarget(targetId); // 현재 타겟 업데이트..만 하면 될 듯?
			}
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
		if (rPlayer == null) {
			log.debug("selectedTarget - 플레이어ID를 찾을 수 없습니다. playerId : " + playerId);
			return;
		}

		String targetId = rPlayer.getTarget();

		if (gameSession.getDay() == 1 && gameSession.getPhase() == PhaseType.DAY && !"".equals(targetId)) {
			sendNoticeMessageToPlayer(roomId, playerId, "1일차 낮에는 추방 투표 대상을 선택할 수 없습니다.", gameSession.getPhase());
			return;
		}

		String targetNickname = "";
		RolePlayer targetPlayer = gameSession.getPlayer(targetId);
		if (targetPlayer != null) {
			targetNickname = targetPlayer.getNickname();
		}
		rPlayer.setTargetConfirmed(true);	// 대상 선택 완료

		HashMap<String, String> param = new HashMap<>();
		param.put("playerId", playerId);
		param.put("targetId", targetId);
		param.put("targetNickname", targetNickname);
		log.debug(param.toString());
		// 타겟 선택 완료 메시지 보내기
		// 낮, 밤(삵), 밤(나머지) 다르게 처리
		if(gameSession.getPhase().equals(PhaseType.DAY)) {
			sendTargetSelectionEndMessageToAll(roomId, param);
		}else if (gameSession.getPhase().equals(PhaseType.NIGHT)) {
			if(rPlayer.getRole().equals(GameRole.SARK)) {
				sendTargetSelectionEndMessages(roomId, gameSession.getRolePlayersId(GameRole.SARK), param);
			}else {
				sendTargetSelectionEndMessage(roomId, playerId, param);
			}
		}
	}

	// 추방 투표 처리
	public void expulsionVote(String roomId, String playerId, Map<String, Boolean> voteOX) {
		GameSession gameSession = getGameSession(roomId);
		Boolean voteResult = voteOX.get("result");

		RolePlayer player = gameSession.getPlayer(playerId);
		if (player == null) {
			log.debug("expulsionVote - playerID를 찾을 수 없습니다. playerId : " + playerId);
			return;
		}

		// 투표완료
		player.setTargetConfirmed(true);
		// 추방 투표 찬성수 ++
		if (voteResult) {
			gameSession.addExpulsionVoteCnt();
		}
		// 추방 투표 현황 전송
		sendTwilightSelectionEndMessage(roomId, playerId, voteOX);
	}

	/**
	 * 히든미션 처리
	 *
	 */

	// 히든미션 있는지 여부 지정
	public void hiddenMissionOccur(String roomId) {
		GameSession gameSession = getGameSession(roomId);
		// 30% 확률로 히든미션 발생
		Random rnd=new Random();
		int num = rnd.nextInt(10); // 0<=num<10
		if(num<3) gameSession.setBHiddenMissionStatus(true);
	}
	
	// 히든 미션 성공 시
	public void hiddenMissionSuccess(String roomId) {
		GameSession gameSession = getGameSession(roomId);
		sendHiddenMissionSuccessMessage(roomId); // 성공 메시지 보내고
		sendNoticeMessageToAll(roomId, "삵이 히든미션을 성공했습니다.", gameSession.getPhase()); // 노티스메시지도 보내고
		gameSession.setBHiddenMissionSuccess(true);
		gameSession.setHiddenMissionSuccessCnt(gameSession.getHiddenMissionSuccessCnt()+1);
	}
	
	
	/**
	 * 특정 플레이어 중도 퇴장 시 사망처리 및 메시지 전달
	 * @param roomId
	 * @param playerId
	 */
    public void leaveGame(String roomId, String playerId) {
        log.info(playerId + "님이 게임 진행 중 접속을 종료하셨습니다.");
        GameSession gameSession = getGameSession(roomId);
        RolePlayer leavePlayer = gameSession.getPlayer(playerId);
        if (leavePlayer == null) {
            log.debug(playerId + " 유저가 게임에 존재하지 않습니다.");
            return;
        }
        leavePlayer.setAlive(false);
        deletePlayer(roomId, playerId);
        log.info(playerId + "'s isAlive: " + leavePlayer.isAlive());
        sendLeaveGameMessage(roomId, playerId);
    }
	
	// 게임 종료시 보내는 직업정보 key값 nickname, job/ value에 list로 닉네임리스트, 직업리스트(한글)을 담아보낸다
	public void jobDiscolse(String roomId) {
		GameSession gameSession = getGameSession(roomId);
		List<String> nickname = new ArrayList<>();
		List<String> job = new ArrayList<>();
		List<String> role = new ArrayList<>();
		Map<String, List<String>> param = new HashMap<>();
		for (RolePlayer rp : gameSession.getPlayers()) {
			nickname.add(rp.getNickname());
			switch (rp.getRole()) {
			case CITIZEN: 
				job.add("시민");
				role.add("CITIZEN");
				break;
			case SARK: 
				job.add("삵");
				role.add("SARK");
				break;
			case DOCTOR: 
				job.add("수의사");
				role.add("DOCTOR");
				break;
			case POLICE: 
				job.add("경찰");
				role.add("POLICE");
				break;
			case PSYCHO: 
				job.add("심리학자");
				role.add("PSYCHO");
				break;
			case BULLY: 
				job.add("냥아치");
				role.add("BULLY");
				break;
			case DETECTIVE: 
				job.add("탐정");
				role.add("DETECTIVE");
				break;
			}
		}
		param.put("nickname", nickname);
		param.put("job", job);
		param.put("role", role);
		log.debug(param.toString());
		sendJobDiscloseMessage(roomId, param);
	}
	
	public void endGame(String roomId, GameRole winTeam) {
		GameSession gameSession = getGameSession(roomId);
		Map<String, String> winner = new HashMap<>();
		winner.put("winner", winTeam.toString());
		sendGameEndMessage(roomId, winner);
	}
	
	// 채팅 보내기
	public void chattingSend(ChatMessage chatMessage, String playerId) {
		String roomId = chatMessage.getRoomId();
		GameSession gameSession = getGameSession(roomId);
//		log.debug("룸아이디" + chatMessage.getRoomId());
		Player player = gameSession.getPlayer(playerId);
		log.debug("채팅 메시지" + chatMessage.toString());
		if (MessageType.ENTER == chatMessage.getType()) {
			log.debug(player.getNickname() + "채팅방 입장!!");
			chatMessage.setMessage(player.getNickname() + "님이 채팅방에 입장하셨습니다.");
        }
		else {
			log.debug(player.getNickname() + " 채팅 입력 " + chatMessage.toString());
		}
		sendChattingMessage(chatMessage);
	}
	
	
	/**
	 * 채팅 메시지를 전체에게 전송
	 * 
	 * @param roomId
	 * @param target
	 * @param code
	 * @param param
	 */
	public void sendChattingMessage(ChatMessage message) {
		log.debug("채팅 : " + message.getMessage());
		ChannelTopic chatTopic = getChatTopic(message.getRoomId());
		chatPublisher.publish(chatTopic, message);
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
		if(!code.equals(SystemCode.REMAIN_TIME)) {
			log.debug(systemMessage.toString());
		}
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
	// TODO
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
//		GameRoom gameRoom = gameRoomMap.get(roomId);
//		List<String> players = gameRoom.getPlayersId();
		sendSystemMessage(roomId, "ALL", code, param);
	}

	// 0. 공통기능
	/**
	 * "안내메시지" 메시지를 대상에게 전송
	 *
	 * @param playerId
	 * @param message
	 */
	public void sendNoticeMessageToPlayer(String roomId, String playerId, String message, PhaseType phase) {
		HashMap<String, String> param = new HashMap<>();
		param.put("message", message);
		param.put("phase", phase.toString());
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
	public void sendNoticeMessageToPlayers(String roomId, List<String> playersId, String message, PhaseType phase) {
		HashMap<String, String> param = new HashMap<>();
		param.put("message", message);
		param.put("phase", phase.toString());
		sendSystemMessage(roomId, playersId, SystemCode.NOTICE_MESSAGE, param);
	}

	/**
	 * "안내메시지" 메시지를 모두에게 전송
	 *
	 * @param message
	 */
	public void sendNoticeMessageToAll(String roomId, String message, PhaseType phase) {
		HashMap<String, String> param = new HashMap<>();
		param.put("message", message);
		param.put("phase", phase.toString());
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
	
	// "남은 시간" 메시지 전송
	public void sendRemainTime(String roomId, Map<String, Integer> param) {
		sendSystemMessageToAll(roomId, SystemCode.REMAIN_TIME, param);
	}
	// 1. 게임 로비 끝

	// 2. 게임 진행
	// "대상선택" 메시지 전송(낮)
	public void sendTargetSelectionMessageToAll(String roomId, Map<String, Integer> param) {
		sendSystemMessageToAll(roomId, SystemCode.TARGET_SELECTION, param);
	}
	// "대상선택" 메시지 전송(밤)
	public void sendTargetSelectionMessages(String roomId, List<String> playerIds) {
		sendSystemMessage(roomId, playerIds, SystemCode.TARGET_SELECTION, null);
	}

	// "대상선택 종료" 메시지 전송 (전체-낮투표)
	public void sendTargetSelectionEndMessageToAll(String roomId, Map<String, String> selected) {
		sendSystemMessageToAll(roomId, SystemCode.TARGET_SELECTION_END, selected);
	}

	// "대상선택 종료" 메시지 전송 (삵들-밤투표)
	public void sendTargetSelectionEndMessages(String roomId, List<String> playerIds, Map<String, String> selected) {
		sendSystemMessage(roomId, playerIds, SystemCode.TARGET_SELECTION_END, selected);
	}

	// "대상선택 종료" 메시지 전송 (개인-특수직업들 개인 밤투표)
	public void sendTargetSelectionEndMessage(String roomId, String playerId, Map<String, String> selected) {
		sendSystemMessage(roomId, playerId, SystemCode.TARGET_SELECTION_END, selected);
	}

	// "역할배정" 메시지 전송
	public void sendRoleAssignMessage(String roomId) {
		GameSession gameSession = getGameSession(roomId);
		List<RolePlayer> rPlayers = gameSession.getPlayers();
		Map<String, Object> param = new HashMap<>();
		// 마피아 리스트 만들기
		// 직업 확인 했을 때 마피아면 롤+마피아리스트 같이 보내기
		List<String> sarkList = gameSession.getRolePlayersId(GameRole.SARK);
		for (RolePlayer rp : rPlayers) {
			param.put("role", rp.getRole());
			if(rp.getRole().equals(GameRole.SARK)) {
				param.put("sark", sarkList);
//				log.debug("삵 리스트" + param.toString());
			}
			sendSystemMessage(roomId, rp.getPlayerId(), SystemCode.ROLE_ASSIGNED, param);
		}
	}

	// "낮 페이즈" 메시지 전송
	public void sendDayPhaseMessage(String roomId, Map<String, Integer> param) {
		sendSystemMessageToAll(roomId, SystemCode.PHASE_DAY, param);
	}

	// "저녁 페이즈" 메시지 전송
	public void sendTwilightPhaseMessage(String roomId, HashMap<String, String> expulsionPlayer) {
		sendSystemMessageToAll(roomId, SystemCode.PHASE_TWILIGHT, expulsionPlayer);
	}

	// "저녁(추방) 투표 시작" 메시지 전송
	public void sendTwilightSelectionMessage(String roomId) {
		sendSystemMessageToAll(roomId, SystemCode.TWILIGHT_SELECTION, null);
	}

	// "밤 페이즈" 메시지 전송
	public void sendNightPhaseMessage(String roomId) {
		sendSystemMessageToAll(roomId, SystemCode.PHASE_NIGHT, null);
	}

	// "낮 투표 종료" 메시지 전송
	public void sendEndDayVoteMessage(String roomId, HashMap<String, String> expulsionPlayer) {
		sendSystemMessageToAll(roomId, SystemCode.DAY_VOTE_END, expulsionPlayer);
	}

	// "추방 투표 종료(개인)" 메시지 전송
	public void sendTwilightSelectionEndMessage(String roomId, String playerId, Map<String, Boolean> param) {
		sendSystemMessage(roomId, playerId, SystemCode.TWILIGHT_SELECTION_END, param);
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
	public void sendHuntedMessage(String roomId, Map<String, String> deadPlayer) {
		sendSystemMessageToAll(roomId, SystemCode.BE_HUNTED, deadPlayer);
	}

	// "투표현황" 메시지 전송
	public void sendVoteSituationMessage(String roomId, Map<String, Integer> votedSituation) {
		sendSystemMessageToAll(roomId, SystemCode.VOTE_SITUATION, votedSituation);
	}

	// "밤 투표현황" 대상자들(삵들)한테만 메시지 전송 **
	public void sendVoteSituationOnlyMessage(String roomId, List<String> players, Map<String, String> votingSituation) {
		sendSystemMessage(roomId, players, SystemCode.VOTE_SITUATION, votingSituation);
	}

	// "심리분석 시작" 메시지 전송 *
	public void sendPsychoStartMessage(String roomId, String playerId, Map<String, String> target) {
		sendSystemMessage(roomId, playerId, SystemCode.PSYCHOANALYSIS_START, target);
	}

	// "협박당함" 메시지 전송 *
	public void sendThreatingMessage(String roomId, String playerId) {
		sendSystemMessage(roomId, playerId, SystemCode.BE_THREATED, null);
	}

	// "히든미션 시작" 메시지 전송 **
	public void sendHiddenMissionStartMessage(String roomId, List<String> sarkPlayers, Map<String, Integer> hMissionIdx) {
		sendSystemMessage(roomId, sarkPlayers, SystemCode.MISSION_START, hMissionIdx);
	}

	// "히든미션 성공" 메시지 전송
	public void sendHiddenMissionSuccessMessage(String roomId) {
		sendSystemMessageToAll(roomId, SystemCode.MISSION_SUCCESS, null);
	}
	// 2. 게임 진행 끝

	// 3. 게임 종료
	// "직업공개" 메시지 전송
	public void sendJobDiscloseMessage(String roomId, Map<String, List<String>> job) {
		sendSystemMessageToAll(roomId, SystemCode.JOB_DISCLOSE, job);
	}
	// "게임종료" 메시지 전송
	public void sendGameEndMessage(String roomId, Map<String, String> param) {
		sendSystemMessageToAll(roomId, SystemCode.GAME_END, param);
	}

	// "게임준비" 메시지 전송
	public void sendGameReadyMessage(String roomId) {
		sendSystemMessageToAll(roomId, SystemCode.GAME_READY, null);
	}
	// 3. 게임 종료 끝

	// 특정 유저 게임 퇴장 메시지 전송
	public void sendLeaveGameMessage(String roomId, String playerId) {
		sendSystemMessageToAll(roomId, SystemCode.LEAVE_PLAYER, playerId);
	}

	// 방장 변경 메시지 전송
	public void sendChangeHostMessage(String roomId, String playerId) {
		sendSystemMessage(roomId, playerId, SystemCode.CHANGE_HOST, null);
	}
}
