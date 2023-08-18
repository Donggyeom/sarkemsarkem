package com.a702.sarkem.model.gameroom;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.a702.sarkem.model.player.Player;
import com.a702.sarkem.model.player.RolePlayer;
import com.a702.sarkem.service.GameManager;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

@Getter
@Setter
@ToString
@Slf4j
public class GameRoom {
	
	private final GameManager gameManager;
	
	private String roomId;
	private String gameId;
	private List<Player> players = new ArrayList<>(10);
	private String hostId;
	
	public GameRoom(GameManager gameManager, String roomId) {
		this.gameManager = gameManager;
		this.roomId = roomId;
	}
	
	/**
	 * 플레이어 수 리턴
	 * @return 플레이어 수
	 */
	public int getPlayerCount() {
		return getPlayers().size();
	}
	
	public Player getPlayer(String playerId) {
		for(Player p : this.players) {
			if (p.getPlayerId().equals(playerId)) {
				return p;
			}
		}
		return null;
	}
	
	public List<Player> getPlayers() {
		LocalDateTime sevenSecondsBefore = LocalDateTime.now().minusSeconds(7);
		for (Iterator<Player> itr = players.iterator(); itr.hasNext();) {
			Player p = itr.next();
			if (p.getLastUpdateTime().isBefore(sevenSecondsBefore)) {
				log.debug(p.toString() + " is Removed");
				gameManager.sendLeaveGameMessage(roomId, p.getPlayerId());
				itr.remove();
			}
		}
		return this.players;
	}
	
	public List<String> getPlayersId() {
		List<String> playersId = new ArrayList<>();
		for (Player player : this.players) {
			playersId.add(player.getPlayerId());
		}
		return playersId;
	}
	
	public void deletePlayer(String playerId) {
		for(Iterator<Player> itr = players.iterator(); itr.hasNext();) {
			Player p = itr.next();
			if(p.getPlayerId().equals(playerId)) {
				itr.remove();
				return;
			}
		}
	}
}
