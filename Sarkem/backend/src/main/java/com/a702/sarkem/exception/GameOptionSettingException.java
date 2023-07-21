package com.a702.sarkem.exception;

public class GameOptionSettingException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public GameOptionSettingException() {
		super("게임 옵션 설정 중 에러가 발생하였습니다.");
	}
	
	public GameOptionSettingException(String msg) {
		super(msg);
	}
}
