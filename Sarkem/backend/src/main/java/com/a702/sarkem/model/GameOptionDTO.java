package com.a702.sarkem.model;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class GameOptionDTO implements Serializable {
	
	private int citizenCount;
	private int sarkCount;
	private int policeCount;
	private int doctorCount;
	private int bullyCount;
	private int psychologistCount;
	private int detectiveCount;
	private int meetingTime;
	
	/**
	 * 총 역할 수 반환
	 * @return 총 역할 수 
	 */
	public int getTotalRoleCount() {
		return citizenCount + sarkCount + policeCount + doctorCount + bullyCount + psychologistCount + detectiveCount;
	}
}


//private static final int SARK			= 0;
//private static final int CITIZEN		= 1;
//private static final int POLICE			= 2;
//private static final int DOCTOR			= 3;
//private static final int BULLY			= 4;
//private static final int PSYCHOLOGIST	= 5;
//private static final int DETECTIVE		= 6;