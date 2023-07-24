package com.a702.sarkem.exception;

public class GameRoomNotFoundException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public GameRoomNotFoundException() {
		super("게임방을 찾을 수 없습니다.");
	}
	
	public GameRoomNotFoundException(String msg) {
		super(msg);
	}

}
