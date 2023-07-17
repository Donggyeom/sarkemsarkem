package com.ssafy.sarkem.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class RedisConfig {
	@Bean
    public RedisConnectionFactory redisConnectionFactory() {
        LettuceConnectionFactory lettuceConnectionFactory = new LettuceConnectionFactory();
        return lettuceConnectionFactory;
    }
	
	@Bean
	public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
	    RedisTemplate<String, Object> template = new RedisTemplate<>();
	    template.setConnectionFactory(connectionFactory);	    
	    
//	     string type 저장시 아래 설정 적용됨.
	    template.setKeySerializer(new StringRedisSerializer());
	    template.setValueSerializer(new StringRedisSerializer());
	    
	    // repository 에서 저장시 hash type으로 저장되므로, 아래 설정 적용됨.
	    template.setHashKeySerializer(new StringRedisSerializer());
	    template.setHashValueSerializer(new StringRedisSerializer());
	    return template;
	}
}
