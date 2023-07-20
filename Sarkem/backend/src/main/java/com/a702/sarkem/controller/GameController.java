package com.a702.sarkem.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.a702.sarkem.model.game.ActionMessage;
import com.a702.sarkem.model.game.SystemMessage;
import com.a702.sarkem.service.GameManager;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
public class GameController {

	private final GameManager gameManager;
	
    /**
     * websocket "game/action"으로 들어오는 메시징을 처리한다.
     */
	@MessageMapping("game/action")
	public void message(ActionMessage message) {
		
	}
}
