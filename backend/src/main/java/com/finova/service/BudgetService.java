package com.finova.service;

import com.finova.entity.Budget;
import com.finova.exception.ResourceNotFoundException;
import com.finova.repository.BudgetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public List<Budget> findAll() {
        return budgetRepository.findAll();
    }

    public Budget findById(Long id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Presupuesto no encontrado con id " + id));
    }

    public Budget save(Budget budget) {
        return budgetRepository.save(budget);
    }

    public Budget update(Long id, Budget budgetData) {
        Budget existing = findById(id);
        existing.setTitle(budgetData.getTitle());
        existing.setSpent(budgetData.getSpent());
        existing.setTotal(budgetData.getTotal());
        existing.setProgress(budgetData.getProgress());
        existing.setColor(budgetData.getColor());
        return budgetRepository.save(existing);
    }

    public void delete(Long id) {
        Budget existing = findById(id);
        budgetRepository.delete(existing);
    }
}
