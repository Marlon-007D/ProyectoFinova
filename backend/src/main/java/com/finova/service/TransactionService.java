package com.finova.service;

import com.finova.entity.BankAccount;
import com.finova.entity.Transaction;
import com.finova.exception.ResourceNotFoundException;
import com.finova.repository.BankAccountRepository;
import com.finova.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final BankAccountRepository bankAccountRepository;

    public TransactionService(TransactionRepository transactionRepository,
                              BankAccountRepository bankAccountRepository) {
        this.transactionRepository = transactionRepository;
        this.bankAccountRepository = bankAccountRepository;
    }

    public List<Transaction> findAll() {
        return transactionRepository.findAll();
    }

    public Transaction findById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transacción no encontrada con id " + id));
    }

    public Transaction save(Transaction transaction) {
        if (transaction.getBankAccount() != null && transaction.getBankAccount().getId() != null) {
            BankAccount bankAccount = bankAccountRepository.findById(transaction.getBankAccount().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cuenta bancaria no encontrada con id " + transaction.getBankAccount().getId()));
            transaction.setBankAccount(bankAccount);
        }
        return transactionRepository.save(transaction);
    }

    public Transaction update(Long id, Transaction transactionData) {
        Transaction existing = findById(id);
        existing.setDate(transactionData.getDate());
        existing.setDescription(transactionData.getDescription());
        existing.setTransactionType(transactionData.getTransactionType());
        existing.setAmount(transactionData.getAmount());
        existing.setColor(transactionData.getColor());
        if (transactionData.getBankAccount() != null && transactionData.getBankAccount().getId() != null) {
            BankAccount bankAccount = bankAccountRepository.findById(transactionData.getBankAccount().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cuenta bancaria no encontrada con id " + transactionData.getBankAccount().getId()));
            existing.setBankAccount(bankAccount);
        }
        return transactionRepository.save(existing);
    }

    public void delete(Long id) {
        Transaction existing = findById(id);
        transactionRepository.delete(existing);
    }
}
