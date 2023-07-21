package com.example.sarkem.model.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GameSessionLeaveReq {
	private String nickname;
	private String userId;
}
