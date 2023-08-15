package com.a702.sarkem.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.a702.sarkem.model.game.GameSession;
import com.a702.sarkem.model.gameroom.GameRoom;
import com.a702.sarkem.model.player.Player;
import com.a702.sarkem.service.GameManager;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
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
		// Openvidu Session
		SessionProperties properties = SessionProperties.fromJson(params).build();
		Session session = openvidu.createSession(properties);

		String roomId = (String) params.get("customSessionId");

		if (roomId == null || roomId.equals("undefined"))
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

		if (gameManager.getGameRoom(roomId) != null)
			return new ResponseEntity<>(HttpStatus.CONFLICT);

		// Game Session
		gameManager.createGameRoom(roomId);
		log.info(roomId + "방이 생성되었습니다.");
		return new ResponseEntity<String>(roomId, HttpStatus.OK);
	}

	// 방 획득 retrieveGameRoom
	@GetMapping("/api/game/{roomId}")
	public ResponseEntity<GameRoom> retrieveGameRoom(@PathVariable("roomId") String roomId,
			@RequestBody(required = false) Map<String, Object> params)
			throws OpenViduJavaClientException, OpenViduHttpException {
//		Session session = openvidu.getActiveSession(roomId);
//		if (session == null) {
//			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//		}
		log.debug("방 획득이 요청되었습니다.");
		GameRoom room = gameManager.getGameRoom(roomId);
		if (room == null) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<>(gameManager.getGameRoom(roomId), HttpStatus.OK);
	}

	// 게임 세션 생성 createGameSession
	@PostMapping("/api/game/session/{roomId}")
	public ResponseEntity<?> createGameSession(@PathVariable("roomId") String roomId) {

		GameRoom gameRoom = gameManager.getGameRoom(roomId);
		// Game Session
		if (gameRoom == null || !gameManager.createGameSession(roomId)) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		String gameId = gameRoom.getGameId();
		log.info(gameId + "게임세션이 생성되었습니다.");
		return new ResponseEntity<>(gameId, HttpStatus.OK);
	}

	// 게임세션 획득 retrieveGameSession
	@GetMapping("/api/game/session/{roomId}")
	public ResponseEntity<?> retrieveGameSession(@PathVariable("roomId") String roomId,
			@RequestBody(required = false) Map<String, Object> params) {

		GameSession gameSession = gameManager.getGameSession(roomId);
		if (gameSession == null) {
			log.debug("retrieveGameSession - 게임세션 획득 실패 roomId : " + roomId);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}

		if (gameSession.getPhase() != GameSession.PhaseType.READY) {
			log.debug("이미 게임이 실행 중입니다 roomId : " + roomId);
			log.debug(gameSession.toString());
			return new ResponseEntity<>(HttpStatus.ALREADY_REPORTED);
		}

		Map<String, Object> data = new HashMap<String, Object>();
		data.put("roomId", roomId);
		data.put("gameId", gameSession.getGameId());
		data.put("gameOption", gameSession.getGameOption());
		return new ResponseEntity<>(data, HttpStatus.OK);
	}

	// 방 접속 connectRoom(@RequestParam String roomId, Player player)
	@PostMapping("/api/game/{roomId}/player")
	public ResponseEntity<?> connectRoom(@PathVariable("roomId") String roomId, @RequestBody String nickName)
			throws OpenViduJavaClientException, OpenViduHttpException {
		Session session = openvidu.getActiveSession(roomId);

		// 해당 roomId에 대한 세션이 없을 시 return;
		if (session == null)
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);

		// 토큰 발급
		String token = getConnectionToken(session, paramMap);
		String playerId = token.split("token=")[1]; // 토큰 앞부분 삭제
		Player player = new Player(playerId, nickName, LocalDateTime.now());

		log.debug(player.toString());

		System.out.println(roomId + " " + playerId);
		// 해당 게임 세션에 player 연결
		if (gameManager.connectPlayer(roomId, player)) {

			log.info(nickName + "님이 " + roomId + "에 접속합니다.");

			Map<String, String> data = new HashMap<>();
			data.put("token", token);
			data.put("playerId", playerId);
			data.put("nickName", nickName);
			data.put("hostId", gameManager.getHostId(roomId));

			return new ResponseEntity<>(data, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
		}
	}

	// 게임방 모든 유저 정보 조회
	@GetMapping("/api/game/{roomId}/player")
	public ResponseEntity<List<Player>> retrieveGamePlayers(@PathVariable("roomId") String roomId,
			@RequestBody(required = false) Map<String, Object> params)
			throws OpenViduJavaClientException, OpenViduHttpException {
		Session session = openvidu.getActiveSession(roomId);
		if (session == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		System.out.println(gameManager.getGameRoom(roomId).getPlayers());
		log.info("전체유저 정보가 조회되었습니다.");
		return new ResponseEntity<>(gameManager.getGameRoom(roomId).getPlayers(), HttpStatus.OK);
	}

	// 게임방 자신 정보 조회
	@GetMapping("/api/game/{roomId}/player/{playerId}")
	public ResponseEntity<Player> retrieveGamePlayer(@PathVariable("roomId") String roomId,
			@PathVariable("playerid") String playerId) throws OpenViduJavaClientException, OpenViduHttpException {
		Session session = openvidu.getActiveSession(roomId);
		if (session == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		Player player = gameManager.getGameRoom(roomId).getPlayer(playerId);
		return new ResponseEntity<>(player, HttpStatus.OK);
	}

	// 게임방 나갔을때
	@DeleteMapping("/api/game/{roomId}/player/{playerId}")
	public void exitGame(@PathVariable("roomId") String roomId, @PathVariable("playerId") String playerId) {
		gameManager.deletePlayer(roomId, playerId);

		log.info(playerId + "님이" + playerId + "룸에서 퇴장합니다.");
	}

	// 토큰 생성하기&가져오기
	public String getConnectionToken(Session session, Map<String, Object> params)
			throws OpenViduJavaClientException, OpenViduHttpException {
		ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
		Connection connection = session.createConnection(properties);
		return connection.getToken();
	}

	// TEST:
	@PostMapping("/test/gameroom")
	public void testCreateGameRoom() {
		gameManager.createGameRoom("testroom");
	}
}
