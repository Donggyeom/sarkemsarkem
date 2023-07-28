package com.a702.sarkem.service;

import java.util.*;

import com.a702.sarkem.model.player.GameRole;
import com.a702.sarkem.model.player.Player;
import com.a702.sarkem.model.player.RolePlayer;
import org.springframework.data.redis.listener.ChannelTopic;

import com.a702.sarkem.exception.GameOptionSettingException;
import com.a702.sarkem.model.GameOptionDTO;
import com.a702.sarkem.model.game.GameSession;
import com.a702.sarkem.model.game.NightVote;
import com.a702.sarkem.model.game.message.SystemMessage.SystemCode;
import com.a702.sarkem.model.gameroom.GameRoom;

public class GameThread extends Thread {
	private static GameManager gameManager;
	private GameRoom gameRoom;
	private GameSession gameSession;
	private ChannelTopic gameTopic;
	private ChannelTopic chatTopic;
	private String roomId;
	
	public GameThread(GameManager gameManager, GameRoom gameRoom, GameSession gameSession, ChannelTopic gameTopic,
			ChannelTopic chatTopic) {
		GameThread.gameManager = gameManager;
		this.gameRoom = gameRoom;
		this.gameSession = gameSession;
		this.gameTopic = gameTopic;
		this.chatTopic = chatTopic;
	}

	// CITIZEN, SARK, DOCTOR, POLICE, OBSERVER, PSYCHO, ACHI, DETECTIVE
	int CITIZEN = 0;
	int SARK = 1;
	

	@Override
	public void run() {
		// TODO: 게임 로직 구현
		// "게임시작" 메시지 전송
		roomId = gameRoom.getRoomId();
		gameManager.sendGameStartMessage(roomId);
		// 역할배정
		assignRole();

		// 게임 진행
		while (true) {
			// 게임종료 검사
			if (isGameEnd())
				break;
			// 낮 페이즈
			convertPhaseToDay();

			// 투표타임 타이머

			// 낮페이즈 끝나면
			// 저녁 페이즈 => 추방투표 시작
			convertPhaseToTwilight();
			// 투표타임 타이머

			// 저녁 페이즈 끝나면
			// 게임종료 검사
			if (isGameEnd())
				break;
			// 밤 페이즈 (탐정, 심리학자, 냥아치, 의사, 경찰 대상 지정 / 삵들 대상 지정)
			convertPhaseToNight();
		}

		// 게임 종료 메시지 전송
		gameManager.sendGameEndMessage(roomId);
		// 게임 결과 DB저장
	}

	// 역할배정
	private void assignRole() {
		int playerCnt = gameRoom.getPlayerCount();

		// 현재 설정된 직업 정보를 불러온다.
		List<GameRole> roles = gameSession.getAllRoles();
		Collections.shuffle(roles);

		List<Player> players = gameRoom.getPlayers();
		List<RolePlayer> rPlaysers = new ArrayList<>(6);
		for (int i = 0; i < playerCnt; i++) {
			Player player = players.get(i);
			String playerId = player.getPlayerId();
			String nickName = player.getNickname();
			GameRole role = roles.get(i);
			rPlaysers.add(new RolePlayer(playerId, nickName, role));
		}
		gameSession.setPlayers(rPlaysers);

		// 역할배정 메시지 전송
		gameManager.sendRoleAsignMessage(roomId);
	}

	// 낮 페이즈
	private void convertPhaseToDay() {
		// "낮 페이즈" 메시지 전송
		gameManager.sendDayPhaseMessage(roomId);
		// "대상 선택" 메시지 전송
		gameManager.sendTargetSelectionMessage(roomId);

		// 심리학자 기능 시작(표정분석 API)

		// 냥아치 협박 기능 시작(오픈비두 마이크 강종)

	}

	// 저녁 페이즈
	private void convertPhaseToTwilight() {
		// "저녁 페이즈" 메시지 전송 => 추방투표 시작
		gameManager.sendTwilightPhaseMessage(roomId);
		// 대상이 있으면 저녁투표 시작
		// 대상 없다면
		if (gameSession.getExpultionTargetId() == null || "".equals(gameSession.getExpultionTargetId())) {
			// 대상 없다 노티스메시지 보내기
			gameManager.sendNoticeMessageToAll(roomId, "추방할 대상이 없습니다.");
			return;
		}
		gameManager.sendTwilightVoteMessage(roomId);
	}

	// 밤 페이즈
	private void convertPhaseToNight() {
		// "밤 페이즈" 메시지 전송
		gameManager.sendNightPhaseMessage(roomId);
		
	}

	// 게임 종료
	private boolean isGameEnd() {
		int aliveSark = 0;
		int aliveCitizen = 0;
		for (RolePlayer rPlayer : gameSession.getPlayers()) {
			if (rPlayer.getRole().equals(GameRole.SARK) && rPlayer.isAlive()) {
				aliveSark++;
			} else if (rPlayer.isAlive()) {
				aliveCitizen++;
			}
		}
		// 마피아수>=시민수 => 마피아 win
		if (aliveSark >= aliveCitizen) {
			gameSession.setWinTeam(2);
			return true;
		}
		// 마피아수==0 => 시민 win
		if (aliveSark == 0) {
			gameSession.setWinTeam(3);
			return true;
		}
		return false;
	}

	// 밤 투표 받아온거 정리
	private void nightVote(NightVote nightVote) {

		String deadPlayerId = nightVote.getSarkVoted(); // 삵이 투표해서 죽은 플래이어 아이디
		String protectedPlayerId = nightVote.getDoctorVoted(); // 의사가 투표해서 지켜진 플래이어 아이디
		String suspectPlayerId = nightVote.getPoliceVoted(); // 경찰이 투표해서 조사받을 플래이어 아이디
		String slientPlayerId = nightVote.getAchiVoted(); // 냥아치가 투표해서 조용해야 할 플래이어 아이디

		// 의사가 살렸을 경우 부활
		if (deadPlayerId != null && deadPlayerId.equals(protectedPlayerId)) {
			deadPlayerId = null;
		}

//		SystemMessage message = new SystemMessage(roomId, SystemCode.BE_HUNTED, deadPlayerId);
//		gamePublisher.publish(gameTopic, message);
	}
}
