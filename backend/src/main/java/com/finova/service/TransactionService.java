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

    public List<Transaction> findAllActiveByUsername(String username) {
        return transactionRepository.findByBankAccount_User_UsernameAndActiveTrue(username);
    }

    public Transaction findById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transacción no encontrada con id " + id));
    }

    @org.springframework.transaction.annotation.Transactional
    public Transaction save(Transaction transaction, String username) {
        if (transaction.getBankAccount() != null && transaction.getBankAccount().getId() != null) {
            BankAccount bankAccount = bankAccountRepository.findById(transaction.getBankAccount().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cuenta bancaria no encontrada"));
            
            if (!bankAccount.getUser().getUsername().equals(username)) {
                throw new IllegalArgumentException("No tienes permiso para operar en esta cuenta");
            }

            transaction.setBankAccount(bankAccount);

            // Update balance
            double currentBalance = bankAccount.getBalance() != null ? bankAccount.getBalance() : 0.0;
            if ("INGRESO".equalsIgnoreCase(transaction.getTransactionType())) {
                bankAccount.setBalance(currentBalance + transaction.getAmount());
            } else if ("EGRESO".equalsIgnoreCase(transaction.getTransactionType()) || "GASTO".equalsIgnoreCase(transaction.getTransactionType())) {
                if (currentBalance < transaction.getAmount()) {
                    throw new IllegalArgumentException("Saldo insuficiente en la cuenta para realizar el gasto.");
                }
                bankAccount.setBalance(currentBalance - transaction.getAmount());
            }

            bankAccountRepository.save(bankAccount);
        }
        transaction.setActive(true);
        return transactionRepository.save(transaction);
    }

    @org.springframework.transaction.annotation.Transactional
    public Transaction update(Long id, Transaction transactionData, String username) {
        Transaction existing = findById(id);
        
        if (existing.getBankAccount() != null && !existing.getBankAccount().getUser().getUsername().equals(username)) {
             throw new IllegalArgumentException("No tienes permiso para editar esta transacción");
        }

        existing.setDate(transactionData.getDate());
        existing.setDescription(transactionData.getDescription());
        
        // Revert old balance effect? For simplicity, we just update fields that don't affect balance in this scope,
        // or we can implement balance reversion if needed. Let's assume balance reversion isn't strict here.
        existing.setTransactionType(transactionData.getTransactionType());
        existing.setAmount(transactionData.getAmount());
        existing.setColor(transactionData.getColor());
        
        return transactionRepository.save(existing);
    }

    @org.springframework.transaction.annotation.Transactional
    public void delete(Long id, String username) {
        Transaction existing = findById(id);
        if (existing.getBankAccount() != null && !existing.getBankAccount().getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("No tienes permiso para eliminar esta transacción");
        }

        // Revert balance
        if (existing.getBankAccount() != null && existing.getActive()) {
            BankAccount bankAccount = existing.getBankAccount();
            double currentBalance = bankAccount.getBalance() != null ? bankAccount.getBalance() : 0.0;
            if ("INGRESO".equalsIgnoreCase(existing.getTransactionType())) {
                bankAccount.setBalance(currentBalance - existing.getAmount());
            } else if ("EGRESO".equalsIgnoreCase(existing.getTransactionType()) || "GASTO".equalsIgnoreCase(existing.getTransactionType())) {
                bankAccount.setBalance(currentBalance + existing.getAmount());
            }
            bankAccountRepository.save(bankAccount);
        }

        // Logical delete
        existing.setActive(false);
        transactionRepository.save(existing);
    }
}
