package com.a702.sarkem.model.game.dto;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@ToString
@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "in_game_role")
@Entity
@Data
@IdClass(InGameRolePK.class)
public class InGameRole{
 
	@Id
    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name="game_log_id", referencedColumnName = "idx")
    GameLog gameLog;
    
	@Id
    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name="role_code", referencedColumnName = "role_code")
    Role role;

    @Column(name = "role_cnt", nullable = false)
    private Integer roleCnt;
    
}