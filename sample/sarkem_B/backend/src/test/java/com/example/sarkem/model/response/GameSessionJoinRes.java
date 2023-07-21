package com.example.sarkem.model.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@RequiredArgsConstructor
public class GameSessionJoinRes {
	  private final PlayerJoinRoomState state;
	  private final String token;
	  private final String playerId;
	  private final String nickname;
	  
	  public GameSessionJoinRes(PlayerJoinRoomState state, Player player) {
		  this.state = state;
		  this
	  }
}
