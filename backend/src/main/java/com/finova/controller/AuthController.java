package com.finova.controller;

import com.finova.dto.AuthRequest;
import com.finova.dto.AuthResponse;
import com.finova.entity.User;
import com.finova.repository.UserRepository;
import com.finova.security.CustomUserDetailsService;
import com.finova.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.DisabledException;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
        } catch (DisabledException e) {
            return ResponseEntity.badRequest().body("CUENTA_SUSPENDIDA");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Incorrect username or password");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        
        User user = userRepository.findByUsernameIgnoreCaseOrEmailIgnoreCase(authRequest.getUsername(), authRequest.getUsername()).orElse(null);

        return ResponseEntity.ok(new AuthResponse(jwt, user));
    }

    private String capitalize(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }
        return input.substring(0, 1).toUpperCase() + input.substring(1).toLowerCase();
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        user.setUsername(capitalize(user.getUsername()));
        
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken!");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already in use!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        if (user.getSecurityAnswer() != null) {
            user.setSecurityAnswer(passwordEncoder.encode(user.getSecurityAnswer().trim().toLowerCase()));
        }
        
        user.setRole("USER");
        user.setEnabled(true);
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam String username) {
        String capitalizedUsername = capitalize(username);
        boolean exists = userRepository.findByUsername(capitalizedUsername).isPresent();
        
        if (exists) {
            List<String> suggestions = new ArrayList<>();
            Random random = new Random();
            int attempts = 0;
            
            while (suggestions.size() < 3 && attempts < 20) {
                String suggestion = capitalizedUsername + (random.nextInt(900) + 100); // add random 100-999
                if (userRepository.findByUsername(suggestion).isEmpty()) {
                    suggestions.add(suggestion);
                }
                attempts++;
            }
            return ResponseEntity.ok(Map.of("exists", exists, "suggestions", suggestions));
        }
        
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean exists = userRepository.findByEmail(email).isPresent();
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    @GetMapping("/security-question")
    public ResponseEntity<?> getSecurityQuestion(@RequestParam String identifier) {
        User user = userRepository.findByUsernameIgnoreCaseOrEmailIgnoreCase(identifier, identifier).orElse(null);
        if (user != null) {
            return ResponseEntity.ok(Map.of("question", user.getSecurityQuestion() != null ? user.getSecurityQuestion() : ""));
        }
        return ResponseEntity.badRequest().body("Usuario no encontrado");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String identifier = request.get("identifier");
        String answer = request.get("answer");
        String newPassword = request.get("newPassword");

        if (identifier == null || answer == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Faltan campos obligatorios");
        }

        User user = userRepository.findByUsernameIgnoreCaseOrEmailIgnoreCase(identifier, identifier).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        if (user.getSecurityAnswer() == null || !passwordEncoder.matches(answer.trim().toLowerCase(), user.getSecurityAnswer())) {
            return ResponseEntity.badRequest().body("Respuesta de seguridad incorrecta");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Contraseña actualizada exitosamente"));
    }
}
