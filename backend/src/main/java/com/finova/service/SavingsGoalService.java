package com.finova.service;

import com.finova.entity.SavingsGoal;
import com.finova.entity.User;
import com.finova.exception.ResourceNotFoundException;
import com.finova.repository.SavingsGoalRepository;
import com.finova.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;
    private final UserRepository userRepository;

    public SavingsGoalService(SavingsGoalRepository savingsGoalRepository, UserRepository userRepository) {
        this.savingsGoalRepository = savingsGoalRepository;
        this.userRepository = userRepository;
    }

    public List<SavingsGoal> findAllActiveByUsername(String username) {
        return savingsGoalRepository.findByUser_UsernameAndActiveTrue(username);
    }

    public SavingsGoal findById(Long id) {
        return savingsGoalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meta de ahorro no encontrada con id " + id));
    }

    public SavingsGoal save(SavingsGoal savingsGoal, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        savingsGoal.setUser(user);
        savingsGoal.setActive(true);
        return savingsGoalRepository.save(savingsGoal);
    }

    public SavingsGoal update(Long id, SavingsGoal savingsData, String username) {
        SavingsGoal existing = findById(id);
        if (!existing.getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("No tienes permiso para editar esta meta de ahorro");
        }
        existing.setTitle(savingsData.getTitle());
        existing.setSaved(savingsData.getSaved());
        existing.setTotal(savingsData.getTotal());
        existing.setProgress(savingsData.getProgress());
        existing.setRemaining(savingsData.getRemaining());
        existing.setColor(savingsData.getColor());
        return savingsGoalRepository.save(existing);
    }

    public void delete(Long id, String username) {
        SavingsGoal existing = findById(id);
        if (!existing.getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("No tienes permiso para eliminar esta meta de ahorro");
        }
        // Logical delete
        existing.setActive(false);
        savingsGoalRepository.save(existing);
    }
}
