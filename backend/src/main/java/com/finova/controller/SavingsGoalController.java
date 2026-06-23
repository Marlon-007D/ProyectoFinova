package com.finova.controller;

import com.finova.entity.SavingsGoal;
import com.finova.service.SavingsGoalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savings-goals")
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;

    public SavingsGoalController(SavingsGoalService savingsGoalService) {
        this.savingsGoalService = savingsGoalService;
    }

    @GetMapping
    public ResponseEntity<List<SavingsGoal>> getAll() {
        return ResponseEntity.ok(savingsGoalService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SavingsGoal> getById(@PathVariable Long id) {
        return ResponseEntity.ok(savingsGoalService.findById(id));
    }

    @PostMapping
    public ResponseEntity<SavingsGoal> create(@Valid @RequestBody SavingsGoal savingsGoal) {
        return new ResponseEntity<>(savingsGoalService.save(savingsGoal), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SavingsGoal> update(@PathVariable Long id, @Valid @RequestBody SavingsGoal savingsGoal) {
        return ResponseEntity.ok(savingsGoalService.update(id, savingsGoal));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        savingsGoalService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
