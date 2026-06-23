package com.finova.controller;

import com.finova.entity.BankAccount;
import com.finova.service.BankAccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bank-accounts")
public class BankAccountController {

    private final BankAccountService bankAccountService;

    public BankAccountController(BankAccountService bankAccountService) {
        this.bankAccountService = bankAccountService;
    }

    @GetMapping
    public ResponseEntity<List<BankAccount>> getAll() {
        return ResponseEntity.ok(bankAccountService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BankAccount> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bankAccountService.findById(id));
    }

    @PostMapping
    public ResponseEntity<BankAccount> create(@Valid @RequestBody BankAccount bankAccount) {
        return new ResponseEntity<>(bankAccountService.save(bankAccount), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BankAccount> update(@PathVariable Long id, @Valid @RequestBody BankAccount bankAccount) {
        return ResponseEntity.ok(bankAccountService.update(id, bankAccount));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bankAccountService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
