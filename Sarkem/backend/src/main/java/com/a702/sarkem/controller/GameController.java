package com.a702.sarkem.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.a702.sarkem.model.chat.ChatMessage;
import com.a702.sarkem.model.game.ActionMessage;
import com.a702.sarkem.model.game.SystemMessage;
import com.a702.sarkem.redis.GamePublisher;
import com.a702.sarkem.service.GameManager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Controller
public class GameController {
	
	private static final Logger log = LoggerFactory.getLogger(GameController.class);

	private final GameManager gameManager;
	
	/**
     * websocket "game/action"으로 들어오는 유저 액션 메시지를 처리한다.
     */
	@MessageMapping("/game/action")
	public void message(ActionMessage message) {
		log.debug(message.toString());
        
	}
	
	/**
     * websocket "game/chat"으로 들어오는 채팅 메시지를 처리한다.
     */
	@MessageMapping("/game/chat")
	public void message(ChatMessage message) {
		log.debug(message.toString());
        
		
	}
}
