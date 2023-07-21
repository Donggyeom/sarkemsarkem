package com.a702.sarkem.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.a702.sarkem.service.GameManager;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MainController {
	
	 private final GameManager gameManager;
	
	// 방 생성  createGameRoom
	// TEST:
	@PostMapping("/test/gameroom")
	public void testCreateGameRoom() {
		gameManager.createGameRoom("testroom");
	}
	
	
	// 방 획득  retrieveGameRoom
	
	// 방 접속  connectRoom(@RequestParam String roomId, Player player)
	// gameManager.getGameRoom(roomId).connect(player)
}
