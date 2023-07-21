package com.a702.sarkem.model.game;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class GameSession {
	public enum Phase {
		READY, DAY, TWILIGHT, NIGHT, END
	}
	
	private String gameId;
	private List<PlayerCondition> playerConditions;
	private Phase phase;
	private int meetingTime;
	private int round;
	private boolean bHiddenMissionStatus;
	private boolean bHiddenMissionSuccess;
	
	public GameSession(String gameId) {
		this.gameId = gameId;
		this.playerConditions = new ArrayList<>(); 
		this.phase = Phase.READY;
		this.meetingTime = 60;
		this.round = 0;
	}
	
}
