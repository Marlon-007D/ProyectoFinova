package com.finova.controller;

import com.finova.entity.Budget;
import com.finova.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<List<Budget>> getAll() {
        return ResponseEntity.ok(budgetService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Budget> getById(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Budget> create(@Valid @RequestBody Budget budget) {
        return new ResponseEntity<>(budgetService.save(budget), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> update(@PathVariable Long id, @Valid @RequestBody Budget budget) {
        return ResponseEntity.ok(budgetService.update(id, budget));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        budgetService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
