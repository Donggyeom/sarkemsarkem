package com.a702.sarkem.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.a702.sarkem.model.game.GameSession;

public interface GameSessionRedisRepository extends CrudRepository<GameSession, String> {
	List<GameSession> findByCreatorEmail(String email);

	@Override
	List<GameSession> findAll();
}
