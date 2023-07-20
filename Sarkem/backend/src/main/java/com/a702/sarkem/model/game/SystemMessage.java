package com.a702.sarkem.model.game;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SystemMessage {
	
	public enum SystemCode {
		GAME_READY      , // 게임준비 
		GAME_START      , // 게임시작 
		PHASE_DAY       , // 낮 페이즈 
		PHASE_TWILIGHT  , // 저녁 페이즈 
						  // 밤 페이즈 
		                  // 게임종료
		BE_EXCLUDED     , // 추방당함
		                  // 사냥당함
		                  // 채팅방 접속
		                  // 투표 현황
		                  // 심리분석 시작
		                  // 협박상태 시작
		                  // 히든미션 시작
		                  // 히든미션 성공
		                  // 대상 선택
		                  // 추방 투표 종료
		                  // 메세지 출력
		                  // 역할배정
		                  // 게임방 설정 변경
	}

	private String roomId;
	private SystemCode code;
	private Object message;
	public SystemMessage(SystemCode code, Object message) {
		super();
		this.code = code;
		this.message = message;
	}
}
