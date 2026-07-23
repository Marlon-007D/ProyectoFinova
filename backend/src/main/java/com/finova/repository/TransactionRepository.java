package com.finova.repository;

import com.finova.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByBankAccount_User_UsernameAndActiveTrue(String username);
    Page<Transaction> findByBankAccount_User_UsernameAndActiveTrue(String username, Pageable pageable);
}
