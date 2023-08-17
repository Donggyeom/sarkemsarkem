package com.a702.sarkem.service;

import org.springframework.stereotype.Service;

import com.a702.sarkem.model.game.GameSession;
import com.a702.sarkem.model.game.dto.GameLog;
import com.a702.sarkem.model.game.dto.InGameRole;
import com.a702.sarkem.model.game.dto.Role;
import com.a702.sarkem.repo.GameLogRepository;
import com.a702.sarkem.repo.InGameRoleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DBService {

	private final GameLogRepository gameLogRepository;
	private final InGameRoleRepository inGameRoleRepository;

	public void InsertGameResult(GameSession gameSession) {

		final GameLog gameLog = GameLog.builder().gameCode(gameSession.getGameId()).roomCode(gameSession.getRoomId())
				.userCnt(gameSession.getPlayers().size()).meetingTime(gameSession.getMeetingTime())
				.turnNumber(gameSession.getDay()).winTeam(gameSession.getWinTeam()).version("1.0.0")
				.hiddenCnt(gameSession.getHiddenMissionCnt()).hiddenSuccessCnt(gameSession.getHiddenMissionSuccessCnt())
				.build();
		gameLogRepository.save(gameLog);

		int[] roles = gameSession.getRoles();
		int i = -1;
		for (int p : roles) {
			i++;
			if (p == 0)
				continue;
			final Role role = Role.builder().roleCode(i).build();
			final InGameRole inGameRole = InGameRole.builder().gameLog(gameLog).role(role).roleCnt(p).build();
			inGameRoleRepository.save(inGameRole);
		}
	}
}
