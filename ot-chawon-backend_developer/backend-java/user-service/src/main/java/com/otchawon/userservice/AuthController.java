package com.otchawon.userservice;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class AuthController {

    @PostMapping("/auth/login")
    public Map<String, Object> login(@RequestBody Map<String, String> payload) {
        return Map.of("success", true, "data", Map.of("accessToken", "mock-token"), "message", "ok", "traceId", "mock-trace");
    }

    @GetMapping("/users/me")
    public Map<String, Object> me() {
        return Map.of("success", true, "data", Map.of("id", 1, "email", "user@otchawon.com"), "message", "ok", "traceId", "mock-trace");
    }
}
