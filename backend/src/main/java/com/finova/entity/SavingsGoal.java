package com.finova.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "savings_goal")
public class SavingsGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El título de la meta es obligatorio")
    private String title;

    @NotNull(message = "El valor ahorrado es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "El valor ahorrado debe ser mayor o igual a cero")
    private Double saved;

    @NotNull(message = "El total de la meta es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "El total debe ser mayor o igual a cero")
    private Double total;

    @NotNull(message = "El progreso es obligatorio")
    private Integer progress;

    @NotNull(message = "El valor restante es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "El valor restante debe ser mayor o igual a cero")
    private Double remaining;

    private String color;

    public SavingsGoal() {
    }

    public SavingsGoal(Long id, String title, Double saved, Double total, Integer progress, Double remaining, String color) {
        this.id = id;
        this.title = title;
        this.saved = saved;
        this.total = total;
        this.progress = progress;
        this.remaining = remaining;
        this.color = color;
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

    public Double getSaved() {
        return saved;
    }

    public void setSaved(Double saved) {
        this.saved = saved;
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

    public Double getRemaining() {
        return remaining;
    }

    public void setRemaining(Double remaining) {
        this.remaining = remaining;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
