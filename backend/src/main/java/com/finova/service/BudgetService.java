package com.finova.service;

import com.finova.entity.Budget;
import com.finova.entity.User;
import com.finova.exception.ResourceNotFoundException;
import com.finova.repository.BudgetRepository;
import com.finova.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    public BudgetService(BudgetRepository budgetRepository, UserRepository userRepository) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
    }

    public List<Budget> findAllActiveByUsername(String username) {
        return budgetRepository.findByUser_UsernameAndActiveTrue(username);
    }

    public Budget findById(Long id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Presupuesto no encontrado con id " + id));
    }

    public Budget save(Budget budget, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        budget.setUser(user);
        budget.setActive(true);
        return budgetRepository.save(budget);
    }

    public Budget update(Long id, Budget budgetData, String username) {
        Budget existing = findById(id);
        if (!existing.getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("No tienes permiso para editar este presupuesto");
        }
        existing.setTitle(budgetData.getTitle());
        existing.setSpent(budgetData.getSpent());
        existing.setTotal(budgetData.getTotal());
        existing.setProgress(budgetData.getProgress());
        existing.setColor(budgetData.getColor());
        return budgetRepository.save(existing);
    }

    public void delete(Long id, String username) {
        Budget existing = findById(id);
        if (!existing.getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("No tienes permiso para eliminar este presupuesto");
        }
        // Logical delete
        existing.setActive(false);
        budgetRepository.save(existing);
    }
}
