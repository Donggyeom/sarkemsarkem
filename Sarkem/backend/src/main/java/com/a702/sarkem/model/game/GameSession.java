package com.a702.sarkem.model.game;

import java.time.LocalDateTime;
import java.util.List;

import com.a702.sarkem.common.util.TimeUtils;
import com.a702.sarkem.model.player.GameRole;
import com.a702.sarkem.model.player.PlayerCondition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Setter
@Getter
@Builder
@Slf4j
@AllArgsConstructor
public class GameSession {
	public enum StateType {
		GAME_READY, GAME_START
	}

	public enum PhaseType {
		PHASE_DAY, PHASE_TWILIGHT, PHASE_NIGHT
	}

	@NonNull
	private final String roomId;

	private int day;

	private int phaseCount;

	private boolean isNight;

	private int aliveSark;

	private int alivePlayer;

	private LocalDateTime timer;

	private List<String> mafias;

	@NonNull
	private StateType state;

	@NonNull
	private PhaseType phase;

	@NonNull
	private LocalDateTime createdTime;

	@NonNull
	private LocalDateTime finishedTime;

	@NonNull
	private String lastEnter;

	@NonNull
	private String sessionId;

	@NonNull
	private String hostId;

	//추방
	public void banishPlayer(PlayerCondition playerCondition) {
		alivePlayer--;
		if (playerCondition.getRole() == GameRole.SARK) {
			aliveSark--;
		}
	}

	public void changePhase(PhaseType phase, int timer) {
		this.phase = phase;
		this.phaseCount++;
		setTimer(TimeUtils.getFinTime(timer));
	}

	public void passADay() {
		this.day++;
	}
}
