package com.dhanyasetu.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate;

    @PostMapping("/predict-price")
    public ResponseEntity<Object> predictPrice(@RequestBody Map<String, Object> body) {
        try {
            Object result = restTemplate.postForObject(aiServiceUrl + "/predict-price", body, Object.class);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(503).body(Map.of("message", "AI service unavailable."));
        }
    }

    @GetMapping("/model-info")
    public ResponseEntity<Object> modelInfo() {
        try {
            Object result = restTemplate.getForObject(aiServiceUrl + "/model-info", Object.class);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(503).body(Map.of("message", "AI service unavailable."));
        }
    }
}
