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

	public GameThread(GameManager gameManager, GameRoom gameRoom, GameSession gameSession
			, ChannelTopic gameTopic, ChannelTopic chatTopic) {
		GameThread.gameManager = gameManager;
		this.gameRoom = gameRoom;
		this.gameSession = gameSession;
		this.gameTopic = gameTopic;
		this.chatTopic = chatTopic;
	}

	//CITIZEN, SARK, DOCTOR, POLICE, OBSERVER, PSYCHO, ACHI, DETECTIVE
	int CITIZEN = 0;
	int SARK = 1;
	@Override
	public void run() {
		// TODO: 게임 로직 구현
		// "게임시작" 메시지 전송
		gameManager.sendGameStartMessage(gameRoom.getRoomId());
		// 역할배정
		assignRole();

		// 게임 진행
		while (true) {
			// 게임종료 검사
			if (isGameEnd()) break;
			// 낮 페이즈
			convertPhaseToDay();
			
			// 저녁 페이즈
			convertPhaseToTwilight();
			// 게임종료 검사
			if (isGameEnd()) break;
			
			// 밤 페이즈
			convertPhaseToNight();
		}
		
		// 게임 종료 메시지 전송
		// 게임 결과 DB저장
	}
	
	/**
	 * 게임 옵션 변경
	 * @param option
	 */
	private void gameOptionChange(GameOptionDTO option) {
		// 플레이어 수와 역할 수 일치 여부 확인
		int playerCount = gameRoom.getPlayerCount();
		int optionRoleCount = option.getTotalRoleCount();
		if (playerCount != optionRoleCount)
			throw new GameOptionSettingException("플레이어 수와 역할 수가 일치하지 않습니다.");

		// TODO: 역할 별 최소, 최대 수 검증 필요
		// 삵은 1~3까지만 설정 가능
		int sarkCount = option.getSarkCount();
		if (sarkCount < 0 || sarkCount > 3)
			throw new GameOptionSettingException("삵은 1 ~ 3 사이로 설정 가능합니다.");

		// 회의 시간 변경
		int meetingTime = option.getMeetingTime();
		if (meetingTime < 30 || meetingTime > 180)
			throw new GameOptionSettingException("회의 시간은 30s ~ 180s 사이로 설정 가능합니다.");

		// "게임 옵션 변경" 메시지 전송
	}
	
	// 
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
		gameManager.sendRoleAsignMessage(gameRoom.getRoomId());
	}
	// 낮 페이즈
	private void convertPhaseToDay() {
		// "낮 페이즈" 메시지 전송
	}
	// 저녁 페이즈
	private void convertPhaseToTwilight() {
		// "저녁 페이즈" 메시지 전송
	}
	// 밤 페이즈
	private void convertPhaseToNight() {
		// "밤 페이즈" 메시지 전송
	}
	// 게임 종료
	private boolean isGameEnd() {
		return true;
	}
	// 대상 지정
	private void updateTarget() {
		
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

//		SystemMessage message = new SystemMessage(gameRoom.getRoomId(), SystemCode.BE_HUNTED, deadPlayerId);
//		gamePublisher.publish(gameTopic, message);
	}
}

