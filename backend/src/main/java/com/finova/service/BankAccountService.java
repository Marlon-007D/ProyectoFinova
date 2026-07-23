package com.finova.service;

import com.finova.entity.BankAccount;
import com.finova.entity.User;
import com.finova.exception.ResourceNotFoundException;
import com.finova.repository.BankAccountRepository;
import com.finova.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BankAccountService {

    private final BankAccountRepository bankAccountRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public BankAccountService(BankAccountRepository bankAccountRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.bankAccountRepository = bankAccountRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<BankAccount> findAllActiveByUsername(String username) {
        return bankAccountRepository.findByUser_UsernameAndActiveTrue(username);
    }

    public BankAccount findById(Long id) {
        return bankAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta bancaria no encontrada con id " + id));
    }

    private void validateExpiryDate(String expiryDate) {
        if (expiryDate == null || !expiryDate.matches("^(0[1-9]|1[0-2])/\\d{2}$")) {
            throw new IllegalArgumentException("Formato de fecha de caducidad inválido.");
        }
        String[] parts = expiryDate.split("/");
        int expMonth = Integer.parseInt(parts[0]);
        int expYear = Integer.parseInt(parts[1]) + 2000;
        
        java.time.YearMonth currentYearMonth = java.time.YearMonth.now();
        java.time.YearMonth expYearMonth = java.time.YearMonth.of(expYear, expMonth);
        
        if (expYearMonth.isBefore(currentYearMonth)) {
            throw new IllegalArgumentException("La tarjeta se encuentra caducada y no puede ser vinculada.");
        }
    }

    public BankAccount save(BankAccount bankAccount, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        validateExpiryDate(bankAccount.getExpiryDate());

        // Regla 1: Restauración lógica si el mismo usuario pone su cuenta antigua
        java.util.Optional<BankAccount> existingOpt = bankAccountRepository.findByUser_UsernameAndAccountNumber(username, bankAccount.getAccountNumber());
        if (existingOpt.isPresent()) {
            BankAccount existing = existingOpt.get();
            if (existing.getActive()) {
                throw new IllegalArgumentException("Esta cuenta bancaria ya se encuentra vinculada y activa en tu perfil.");
            }
            // Verify BCrypt credentials before logical restore
            if (!passwordEncoder.matches(bankAccount.getCardNumber(), existing.getCardNumber()) ||
                !passwordEncoder.matches(bankAccount.getCvv(), existing.getCvv()) ||
                !existing.getExpiryDate().equals(bankAccount.getExpiryDate())) {
                throw new IllegalArgumentException("Credenciales de seguridad incorrectas. No puedes vincular esta cuenta.");
            }

            existing.setActive(true);
            existing.setName(bankAccount.getName()); 
            existing.setAccountType(bankAccount.getAccountType());
            existing.setBalance(bankAccount.getBalance()); 
            existing.setColor(bankAccount.getColor());
            return bankAccountRepository.save(existing);
        }

        // Regla 2: Unicidad global de números de cuenta vs Autenticación
        List<BankAccount> accountsWithSameNumber = bankAccountRepository.findByAccountNumber(bankAccount.getAccountNumber());
        if (!accountsWithSameNumber.isEmpty()) {
            // Get the first one to compare credentials (all instances of this account should have the same credentials)
            BankAccount masterAccount = accountsWithSameNumber.get(0);
            
            if (!passwordEncoder.matches(bankAccount.getCardNumber(), masterAccount.getCardNumber()) ||
                !passwordEncoder.matches(bankAccount.getCvv(), masterAccount.getCvv()) ||
                !masterAccount.getExpiryDate().equals(bankAccount.getExpiryDate())) {
                throw new IllegalArgumentException("Credenciales de seguridad incorrectas. No puedes vincular esta cuenta.");
            }
            // If they match, allow them to link it! We just proceed to save the new record.
        }

        // Hash credentials before saving
        bankAccount.setCardNumber(passwordEncoder.encode(bankAccount.getCardNumber()));
        bankAccount.setCvv(passwordEncoder.encode(bankAccount.getCvv()));
        // Expiry Date is not hashed (it's safe to store MM/YY)

        bankAccount.setUser(user);
        bankAccount.setActive(true);
        return bankAccountRepository.save(bankAccount);
    }

    public BankAccount update(Long id, BankAccount accountData, String username) {
        BankAccount existing = findById(id);
        if (!existing.getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("No tienes permiso para editar esta cuenta");
        }
        existing.setName(accountData.getName());
        existing.setAccountType(accountData.getAccountType());
        existing.setBalance(accountData.getBalance());
        existing.setColor(accountData.getColor());
        return bankAccountRepository.save(existing);
    }

    public void delete(Long id, String username) {
        BankAccount existing = findById(id);
        if (!existing.getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("No tienes permiso para eliminar esta cuenta");
        }
        // Logical delete
        existing.setActive(false);
        bankAccountRepository.save(existing);
    }
}
