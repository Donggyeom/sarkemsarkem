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
@Table(name = "role")
@Entity
public class Role{
 
    @Id
    @Column(name = "role_code")
    private Integer roleCode;
	
	
    @Column(name = "role_name",length = 20, nullable = false)
    private String roleName;
    

    @Column(nullable = false)
    private Integer team;
    
}