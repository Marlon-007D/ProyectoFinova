package com.finova.service;

import com.finova.entity.User;
import com.finova.exception.ResourceNotFoundException;
import com.finova.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
    }

    public User save(User user) {
        // En una aplicación real la contraseña debería encriptarse con BCrypt, 
        // pero para este proyecto básico se guarda tal cual.
        return userRepository.save(user);
    }

    public User update(Long id, User userDetails) {
        User user = findById(id);
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(userDetails.getPassword());
        }
        return userRepository.save(user);
    }

    public void delete(Long id) {
        User user = findById(id);
        userRepository.delete(user);
    }

    public User login(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password)
                .orElseThrow(() -> new ResourceNotFoundException("Credenciales incorrectas"));
    }
}
