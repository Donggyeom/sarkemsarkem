package com.a702.sarkem.model.gameroom;

import java.util.List;

import com.a702.sarkem.model.game.Player;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class GameRoom {
	private String roomId;
	private String gameId;
	private List<Player> players;
	private String hostId;
	
	public GameRoom(String roomId) {
		this.roomId = roomId;
	}
	
	/**
	 * 플레이어 수 리턴
	 * @return 플레이어 수
	 */
	public int getPlayerCount() {
		return players.size();
	}
}
