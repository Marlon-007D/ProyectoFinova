package com.finova.service;

import com.finova.entity.SavingsGoal;
import com.finova.exception.ResourceNotFoundException;
import com.finova.repository.SavingsGoalRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;

    public SavingsGoalService(SavingsGoalRepository savingsGoalRepository) {
        this.savingsGoalRepository = savingsGoalRepository;
    }

    public List<SavingsGoal> findAll() {
        return savingsGoalRepository.findAll();
    }

    public SavingsGoal findById(Long id) {
        return savingsGoalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meta de ahorro no encontrada con id " + id));
    }

    public SavingsGoal save(SavingsGoal savingsGoal) {
        return savingsGoalRepository.save(savingsGoal);
    }

    public SavingsGoal update(Long id, SavingsGoal savingsGoalData) {
        SavingsGoal existing = findById(id);
        existing.setTitle(savingsGoalData.getTitle());
        existing.setSaved(savingsGoalData.getSaved());
        existing.setTotal(savingsGoalData.getTotal());
        existing.setProgress(savingsGoalData.getProgress());
        existing.setRemaining(savingsGoalData.getRemaining());
        existing.setColor(savingsGoalData.getColor());
        return savingsGoalRepository.save(existing);
    }

    public void delete(Long id) {
        SavingsGoal existing = findById(id);
        savingsGoalRepository.delete(existing);
    }
}
