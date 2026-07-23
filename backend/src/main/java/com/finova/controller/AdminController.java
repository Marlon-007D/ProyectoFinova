package com.finova.controller;

import com.finova.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getSystemStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findAll().stream().filter(u -> Boolean.TRUE.equals(u.getEnabled())).count();
        long inactiveUsers = totalUsers - activeUsers;
        long adminUsers = userRepository.findAll().stream().filter(u -> "ADMIN".equals(u.getRole())).count();

        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("inactiveUsers", inactiveUsers);
        stats.put("adminUsers", adminUsers);

        return ResponseEntity.ok(stats);
    }
}
