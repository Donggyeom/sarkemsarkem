package com.a702.sarkem.model.game;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.a702.sarkem.model.player.Player;
import com.a702.sarkem.model.game.dto.GameOptionDTO;
import com.a702.sarkem.model.player.GameRole;
import com.a702.sarkem.model.player.RolePlayer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@Builder
@ToString
@AllArgsConstructor
public class GameSession {
	
	public enum PhaseType {
		READY, DAY, TWILIGHT, NIGHT
	}

	// 게임방 현황
	@NonNull
	private final String roomId;
	@NonNull
	private String gameId;
	private List<RolePlayer> players;
	
	// 게임 옵션
	private int citizenCount;
	private int sarkCount;
	private int policeCount;
	private int doctorCount;
	private int bullyCount;
	private int psychologistCount;
	private int detectiveCount;
	private int meetingTime;
	
	// 게임 현황
	private int day;
	private PhaseType phase;
	private LocalDateTime startTime;
	private LocalDateTime finishedTime;
	private boolean bHiddenMissionStatus;
	private boolean bHiddenMissionSuccess;
	private int expulsionVoteCnt; // 추방 투표 수
	private int winTeam; // 0: 진행 중 , 1: 삵 승리 , 2: 시민 승리
	
	public GameSession(String roomId, String gameId) {
		this.roomId = roomId;
		this.gameId = gameId;
		this.players = new ArrayList<>(10); 
		this.phase = PhaseType.READY;
		this.meetingTime = 60;
		this.day = 0;
		this.winTeam = 0;
	}
	
	public int nextDay() {
		return ++day;
	}
	
	public int addExpulsionVoteCnt() {
		return ++expulsionVoteCnt;
	}
	
	/**
	 * 총 역할 수 반환
	 * @return 총 역할 수 
	 */
	public int getTotalRoleCount() {
		return citizenCount + sarkCount + policeCount + doctorCount + bullyCount + psychologistCount + detectiveCount;
	}

	public int [] getRoles() {
		return new int[]{citizenCount, sarkCount, policeCount, doctorCount, bullyCount, psychologistCount, detectiveCount};
	}
	
	public RolePlayer getPlayer(String playerId) {
		for(RolePlayer p : this.players) {
			if (p.getPlayerId().equals(playerId)) {
				return p;
			}
		}
		return null;
	}
	
	// 게임 옵션 반환
	public GameOptionDTO getGameOption() {
		GameOptionDTO gameOption = new GameOptionDTO();
		gameOption.setBullyCount(bullyCount);
		gameOption.setCitizenCount(citizenCount);
		gameOption.setDetectiveCount(detectiveCount);
		gameOption.setDoctorCount(doctorCount);
		gameOption.setMeetingTime(meetingTime);
		gameOption.setPoliceCount(policeCount);
		gameOption.setPsychologistCount(psychologistCount);
		gameOption.setSarkCount(sarkCount);
		return gameOption;
	}

	// 현재 옵션으로 설정된 역할을 리스트로 반환
	public List<GameRole> getAllRoles() {
		List<GameRole> roles = new ArrayList<>();
		for (int i = 0; i < this.citizenCount; i++) 		roles.add(GameRole.CITIZEN);
		for (int i = 0; i < this.sarkCount; i++) 			roles.add(GameRole.SARK);
		for (int i = 0; i < this.policeCount; i++) 			roles.add(GameRole.POLICE);
		for (int i = 0; i < this.doctorCount; i++) 			roles.add(GameRole.DOCTOR);
		for (int i = 0; i < this.bullyCount; i++) 			roles.add(GameRole.BULLY);
		for (int i = 0; i < this.psychologistCount; i++) 	roles.add(GameRole.PSYCHO);
		for (int i = 0; i < this.detectiveCount; i++) 		roles.add(GameRole.DETECTIVE);

		return roles;
	}

	public int getMafiaCount() {
		// TODO: 마피아 수 반환
		return 0;
	}
}