package com.finova.controller;

import com.finova.entity.BankAccount;
import com.finova.service.BankAccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/banks")
public class BankAccountController {

    private final BankAccountService bankAccountService;

    public BankAccountController(BankAccountService bankAccountService) {
        this.bankAccountService = bankAccountService;
    }

    @GetMapping
    public ResponseEntity<List<BankAccount>> getAll(Principal principal) {
        return ResponseEntity.ok(bankAccountService.findAllActiveByUsername(principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BankAccount> getById(@PathVariable Long id, Principal principal) {
        BankAccount account = bankAccountService.findById(id);
        if (!account.getUser().getUsername().equals(principal.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(account);
    }

    @PostMapping
    public ResponseEntity<BankAccount> create(@Valid @RequestBody BankAccount bankAccount, Principal principal) {
        return new ResponseEntity<>(bankAccountService.save(bankAccount, principal.getName()), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BankAccount> update(@PathVariable Long id, @Valid @RequestBody BankAccount bankAccount, Principal principal) {
        return ResponseEntity.ok(bankAccountService.update(id, bankAccount, principal.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Principal principal) {
        bankAccountService.delete(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
