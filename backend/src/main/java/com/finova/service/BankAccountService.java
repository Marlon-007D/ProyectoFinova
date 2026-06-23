package com.finova.service;

import com.finova.entity.BankAccount;
import com.finova.exception.ResourceNotFoundException;
import com.finova.repository.BankAccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BankAccountService {

    private final BankAccountRepository bankAccountRepository;

    public BankAccountService(BankAccountRepository bankAccountRepository) {
        this.bankAccountRepository = bankAccountRepository;
    }

    public List<BankAccount> findAll() {
        return bankAccountRepository.findAll();
    }

    public BankAccount findById(Long id) {
        return bankAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta bancaria no encontrada con id " + id));
    }

    public BankAccount save(BankAccount bankAccount) {
        return bankAccountRepository.save(bankAccount);
    }

    public BankAccount update(Long id, BankAccount bankAccountData) {
        BankAccount existing = findById(id);
        existing.setName(bankAccountData.getName());
        existing.setAccountType(bankAccountData.getAccountType());
        existing.setBalance(bankAccountData.getBalance());
        existing.setColor(bankAccountData.getColor());
        return bankAccountRepository.save(existing);
    }

    public void delete(Long id) {
        BankAccount existing = findById(id);
        bankAccountRepository.delete(existing);
    }
}
