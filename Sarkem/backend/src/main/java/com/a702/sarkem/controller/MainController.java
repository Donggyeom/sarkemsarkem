package com.a702.sarkem.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.a702.sarkem.model.game.Player;
import com.a702.sarkem.model.gameroom.GameRoom;
import com.a702.sarkem.service.GameManager;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor@RestController
@CrossOrigin(origins = "*")
public class MainController {

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }
	
    Map paramMap = new HashMap<>();
    
    
	// gameManager
	private final GameManager gameManager;

	// 방 생성 createGameRoom
    @PostMapping("/api/game")
    public ResponseEntity<String> createGameRoom(@RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
    	//Openvidu Session
        SessionProperties properties = SessionProperties.fromJson(params).build();
        Session session = openvidu.createSession(properties);
        //Game Session
        gameManager.createGameRoom(session.getSessionId());
        String token = getConnectionToken(session, paramMap);
        System.out.println(token);
        System.out.println("하하하하하");
        return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
    }
    
    
	// 방 접속 connectRoom(@RequestParam String roomId, Player player)
    @PutMapping("/api/game/{roomId}")
    public ResponseEntity<String> connectRoom(@PathVariable("sessionId") String roomId,
                                                   String nickName)
                                                		   throws OpenViduJavaClientException, OpenViduHttpException{
    	Session session = openvidu.getActiveSession(roomId);
        if (session == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    	String token = getConnectionToken(session, paramMap);
    	Player player = null;
    	player.setNickname(nickName);
    	player.setPlayerId(token);
    	System.out.println(player);
    	gameManager.connectPlayer(roomId, player);
		return new ResponseEntity<>(HttpStatus.OK);
    }
    
    

	// 방 획득 retrieveGameRoom
    @GetMapping("/api/game/{roomId}")
    public ResponseEntity<GameRoom> retrieveGameRoom(@PathVariable("sessionId") String roomId,
                                                   @RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = openvidu.getActiveSession(roomId);
        if (session == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        System.out.println(gameManager.getGameRoom(roomId));
        return new ResponseEntity<>(gameManager.getGameRoom(roomId), HttpStatus.OK);
    }
    
    
    //토큰 생성하기&가져오기
    public String getConnectionToken(Session session, Map<String, Object> params) throws OpenViduJavaClientException, OpenViduHttpException{
    	ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        Connection connection = session.createConnection(properties);
        
        return connection.getToken();
    }
    
    
}
