package com.a702.sarkem.model.game.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@ToString
@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "game_log")
@Entity
public class GameLog extends DateTime{
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //MySQL의 AUTO_INCREMENT를 사용
    private Integer idx;
 
    @Column(name = "game_code",length = 20, nullable = false)
    private String gameCode;
    
    @Column(name = "room_code",length = 20, nullable = false)
    private String roomCode;

    @Column(name = "user_cnt",nullable = false)
    private Integer userCnt;
    
    @Column(name = "meeting_time",nullable = false)
    private Integer meetingTime;
    
    @Column(name = "turn_number",nullable = false)
    private Integer turnNumber;
    
    @Column(name = "win_team", nullable = false)
    private int winTeam;
    
    @Column(length = 40, nullable = false)
    private String version;
    
    @Column(name = "hidden_cnt",nullable = false)
    private Integer hiddenCnt;
    
    @Column(name = "hidden_success_cnt",nullable = false)
    private Integer hiddenSuccessCnt;
}