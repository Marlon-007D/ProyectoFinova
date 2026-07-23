package com.finova.repository;

import com.finova.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUser_UsernameAndActiveTrue(String username);
    Page<Budget> findByUser_UsernameAndActiveTrue(String username, Pageable pageable);
}
