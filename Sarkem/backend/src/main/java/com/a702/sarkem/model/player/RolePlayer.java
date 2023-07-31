package com.a702.sarkem.model.player;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RolePlayer extends Player {
	
	private GameRole role; 	// 배정받은 역할
	private boolean alive = true; 	// 살았는지 여부
	private String target;	// 지정한 플레이어
	private boolean targetConfirmed;	// 지정 플레이어 확정
	private int votedCnt;	// 받은 투표 수
	
	public RolePlayer(String playerId, String nickname, GameRole role) {
		super(playerId, nickname);
		this.role = role;
	}
}
