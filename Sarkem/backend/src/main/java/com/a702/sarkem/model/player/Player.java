package com.a702.sarkem.model.player;

import org.springframework.data.redis.core.RedisHash;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@Setter
@RedisHash("Player")
@Builder
public class Player {

	private final String playerId; // 아이디

	private final String nickname; // 닉네임

}
