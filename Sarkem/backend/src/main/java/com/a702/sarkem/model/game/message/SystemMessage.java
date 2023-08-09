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
		DAY_VOTE_END	, // 낮 투표 종료
		TWILIGHT_SELECTION, // 저녁(추방) 투표 시작
		TWILIGHT_SELECTION_END, // 추방 투표 종료(개인)
		TWILIGHT_VOTE_END, // 저녁 투표 종료(전체 투표 종료)
		VOTE_SITUATION	, // 투표 현황
		PSYCHOANALYSIS_START, // 심리분석 시작
		BE_THREATED		, // 협박상태 시작
		MISSION_START	, // 히든미션 시작
		MISSION_SUCCESS, // 히든미션 성공
		TARGET_SELECTION, // 대상 선택
		TARGET_SELECTION_END, // 대상 선택 종료
		                  // 추방 투표 종료
		NOTICE_MESSAGE	, // 메세지 출력
		ROLE_ASSIGNED   , // 역할배정
		OPTION_CHANGED	, // 게임방 설정 변경
		JOB_DISCLOSE 	, // 직업 공개
		REMAIN_TIME		, // 남은 시간
		
		// 에러 코드
		ONLY_HOST_ACTION, // 방장이 아닌 사용자 액션
	}

	private SystemCode code;
	private String roomId;
	private String playerId;
	private Object param;
}
