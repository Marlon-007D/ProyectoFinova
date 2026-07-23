package com.finova.repository;

import com.finova.entity.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    List<BankAccount> findByUser_UsernameAndActiveTrue(String username);
    Page<BankAccount> findByUser_UsernameAndActiveTrue(String username, Pageable pageable);
    java.util.Optional<BankAccount> findByUser_UsernameAndAccountNumber(String username, String accountNumber);
    List<BankAccount> findByAccountNumber(String accountNumber);
}
