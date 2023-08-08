package com.a702.sarkem.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.data.redis.listener.ChannelTopic;

import com.a702.sarkem.model.game.GameSession;
import com.a702.sarkem.model.game.GameSession.PhaseType;
import com.a702.sarkem.model.gameroom.GameRoom;
import com.a702.sarkem.model.player.GameRole;
import com.a702.sarkem.model.player.Player;
import com.a702.sarkem.model.player.RolePlayer;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class GameThread extends Thread {
	private static GameManager gameManager;
	private DBService dbService;
	private GameRoom gameRoom;
	private GameSession gameSession;
	private String roomId;
	private String gameId;
	private String nightResultNoticeMessage;
	private int meetingTime;
	private int nightTime;

	public GameThread(GameManager gameManager, GameRoom gameRoom, GameSession gameSession, ChannelTopic gameTopic,
			ChannelTopic chatTopic) {
		GameThread.gameManager = gameManager;
		this.gameRoom = gameRoom;
		this.gameSession = gameSession;
		this.roomId = gameRoom.getRoomId();
		this.gameId = gameRoom.getGameId();
		this.nightResultNoticeMessage = "";
		this.meetingTime = gameSession.getMeetingTime() * 1000;
		this.nightTime = 30 * 1000;
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

			// 낮 페이즈
			convertPhaseToDay();

			// 투표 결과 처리 및 낮 투표 종료 메시지 보내기
			RolePlayer maxVotedPlayer = dayVote();
			if (maxVotedPlayer == null) {
				maxVotedPlayer = new RolePlayer("", "", null);
			}

			// 가장 많은 투표수를 받은 플래이어를 추방 투표 대상으로 설정
			HashMap<String, String> expulsionPlayer = new HashMap<>();
			expulsionPlayer.put("targetId", maxVotedPlayer.getPlayerId());
			expulsionPlayer.put("targetNickname", maxVotedPlayer.getNickname());
			// 투표 결과 종합해서 낮 투표 종료 메시지 보내기
			gameManager.sendEndDayVoteMessage(roomId, expulsionPlayer);

			// 투표대상 없으면 저녁페이즈 건너뛰고 밤페이즈로 바로!!!!!!
			if (!maxVotedPlayer.getPlayerId().equals("")) {
				// 저녁 페이즈 => 추방투표 시작 / 추방 투표에 투표 대상자 보냄
				convertPhaseToTwilight(expulsionPlayer);
				
				// 추방 투표 결과 종합
				boolean voteResult = twilightVote(maxVotedPlayer);
				
				// 추방 투표 결과 전송, 저녁 페이즈 종료
				expulsionPlayer.put("result", Boolean.toString(voteResult));
				gameManager.sendEndTwilightVoteMessage(roomId, expulsionPlayer);
				
				// 실제로 추방하기
				if (voteResult) {
					maxVotedPlayer.setAlive(false);
//					maxVotedPlayer.setRole(GameRole.OBSERVER);
					// 추방 메시지 보내기
					gameManager.sendExcludedMessage(roomId, maxVotedPlayer.getPlayerId());
				}
			}

			// 게임종료 검사
			if (isGameEnd()) break;

			// 밤 페이즈 (탐정, 심리학자, 냥아치, 의사, 경찰 대상 지정 / 삵들 대상 지정)
			convertPhaseToNight();
			
			// 밤 사이 죽은 사람 있으면 처리
			List<RolePlayer> deadPlayers = nightVote();
			// 사망 대상이 없으면 
			if (deadPlayers.isEmpty()) {
				nightResultNoticeMessage = "밤사이 삵이 사냥에 실패했습니다.";
			}
			// 사망 대상이 있으면
			else {
				HashMap<String, String> deadPlayerMap = new HashMap<>();
				for (RolePlayer target : deadPlayers) {
					// 사냥당함 메시지 전송
					deadPlayerMap.put("deadPlayerId", target.getPlayerId());
					deadPlayerMap.put("deadPlayerNickname", target.getNickname());
					gameManager.sendHuntedMessage(roomId, deadPlayerMap);
					
					nightResultNoticeMessage = "밤사이에 " + target.getNickname() + "님이 삵에게 사냥당했습니다.";
				}
			}

			// 게임종료 검사
			if (isGameEnd()) break;
		}

		// 직업 정보 전송
		gameManager.jobDiscolse(roomId);
		
		
		// 게임 결과 DB저장
		dbService.InsertGameResult(gameSession);
		
	}

	// 역할배정
	private void assignRole() {
		// 현재 설정된 직업 정보를 불러온다.
		List<GameRole> roles = gameSession.getAllRoles();
		Collections.shuffle(roles);

		List<Player> players = gameRoom.getPlayers();
		int playerCnt = players.size();
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
		gameManager.sendRoleAssignMessage(roomId);
	}

	// 낮 페이즈
	private void convertPhaseToDay() {

		// 게임 세션 초기화
		int day = gameSession.nextDay();
		gameSession.setPhase(PhaseType.DAY);
		
		// "낮 페이즈" 메시지 전송
		Map<String, Integer> param = new HashMap<>();
		param.put("day", day);
		gameManager.sendDayPhaseMessage(roomId, param);

		// 밤에 누가 죽었는지, 아무도 안죽었는지 전체한테 노티스 메시지 보내기
		if (!"".equals(nightResultNoticeMessage)) {
			gameManager.sendNoticeMessageToAll(roomId, nightResultNoticeMessage, gameSession.getPhase());
		}
		
		// 경찰 기능: 대상 선택한 사람들 삵인지 여부 알려주기
		for (RolePlayer rp : gameSession.getRolePlayers(GameRole.POLICE)) {
			RolePlayer target = gameSession.getPlayer(rp.getTarget());
			if (target == null) continue;
			
			if (target.getRole().equals(GameRole.SARK)) {
				gameManager.sendNoticeMessageToPlayer(roomId, rp.getPlayerId(),
						target.getNickname() + "님은 삵이 맞습니다.", gameSession.getPhase());
			} else {
				gameManager.sendNoticeMessageToPlayer(roomId, rp.getPlayerId(),
						target.getNickname() + "님은 삵이 아닙니다.", gameSession.getPhase());
			}
		}

		// 심리학자 기능 시작(표정분석 API)
		for (RolePlayer rp : gameSession.getRolePlayers(GameRole.PSYCHO)) {
			RolePlayer target = gameSession.getPlayer(rp.getTarget());
			if (target == null) continue;
			
			HashMap<String, String> targetMap = new HashMap<>();
			targetMap.put("targetId", target.getPlayerId());
			targetMap.put("targetNickname", target.getNickname());
			gameManager.sendPsychoStartMessage(roomId, rp.getPlayerId(), targetMap);
		}

		// 냥아치 협박 기능 시작(오픈비두 마이크 강종)
		for (RolePlayer rp : gameSession.getRolePlayers(GameRole.BULLY)) {
			gameManager.sendThreatingMessage(roomId, rp.getTarget());
		}
		
		// 1일차에는 아래 기능 미실행
		if (gameSession.getDay() > 1) {

			// 히든미션 발생 여부 정하기
			gameManager.hiddenMissionOccur(roomId);

			// 히든미션 발생했으면 하라고 메시지 보내기
			if (gameSession.isBHiddenMissionStatus()) {
				Random rnd = new Random();
				int num = rnd.nextInt(5);
				HashMap<String, Integer> hMissionIdx = new HashMap<>();
				hMissionIdx.put("missionIdx", num);
				gameManager.sendHiddenMissionStartMessage(roomId, gameSession.getRolePlayersId(GameRole.SARK),
						hMissionIdx);
				gameSession.setHiddenMissionCnt(gameSession.getHiddenMissionCnt()+1);
			}

		}
		
		// 대상 선택 하기 전에 전체 플레이어 타겟, 대상 선택, 받은 투표수 초기화
		for (RolePlayer rp : gameSession.getPlayers()) {
			rp.setTarget("");
			rp.setTargetConfirmed(false);
			rp.setVotedCnt(0);
		}
		// "대상 선택" 메시지 전송
		param = new HashMap<>();
		param.put("day", gameSession.getDay());
		gameManager.sendTargetSelectionMessageToAll(roomId, param);
	}

	// 낮 투표 결과 종합
	private RolePlayer dayVote() {

		// 투표타임 타이머
		Thread dayVoteThread = new DayVoteThread();
		dayVoteThread.start();
		try {
			dayVoteThread.join(meetingTime);
		} catch (InterruptedException e) {
		}

		// 낮 투표결과 종합
		// 게임 세션에 추방 투표 대상 저장
		int max = 0; // 최다득표 수
		RolePlayer maxVotedPlayer = null; // 최다 득표자
		// 최다 득표 수, 최다 득표자 구하기
		for (RolePlayer r : gameSession.getPlayers()) {
			if (r.getVotedCnt() > max) {
				max = r.getVotedCnt();
				maxVotedPlayer = r;
			}
			else if (r.getVotedCnt() == max) {
				maxVotedPlayer = null;
			}
		}
		return maxVotedPlayer;
	}

	// 저녁 페이즈
	private void convertPhaseToTwilight(HashMap<String, String> expulsionPlayer) {
		// 저녁 페이즈로 변경
		gameSession.setPhase(PhaseType.TWILIGHT);
		// 투표 현황 초기화
		for (RolePlayer rp : gameSession.getPlayers()) {
			rp.setTarget("");
			rp.setTargetConfirmed(false);
			rp.setVotedCnt(0);
		}
		// "저녁 페이즈" 메시지 전송 => 추방투표 시작
		gameManager.sendTwilightPhaseMessage(roomId, expulsionPlayer);
		// 대상이 있으면 저녁투표 시작
		gameManager.sendTwilightSelectionMessage(roomId);
	}

	// 저녁 투표 결과 종합
	private boolean twilightVote(RolePlayer target) {
		
		// 투표타임 타이머
		Thread twilightVoteThread = new TwilightVoteThread();
		twilightVoteThread.start();
		try {
			twilightVoteThread.join(meetingTime);
		} catch (InterruptedException e) { }
		
		// 과반수 이상 찬성일 때 => 추방 대상자한테 메시지 보내기
		if (gameSession.getExpulsionVoteCnt() >= (gameSession.getPlayers().size() + 1) / 2) {
			return true;
			
		}
		
		return false;
	}

	// 밤 페이즈
	private void convertPhaseToNight() {
		// 밤 페이즈로 변경
		gameSession.setPhase(PhaseType.NIGHT);
		// 투표대상 없으면 저녁페이즈 건너뛰고 밤페이즈로 바로온거라, 노티스메시지 보내주기
		gameManager.sendNoticeMessageToAll(roomId, "추방할 대상이 없어 바로 밤이 되었습니다.", gameSession.getPhase());
		// 대상 선택 하기 전에 전체 플레이어 타겟, 대상 선택, 받은 투표수 초기화
		for (RolePlayer rp : gameSession.getPlayers()) {
			rp.setTarget("");
			rp.setTargetConfirmed(false);
			rp.setVotedCnt(0);
		}
		// "밤 페이즈" 메시지 전송
		gameManager.sendNightPhaseMessage(roomId);
		// 밤페이즈 됐다고 메시지 전송하면 프론트에서
		// 삵 제외 화면, 카메라, 마이크, 오디오 끄기
		// 탐정 오디오만 변조된 음성으로 켜기
		// (심리학자, 냥아치, 의사, 경찰, 삵 대상 지정) 하라고 해야함!!!
		List<String> votePlayers = new ArrayList<>(); // 여기에 밤투표 대상 직업 넣자
		for(RolePlayer rp: gameSession.getAlivePlayers()) {
			if(!rp.getRole().equals(GameRole.CITIZEN) && !rp.getRole().equals(GameRole.DETECTIVE)) {
				votePlayers.add(rp.getPlayerId());
			}
		}
		gameManager.sendTargetSelectionMessages(roomId, votePlayers);
	}

	// 밤 투표 결과 종합
	private List<RolePlayer> nightVote() {

		// 투표타임 타이머 : nightTime만큼 대기
		Thread nightVoteThread = new NightVoteThread();
		nightVoteThread.start();
		try {
			nightVoteThread.join();
		} catch (InterruptedException e) { }
		
		List<RolePlayer> sarkTarget = findTarget(GameRole.SARK);
		List<RolePlayer> doctorTarget = findTarget(GameRole.DOCTOR);
		List<RolePlayer> psychoTarget = findTarget(GameRole.PSYCHO);
		List<RolePlayer> bullyTarget = findTarget(GameRole.BULLY);
		// 의사 대상에 있는 삵 대상 삭제
		for (RolePlayer target : doctorTarget) {
			sarkTarget.remove(target);
		}
		
		// 사냥 대상 사망 처리
		for (RolePlayer target : sarkTarget) {
			target.setAlive(false);
//			target.setRole(GameRole.OBSERVER);
		}
		
		return sarkTarget;
	}

	// 해당 직업의 타겟 찾기 함수
	private List<RolePlayer> findTarget(GameRole role) {
		List<RolePlayer> players = gameSession.getRolePlayers(role);
		List<RolePlayer> targets = new ArrayList<>();
		for (RolePlayer rp : players) {
			String targetId = rp.getTarget();
			RolePlayer target = gameSession.getPlayer(targetId);
			if (target == null || !target.isAlive()) continue;
			
			targets.add(target);
		}
		return targets;
	}

	// 플레이어 투표 종료 여부 반환
	private boolean isPlayersVoteEnded() throws InterruptedException {
		List<RolePlayer> players = gameSession.getPlayers();
		int confirmCnt = 0;
		while (true) {
			confirmCnt = 0;
			for (RolePlayer p : players) {
				if (p.isTargetConfirmed())
					confirmCnt++;
			}
			// 투표가 모두 완료되면 종료
			if (confirmCnt == players.size())
				return true;

			sleep(500);
		}
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
		log.debug("삵 수: " + aliveSark + " / 시민 수: " + aliveCitizen);
		// 마피아수>=시민수 => 마피아 win
		if (aliveSark >= aliveCitizen) {
			gameManager.endGame(roomId, GameRole.SARK); // 게임 종료 메시지 전송
			gameSession.setWinTeam(1); // 게임 세션에 이긴 팀 저장
			return true;
		}
		// 마피아수==0 => 시민 win
		if (aliveSark == 0) {
			gameManager.endGame(roomId, GameRole.CITIZEN); // 게임 종료 메시지 전송
			gameSession.setWinTeam(2); // 게임 세션에 이긴 팀 저장
			return true;
		}

		return false;
	}

	class DayVoteThread extends Thread {
		@Override
		public void run() {
			// 투표 대기
			try {
				if (isPlayersVoteEnded())
					return;
			} catch (InterruptedException e) {
			}
		}
	}

	class TwilightVoteThread extends Thread {
		@Override
		public void run() {
			// 투표 대기
			try {
				if (isPlayersVoteEnded())
					return;
			} catch (InterruptedException e) {
			}
		}
	}

	class NightVoteThread extends Thread {
		@Override
		public void run() {
			try {
				// nightTime 만큼 대기
				sleep(nightTime);
			} catch (InterruptedException e) { }
		}
	}
}
