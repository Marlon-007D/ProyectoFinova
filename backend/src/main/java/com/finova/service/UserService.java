package com.finova.service;

import com.finova.entity.User;
import com.finova.exception.ResourceNotFoundException;
import com.finova.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<User> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
    }

    public User save(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        user.setEnabled(true);
        return userRepository.save(user);
    }

    public User update(Long id, User userDetails) {
        User user = findById(id);
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        if (userDetails.getRole() != null && !userDetails.getRole().isEmpty()) {
            user.setRole(userDetails.getRole());
        }
        if (userDetails.getEnabled() != null) {
            user.setEnabled(userDetails.getEnabled());
        }
        return userRepository.save(user);
    }

    public void delete(Long id) {
        User user = findById(id);
        user.setEnabled(false); // Eliminación lógica
        userRepository.save(user);
    }

    public User updateStatus(Long id, boolean status) {
        User user = findById(id);
        user.setEnabled(status);
        return userRepository.save(user);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con username: " + username));
    }

    public User updateMyProfile(String username, User userDetails) {
        User user = findByUsername(username);
        
        // Update basic info
        if (userDetails.getUsername() != null && !userDetails.getUsername().isEmpty()) {
            user.setUsername(userDetails.getUsername());
        }
        if (userDetails.getEmail() != null && !userDetails.getEmail().isEmpty()) {
            user.setEmail(userDetails.getEmail());
        }
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        if (userDetails.getProfilePicture() != null) {
            user.setProfilePicture(userDetails.getProfilePicture());
        }
        return userRepository.save(user);
    }

    public User updateMyPreferences(String username, User preferences) {
        User user = findByUsername(username);
        if (preferences.getFontSize() != null) {
            user.setFontSize(preferences.getFontSize());
        }
        if (preferences.getFontFamily() != null) {
            user.setFontFamily(preferences.getFontFamily());
        }
        return userRepository.save(user);
    }

    public void suspendMyAccount(String username) {
        User user = findByUsername(username);
        user.setEnabled(false);
        userRepository.save(user);
    }

    public void deleteMyAccount(String username) {
        User user = findByUsername(username);
        userRepository.delete(user);
    }
}
