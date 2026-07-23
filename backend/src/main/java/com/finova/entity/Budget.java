package com.finova.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "budgets")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El título del presupuesto es obligatorio")
    private String title;

    @NotNull(message = "El valor gastado es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "El valor gastado debe ser mayor o igual a cero")
    private Double spent;

    @NotNull(message = "El valor total es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "El total debe ser mayor o igual a cero")
    private Double total;

    @NotNull(message = "El progreso es obligatorio")
    @Column(nullable = false)
    private Integer progress;

    private String color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Boolean active = true;

    public Budget() {
    }

    public Budget(Long id, String title, Double spent, Double total, Integer progress, String color, User user) {
        this.id = id;
        this.title = title;
        this.spent = spent;
        this.total = total;
        this.progress = progress;
        this.color = color;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Double getSpent() {
        return spent;
    }

    public void setSpent(Double spent) {
        this.spent = spent;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
