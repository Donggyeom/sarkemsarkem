package com.a702.sarkem.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.a702.sarkem.model.chat.ChatMessage;
import com.a702.sarkem.model.game.message.ActionMessage;
import com.a702.sarkem.model.game.message.SystemMessage.SystemCode;
import com.a702.sarkem.service.GameManager;

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
		switch(actionMessage.getCode()) {
		case GAME_START:
			if ( !gameManager.isHost(roomId, playerId) ) {
				String[] targets = new String[1];
				targets[0] = playerId;
				gameManager.sendSystemMessage(roomId, targets, SystemCode.ONLY_HOST_ACTION);
			}
			else gameManager.gameStart(roomId);
			break;
		case EXPULSION_VOTE:
			break;
		case HIDDENMISSION_SUCCESS:
			break;
		case OPTION_CHANGED:
			break;
		case TARGET_SELECT:
			break;
		case TARGET_SELECTED:
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
