package com.a702.sarkem.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import com.a702.sarkem.model.game.GameSession.PhaseType;
import com.a702.sarkem.model.game.Vote;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
@Repository
public class VoteRedisRepository {
	private final RedisTemplate<String, Vote> redisTemplate;
	private HashOperations<String, String, Vote> opsHashVote;
	private static final String key = "Vote";

	@PostConstruct
	private void init() {
		opsHashVote = redisTemplate.opsForHash();
	}

	public Map<String, Vote> startVote(List<String> players, PhaseType phase) {
		Map<String, Vote> voteResult = new HashMap<String, Vote>();

		players.forEach((playerId) -> {
			Vote vote;
			if (!isExist(playerId)) {
				vote = Vote.builder(playerId, phase);
			} else {
				vote = getVote(playerId);
			}

			updateVote(playerId, vote);
		});
		return voteResult;
	}

	public void removeVote(String playerId) {
		deleteVote(playerId);
	}

	public boolean isExist(String playerId) {
		return opsHashVote.hasKey(key, playerId);
	}

	public Vote getVote(String playerId) {
		return opsHashVote.get(key, playerId);
	}

	public void vote(String playerId, String vote) {
		Vote voteDao = getVote(playerId);
		voteDao.setVote(vote);
		updateVote(playerId, voteDao);
	}

	public boolean confirmVote(String playerId) {
		Vote voteDao = getVote(playerId);
		if (!voteDao.isConfirm()) {
			voteDao.setConfirm(true);
			updateVote(playerId, voteDao);
			return true;
		}
		return false;
	}

	public Map<String, Vote> getVoteResult(List<String> players) {
		Map<String, Vote> voteResult = new HashMap<String, Vote>();
		players.forEach(playerId -> {
			voteResult.put(playerId, getVote(playerId));
		});
		return voteResult;
	}

	public void endVote(List<String> players, PhaseType phase) {
		players.forEach((playerId) -> {
			Vote voteDao = getVote(playerId);
			if (voteDao.getPhase() == phase) {
				deleteVote(playerId);
			}
		});
	}

	private void updateVote(String playerId, Vote voteDao) {
		opsHashVote.put(key, playerId, voteDao);
	}

	private void deleteVote(String playerId) {
		opsHashVote.delete(key, playerId);
	}
}
