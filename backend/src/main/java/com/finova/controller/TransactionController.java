package com.finova.controller;

import com.finova.entity.Transaction;
import com.finova.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAll(Principal principal) {
        return ResponseEntity.ok(transactionService.findAllActiveByUsername(principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getById(@PathVariable Long id, Principal principal) {
        Transaction transaction = transactionService.findById(id);
        if (transaction.getBankAccount() != null && !transaction.getBankAccount().getUser().getUsername().equals(principal.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(transaction);
    }

    @PostMapping
    public ResponseEntity<Transaction> create(@Valid @RequestBody Transaction transaction, Principal principal) {
        return new ResponseEntity<>(transactionService.save(transaction, principal.getName()), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> update(@PathVariable Long id, @Valid @RequestBody Transaction transaction, Principal principal) {
        return ResponseEntity.ok(transactionService.update(id, transaction, principal.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Principal principal) {
        transactionService.delete(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
