package com.finova.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "bank_accounts")
public class BankAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del banco es obligatorio")
    private String name;

    @NotBlank(message = "El tipo de cuenta es obligatorio")
    @Column(name = "account_type")
    private String accountType;

    @NotNull(message = "El saldo es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "El saldo debe ser mayor o igual a cero")
    private Double balance;

    private String color;

    public BankAccount() {
    }

    public BankAccount(Long id, String name, String accountType, Double balance, String color) {
        this.id = id;
        this.name = name;
        this.accountType = accountType;
        this.balance = balance;
        this.color = color;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
