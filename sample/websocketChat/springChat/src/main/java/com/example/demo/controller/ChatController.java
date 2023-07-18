package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ChatRoom;
import com.example.demo.service.ChatService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/chat")
public class ChatController {

	private final ChatService chatService;
	
	//방생성
	@PostMapping
	public ChatRoom createRoom (@RequestParam String name) {
		return chatService.createRoom(name);
	}
	
	//전체 방 조회
	@GetMapping
	public List<ChatRoom> findAllRoom(){
		return chatService.findAllRoom();
	}
	
}
