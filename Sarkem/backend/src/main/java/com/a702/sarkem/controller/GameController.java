package com.a702.sarkem.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.a702.sarkem.model.GameOptionDTO;
import com.a702.sarkem.model.chat.ChatMessage;
import com.a702.sarkem.model.game.message.ActionMessage;
import com.a702.sarkem.model.game.message.SystemMessage;
import com.a702.sarkem.redis.GamePublisher;
import com.a702.sarkem.service.GameManager;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Slf4j
@RequiredArgsConstructor
@Controller
public class GameController {

	private final ObjectMapper objectMapper;

	private final GameManager gameManager;
	
	/**
     * websocket "game/action"으로 들어오는 유저 액션 메시지를 처리한다.
     */
	@MessageMapping("/game/action")
	public void message(ActionMessage message) {
		log.debug(message.toString());
		
		switch(message.getCode()) {
		case GAME_START:
			gameManager.gameStart("testroom");
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
