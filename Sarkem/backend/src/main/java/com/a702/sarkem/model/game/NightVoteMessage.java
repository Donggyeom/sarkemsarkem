package com.a702.sarkem.model.game;

import java.util.Map;

import com.a702.sarkem.model.player.GameRole;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class NightVoteMessage {
	private String roomId;
	private Map<GameRole, String> roleVoteResult;
}
