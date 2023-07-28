package com.a702.sarkem.model.game;

import java.io.Serializable;

import org.springframework.data.annotation.Id;

import com.a702.sarkem.model.game.GameSession.PhaseType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Vote implements Serializable {

	@Id
	private String playerId;

	private PhaseType phase;

	private String vote;

	private boolean confirm;

	public static Vote builder(String playerId, PhaseType phase) {
		return new VoteBuilder().playerId(playerId).phase(phase).vote(null).confirm(false).build();
	}
}
