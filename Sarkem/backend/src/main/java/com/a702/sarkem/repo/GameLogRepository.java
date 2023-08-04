package com.a702.sarkem.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.a702.sarkem.model.game.dto.GameLog;

public interface GameLogRepository extends JpaRepository<GameLog, Integer>{

}