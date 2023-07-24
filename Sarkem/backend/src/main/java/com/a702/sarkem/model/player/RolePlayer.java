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
	
	private GameRole role = GameRole.OBSERVER; 	// 배정받은 역할
	private boolean alive = true; 				// 살았는지 여부
	
	public RolePlayer(String playerId, String nickname) {
		super(playerId, nickname);
	}
}
