package com.a702.sarkem.model.game.message;

import java.io.Serializable;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class ActionMessage implements Serializable {

	// 액션 코드
	public enum ActionCode {
		ENTER,					// 게임방 입장
		OPTION_CHANGE,			// 게임 설정 변경 
		GAME_START,             // 게임시작
		TARGET_SELECT,          // 대상 선택
		TARGET_SELECTED,        // 대상 선택 종료
		EXPULSION_VOTE,         // 추방 투표
		HIDDENMISSION_SUCCESS,   // 히든 미션 성공

		LEAVE_GAME			// 유저 중도 퇴장
	}

	private ActionCode code;
	private String roomId;
	private String gameId;
	private String playerId;
	private Object param;
	
}
