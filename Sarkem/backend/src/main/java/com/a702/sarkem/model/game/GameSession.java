package com.a702.sarkem.model.game;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

	@NonNull
	private final String roomId;
	@NonNull
	private String gameId;
	private List<RolePlayer> players;
	private int meetingTime;
	private int day;
	private PhaseType phase;
	private LocalDateTime startTime;
	private LocalDateTime finishedTime;
	private boolean bHiddenMissionStatus;
	private boolean bHiddenMissionSuccess;
	
	public GameSession(String roomId, String gameId) {
		this.roomId = roomId;
		this.gameId = gameId;
		this.players = new ArrayList<>(10); 
		this.phase = PhaseType.READY;
		this.meetingTime = 60;
		this.day = 0;
	}
	
	public int getMafiaCount() {
		// TODO: 마피아 수 반환
		return 0;
	}
}