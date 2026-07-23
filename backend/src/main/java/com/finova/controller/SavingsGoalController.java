package com.finova.controller;

import com.finova.entity.SavingsGoal;
import com.finova.service.SavingsGoalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/savings")
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;

    public SavingsGoalController(SavingsGoalService savingsGoalService) {
        this.savingsGoalService = savingsGoalService;
    }

    @GetMapping
    public ResponseEntity<List<SavingsGoal>> getAll(Principal principal) {
        return ResponseEntity.ok(savingsGoalService.findAllActiveByUsername(principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SavingsGoal> getById(@PathVariable Long id, Principal principal) {
        SavingsGoal savingsGoal = savingsGoalService.findById(id);
        if (!savingsGoal.getUser().getUsername().equals(principal.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(savingsGoal);
    }

    @PostMapping
    public ResponseEntity<SavingsGoal> create(@Valid @RequestBody SavingsGoal savingsGoal, Principal principal) {
        return new ResponseEntity<>(savingsGoalService.save(savingsGoal, principal.getName()), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SavingsGoal> update(@PathVariable Long id, @Valid @RequestBody SavingsGoal savingsGoal, Principal principal) {
        return ResponseEntity.ok(savingsGoalService.update(id, savingsGoal, principal.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Principal principal) {
        savingsGoalService.delete(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
