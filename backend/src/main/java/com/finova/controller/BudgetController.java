package com.finova.controller;

import com.finova.entity.Budget;
import com.finova.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<List<Budget>> getAll(Principal principal) {
        return ResponseEntity.ok(budgetService.findAllActiveByUsername(principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Budget> getById(@PathVariable Long id, Principal principal) {
        Budget budget = budgetService.findById(id);
        if (!budget.getUser().getUsername().equals(principal.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(budget);
    }

    @PostMapping
    public ResponseEntity<Budget> create(@Valid @RequestBody Budget budget, Principal principal) {
        return new ResponseEntity<>(budgetService.save(budget, principal.getName()), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> update(@PathVariable Long id, @Valid @RequestBody Budget budget, Principal principal) {
        return ResponseEntity.ok(budgetService.update(id, budget, principal.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Principal principal) {
        budgetService.delete(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
