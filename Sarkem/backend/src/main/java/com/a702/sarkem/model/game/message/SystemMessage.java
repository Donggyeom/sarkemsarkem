package com.a702.sarkem.model.game.message;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class SystemMessage implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public enum SystemCode {
		// 시스템 코드
		GAME_READY      , // 게임준비 
		GAME_START      , // 게임시작 
		PHASE_DAY       , // 낮 페이즈 
		PHASE_TWILIGHT  , // 저녁 페이즈 
		PHASE_NIGHT  	, // 밤 페이즈 
		GAME_END        , // 게임종료
		BE_EXCLUDED     , // 추방당함
		BE_HUNTED		, // 사냥당함
		                  // 채팅방 접속
		END_DAY_VOTE	, // 낮 투표 종료
		END_NIGHT_VOTE	, // 밤 투표 종료
		CURRENT_VOTE	, // 투표 현황
		PSYCHO_START	, // 심리분석 시작
		BE_THREATED		, // 협박상태 시작
		HMISSION_START	, // 히든미션 시작
		HMISSION_SUCCESS, // 히든미션 성공
		TARGET_SELECT	, // 대상 선택
		TARGET_SELECTD	, // 대상 선택 종료
		                  // 추방 투표 종료
		NOTICE_MESSAGE	, // 메세지 출력
		ROLE_ASIGNED    , // 역할배정
		OPTION_CHANGED	, // 게임방 설정 변경
		
		// 에러 코드
		ONLY_HOST_ACTION, // 방장이 아닌 사용자 액션
	}

	private SystemCode code;
	private String roomId;
	private String playerId;
	private Object param;
}
