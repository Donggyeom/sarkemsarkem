package com.a702.sarkem.model.player;

import org.springframework.data.redis.core.RedisHash;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@Setter
@RedisHash("PlayerConditon")
@Builder

public class PlayerCondition {

	private final String playerId; // 아이디

	private final String nickname; // 닉네임
	
	private GameRole role; // 배정받은 역할

	private boolean alive; // 살았는지 여부

}
