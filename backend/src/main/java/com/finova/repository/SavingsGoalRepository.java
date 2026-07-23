package com.finova.repository;

import com.finova.entity.SavingsGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface SavingsGoalRepository extends JpaRepository<SavingsGoal, Long> {
    List<SavingsGoal> findByUser_UsernameAndActiveTrue(String username);
    Page<SavingsGoal> findByUser_UsernameAndActiveTrue(String username, Pageable pageable);
}
