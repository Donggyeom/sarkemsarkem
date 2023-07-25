package com.a702.sarkem.repo;

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

//	private final RedisTemplate<String, Vote> redisTemplate;
//	private HashOperations<String, String, Vote> opsHashVote;
//	private static final String key = "Vote";
//
//	@PostConstruct
//	private void init() {
//		opsHashVote = redisTemplate.opsForHash();
//	}
//
//	public Map<String, Vote> startVote(List<String> players, PhaseType phase) {
//
//		Map<String, Vote> voteResult = new HashMap<String, Vote>();
//
//		players.forEach((playerId) -> {
//			Vote vote;
//			if (!isExist(playerId)) {
//				vote = Vote.builder(playerId, phase);
//			} else {
//				vote = getVote(playerId);
//			}
//
//			updateVote(playerId, vote);
//		});
//		return voteResult;
//	}
//
//	public void removeVote(String playerId) {
//		deleteVote(playerId);
//	}
//
//
//	public void vote(String playerId, String voted) {
//		Vote vote = getVote(playerId);
//		vote.setVote(voted);
//		updateVote(playerId, vote);
//	}
//
//	public boolean confirmVote(String playerId) {
//		Vote vote = getVote(playerId);
//		if (!vote.isConfirm()) {
//			vote.setConfirm(true);
//			updateVote(playerId, vote);
//			return true;
//		}
//		return false;
//	}
//
//	public Map<String, Vote> getVoteResult(List<String> players) {
//		Map<String, Vote> voteResult = new HashMap<String, Vote>();
//		players.forEach(playerId -> {
//			voteResult.put(playerId, getVote(playerId));
//		});
//		return voteResult;
//	}
//
//	public void endVote(List<String> players, PhaseType phase) {
//		players.forEach((playerId) -> {
//			Vote vote = getVote(playerId);
//			if (vote.getPhase() == phase) {
//				deleteVote(playerId);
//			}
//		});
//	}
//
//	public boolean isExist(String playerId) {
//		return opsHashVote.hasKey(key, playerId);
//	}
//
//	public Vote getVote(String playerId) {
//		return opsHashVote.get(key, playerId);
//	}
//	
//	private void updateVote(String playerId, Vote vote) {
//		opsHashVote.put(key, playerId, vote);
//	}
//
//	private void deleteVote(String playerId) {
//		opsHashVote.delete(key, playerId);
//	}

}
