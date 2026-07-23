import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SavingsService, SavingsGoal } from '../../services/savings.service';
import { BankService } from '../../services/bank.service';
import { TransactionService, BankAccount, Transaction } from '../../services/transaction.service';

@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [NgClass, CommonModule, FormsModule],
  templateUrl: './savings.html',
  styleUrl: './savings.css'
})
export class SavingsComponent implements OnInit {

  savingsGoals: SavingsGoal[] = [];

  // Create Goal State
  isCreateModalOpen = false;
  isSubmittingCreate = false;
  newGoal: SavingsGoal = {
    title: '',
    saved: 0,
    total: 0,
    progress: 0,
    remaining: 0,
    color: 'emerald'
  };

  // Add Saving State
  isSavingModalOpen = false;
  isSubmittingSaving = false;
  selectedGoal: SavingsGoal | null = null;
  savingAmount: number | null = null;
  selectedBankId: number | null = null;
  savingErrorMessage = '';

  // Delete Modal State
  isDeleteModalOpen = false;
  goalToDeleteId: number | null = null;
  isDeleting = false;

  banks: BankAccount[] = [];

  constructor(
    private savingsService: SavingsService, 
    private bankService: BankService,
    private transactionService: TransactionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadSavingsGoals();
    this.loadBanks();
  }

  loadBanks() {
    this.bankService.getBanks().subscribe({
      next: (data) => {
        this.banks = data.filter(b => b.active !== false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching banks', err);
        this.cdr.markForCheck();
      }
    });
  }

  // --- Create Goal Logic ---

  openCreateModal() {
    this.isCreateModalOpen = true;
    this.newGoal = {
      title: '',
      saved: 0,
      total: null as unknown as number, // force user to enter
      progress: 0,
      remaining: 0,
      color: 'emerald'
    };
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
  }

  createGoal() {
    if (!this.newGoal.title || !this.newGoal.total) return;
    
    this.isSubmittingCreate = true;
    this.newGoal.saved = 0;
    this.newGoal.progress = 0;
    this.newGoal.remaining = this.newGoal.total;

    this.savingsService.createSavingsGoal(this.newGoal).subscribe({
      next: () => {
        this.isSubmittingCreate = false;
        this.closeCreateModal();
        this.loadSavingsGoals();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.isSubmittingCreate = false;
        this.cdr.markForCheck();
      }
    });
  }

  // --- Add Saving Logic ---

  openSavingModal(goal: SavingsGoal) {
    this.selectedGoal = goal;
    this.savingAmount = null;
    this.selectedBankId = null;
    this.savingErrorMessage = '';
    this.isSavingModalOpen = true;
  }

  closeSavingModal() {
    this.isSavingModalOpen = false;
    this.selectedGoal = null;
  }

  addSaving() {
    if (!this.selectedGoal || !this.savingAmount || !this.selectedGoal.id || !this.selectedBankId) return;
    if (this.savingAmount <= 0) return;

    this.isSubmittingSaving = true;
    this.savingErrorMessage = '';

    const selectedBank = this.banks.find(b => b.id == this.selectedBankId);
    if (!selectedBank) {
      this.isSubmittingSaving = false;
      return;
    }

    const tx: Transaction = {
      date: new Date().toISOString().split('T')[0],
      description: `Ahorro para Meta: ${this.selectedGoal.title}`,
      transactionType: 'EGRESO',
      amount: this.savingAmount,
      color: this.selectedGoal.color || 'emerald',
      bankAccount: selectedBank
    };

    // 1. Create Transaction (deducts from bank)
    this.transactionService.createTransaction(tx).subscribe({
      next: () => {
        // 2. Update Savings Goal
        const newSaved = this.selectedGoal!.saved + this.savingAmount!;
        let newRemaining = this.selectedGoal!.total - newSaved;
        if (newRemaining < 0) newRemaining = 0;
        
        let newProgress = Math.round((newSaved / this.selectedGoal!.total) * 100);
        if (newProgress > 100) newProgress = 100;

        const updatedGoal: SavingsGoal = {
          ...this.selectedGoal!,
          saved: newSaved,
          remaining: newRemaining,
          progress: newProgress
        };

        this.savingsService.updateSavingsGoal(this.selectedGoal!.id as number, updatedGoal).subscribe({
          next: () => {
            this.isSubmittingSaving = false;
            this.closeSavingModal();
            this.loadSavingsGoals();
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error('Error actualizando meta de ahorro', err);
            this.isSubmittingSaving = false;
            this.savingErrorMessage = 'Error al actualizar la meta de ahorro.';
            this.cdr.markForCheck();
          }
        });
      },
      error: (err) => {
        console.error('Error creando transacción', err);
        this.isSubmittingSaving = false;
        this.savingErrorMessage = 'Saldo insuficiente en la cuenta seleccionada o error de red.';
        this.cdr.markForCheck();
      }
    });
  }

  loadSavingsGoals() {
    this.savingsService.getSavingsGoals().subscribe({
      next: (data) => {
        this.savingsGoals = data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching savings goals', err);
        this.cdr.markForCheck();
      }
    });
  }

  deleteSavingsGoal(id: number | undefined) {
    if (!id) return;
    this.goalToDeleteId = id;
    this.isDeleteModalOpen = true;
  }

  cancelDelete() {
    this.isDeleteModalOpen = false;
    this.goalToDeleteId = null;
  }

  confirmDelete() {
    if (!this.goalToDeleteId) return;
    
    this.isDeleting = true;
    this.cdr.markForCheck();

    this.savingsService.deleteSavingsGoal(this.goalToDeleteId).subscribe({
      next: () => {
        this.isDeleting = false;
        this.isDeleteModalOpen = false;
        this.goalToDeleteId = null;
        this.loadSavingsGoals();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error deleting savings goal', err);
        this.isDeleting = false;
        this.isDeleteModalOpen = false;
        this.goalToDeleteId = null;
        this.cdr.markForCheck();
      }
    });
  }
}
