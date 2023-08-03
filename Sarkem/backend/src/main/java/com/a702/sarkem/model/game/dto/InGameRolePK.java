package com.a702.sarkem.model.game.dto;


import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Getter
@Setter
public class InGameRolePK implements Serializable{
	private Integer gameLog;
    private Integer role;
}
