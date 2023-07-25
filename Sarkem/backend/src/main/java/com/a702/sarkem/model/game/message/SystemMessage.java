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
public class SystemMessage implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public enum SystemCode {
		GAME_READY      , // 게임준비 
		GAME_START      , // 게임시작 
		PHASE_DAY       , // 낮 페이즈 
		PHASE_TWILIGHT  , // 저녁 페이즈 
						  // 밤 페이즈 
		                  // 게임종료
		BE_EXCLUDED     , // 추방당함
		BE_HUNTED		, // 사냥당함
		                  // 채팅방 접속
		DAY_VOTE		, // 투표 현황
		NIGHT_VOTE		, // 밤 투표 현황
		                  // 심리분석 시작
		BE_THREATED		, // 협박상태 시작
		                  // 히든미션 시작
		                  // 히든미션 성공
		                  // 대상 선택
		                  // 추방 투표 종료
		                  // 메세지 출력
		                  // 역할배정
		                  // 게임방 설정 변경
	}

	private String roomId;
	private String code;
	private Object body;
	public SystemMessage(String roomId, SystemCode code, Object param) {
		super();
		switch(code) {
		case GAME_READY:
			this.roomId = roomId;
			this.code = "GAME_READY";
			this.body = param;
			break;
		case GAME_START:
			this.roomId = roomId;
			this.code = "GAME_START";
			this.body = param;
			break;
		}
	}
}
