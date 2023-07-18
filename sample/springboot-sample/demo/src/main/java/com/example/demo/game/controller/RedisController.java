package com.example.demo.game.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.game.domain.ChatMessage;
import com.example.demo.game.domain.Product;
import com.example.demo.game.repo.ProductRepository;
import com.example.demo.game.service.RedisPubService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class RedisController {

	private final RedisPubService redisPubService;
	
	@Autowired
    private RedisTemplate<String, String> redisTemplate;
	
	@Autowired
	private ProductRepository productRepo;
 
    @PostMapping("redisTest")
    public ResponseEntity<?> addRedisKey(@RequestBody Product newProduct) {
    	
    	productRepo.save(newProduct);
    	
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @PutMapping("redisTest/{key}")
	public ResponseEntity<?> putRedisKey(@PathVariable String key, @RequestBody Product newProduct) {
//    	Product old = productRepo.findById(key).orElseThrow(RuntimeException::new);
//    	product.changePrice(15000L);
    	productRepo.save(newProduct);
    	return new ResponseEntity<>(HttpStatus.OK);
    }
 
    @GetMapping("redisTest/{key}")
    public ResponseEntity<?> getRedisKey(@PathVariable String key) {
//        ValueOperations<String, String> vop = redisTemplate.opsForValue();
//        String value = vop.get(key);
    	Product product = productRepo.findById(key).orElseThrow(RuntimeException::new);
    	
        return new ResponseEntity<>(product, HttpStatus.OK);
    }
    
    @PostMapping("api/chat")
    public ResponseEntity<?> pubSub(@RequestBody ChatMessage chatMessage) {
        //메시지 보내기
        redisPubService.sendMessage(chatMessage);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
