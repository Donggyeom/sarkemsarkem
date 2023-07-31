package com.a702.sarkem.model.game.dto;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class GameOptionDTO implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private int citizenCount;
	private int sarkCount;
	private int policeCount;
	private int doctorCount;
	private int bullyCount;
	private int psychologistCount;
	private int detectiveCount;
	private int meetingTime;
	
}