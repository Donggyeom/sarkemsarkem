package com.a702.sarkem.model.game.dto;

import java.time.LocalDateTime;

import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@MappedSuperclass
@SuperBuilder
@NoArgsConstructor
public class DateTime {
	
	private LocalDateTime date;
	
	@PrePersist // 데이터 생성이 이루어질때 사전 작업
	public void prePersist() {
		this.date = LocalDateTime.now();
	}
}
