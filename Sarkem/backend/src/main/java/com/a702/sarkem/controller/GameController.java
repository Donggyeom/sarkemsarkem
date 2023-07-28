package com.a702.sarkem.controller;

import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.a702.sarkem.model.GameOptionDTO;
import com.a702.sarkem.model.chat.ChatMessage;
import com.a702.sarkem.model.game.message.ActionMessage;
import com.a702.sarkem.model.game.message.SystemMessage.SystemCode;
import com.a702.sarkem.service.GameManager;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Slf4j
@RequiredArgsConstructor
@Controller
public class GameController {

	private final GameManager gameManager;
	
	/**
     * websocket "game/action"으로 들어오는 유저 액션 메시지를 처리한다.
     */
	@MessageMapping("/game/action")
	public void message(ActionMessage actionMessage) {
		log.debug(actionMessage.toString());
		String roomId = actionMessage.getRoomId();
		String gameId = actionMessage.getGameId();
		String playerId = actionMessage.getPlayerId();
		Object param = actionMessage.getParam();
		ObjectMapper mapper = new ObjectMapper();
		
		switch(actionMessage.getCode()) {
		// 게임시작
		case GAME_START:
			if ( !gameManager.isHost(roomId, playerId) ) {
				// 방장이 아닌 사용자에게 에러 메세지 전송
				gameManager.sendSystemMessage(roomId, playerId, SystemCode.ONLY_HOST_ACTION, null);
			} //else if (!gameManager.checkStartable(roomId)){
				// 시작 가능 여부 확인
//				gameManager.sendNoticeMessageToPlayer(roomId, playerId, "플래이어 수와 역할 수가 일치하지 않습니다.");
//			}
			// 게임 실행
			else gameManager.gameStart(roomId);
			break;
		// 추방투표
		case EXPULSION_VOTE:
			Map<String, Boolean> voteOX = mapper.convertValue(param, Map.class);
			gameManager.expulsionVote(roomId, voteOX);
			break;
		// 히든미션 성공
		case HIDDENMISSION_SUCCESS:
			break;
		// 게임 설정 변경
		case OPTION_CHANGE:
			GameOptionDTO gameOption = mapper.convertValue(param,GameOptionDTO.class);
			gameManager.gameOptionChange(roomId, actionMessage.getPlayerId(), gameOption);
			break;
		// 대상 선택
		case TARGET_SELECT:
			Map<String, String> selectTarget = mapper.convertValue(param, Map.class);
			gameManager.selectTarget(roomId, playerId, selectTarget);
			break;
		// 대상 선택 종료
		case TARGET_SELECTED:
			gameManager.selectedTarget(roomId, playerId);
			break;
		default:
			break;
		}
	}
	
	/**
     * websocket "game/chat"으로 들어오는 채팅 메시지를 처리한다.
     */
	@MessageMapping("/game/chat")
	public void message(ChatMessage message) {
		log.debug(message.toString());
        
		
	}
}
