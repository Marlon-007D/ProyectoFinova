package com.finova.controller;

import com.finova.entity.User;
import com.finova.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.security.Principal;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<User>> getAll(Pageable pageable) {
        return ResponseEntity.ok(userService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping
    public ResponseEntity<User> create(@Valid @RequestBody User user) {
        return new ResponseEntity<>(userService.save(user), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @Valid @RequestBody User user) {
        return ResponseEntity.ok(userService.update(id, user));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateStatus(@PathVariable Long id, @RequestParam boolean status) {
        return ResponseEntity.ok(userService.updateStatus(id, status));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMe(Principal principal) {
        return ResponseEntity.ok(userService.findByUsername(principal.getName()));
    }

    @PutMapping("/me/profile")
    public ResponseEntity<User> updateMyProfile(@RequestBody User userDetails, Principal principal) {
        return ResponseEntity.ok(userService.updateMyProfile(principal.getName(), userDetails));
    }

    @PutMapping("/me/preferences")
    public ResponseEntity<User> updateMyPreferences(@RequestBody User preferences, Principal principal) {
        return ResponseEntity.ok(userService.updateMyPreferences(principal.getName(), preferences));
    }

    @PutMapping("/me/suspend")
    public ResponseEntity<Void> suspendMyAccount(Principal principal) {
        userService.suspendMyAccount(principal.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMyAccount(Principal principal) {
        userService.deleteMyAccount(principal.getName());
        return ResponseEntity.noContent().build();
    }
}
