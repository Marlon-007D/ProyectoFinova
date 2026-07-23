import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetService, Budget } from '../../services/budget.service';
import { BankService } from '../../services/bank.service';
import { TransactionService, BankAccount, Transaction } from '../../services/transaction.service';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [NgClass, CommonModule, FormsModule],
  templateUrl: './budgets.html',
  styleUrl: './budgets.css'
})
export class BudgetsComponent implements OnInit {

  budgets: Budget[] = [];

  // Create Modal State
  isCreateModalOpen = false;
  isSubmittingCreate = false;
  newBudget: Budget = {
    title: '',
    spent: 0,
    total: 0,
    progress: 0,
    color: 'emerald'
  };

  // Add Expense State
  isExpenseModalOpen = false;
  isSubmittingExpense = false;
  selectedBudget: Budget | null = null;
  expenseAmount: number | null = null;
  selectedBankId: number | null = null;
  expenseErrorMessage = '';

  // Delete Modal State
  isDeleteModalOpen = false;
  budgetToDeleteId: number | null = null;
  isDeleting = false;

  banks: BankAccount[] = [];

  constructor(
    private budgetService: BudgetService, 
    private bankService: BankService,
    private transactionService: TransactionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBudgets();
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

  // --- Create Budget Logic ---

  openCreateModal() {
    this.isCreateModalOpen = true;
    this.newBudget = {
      title: '',
      spent: 0,
      total: null as unknown as number, // force user to enter
      progress: 0,
      color: 'emerald'
    };
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
  }

  createBudget() {
    if (!this.newBudget.title || !this.newBudget.total) return;
    
    this.isSubmittingCreate = true;
    this.newBudget.spent = 0;
    this.newBudget.progress = 0;

    this.budgetService.createBudget(this.newBudget).subscribe({
      next: () => {
        this.isSubmittingCreate = false;
        this.closeCreateModal();
        this.loadBudgets();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.isSubmittingCreate = false;
        this.cdr.markForCheck();
      }
    });
  }

  // --- Expense Logic ---

  openExpenseModal(budget: Budget) {
    this.selectedBudget = budget;
    this.expenseAmount = null;
    this.selectedBankId = null;
    this.expenseErrorMessage = '';
    this.isExpenseModalOpen = true;
  }

  closeExpenseModal() {
    this.isExpenseModalOpen = false;
    this.selectedBudget = null;
  }

  addExpense() {
    if (!this.selectedBudget || !this.expenseAmount || !this.selectedBudget.id || !this.selectedBankId) return;
    if (this.expenseAmount <= 0) return;

    this.isSubmittingExpense = true;
    this.expenseErrorMessage = '';

    const selectedBank = this.banks.find(b => b.id == this.selectedBankId);
    if (!selectedBank) {
      this.isSubmittingExpense = false;
      return;
    }

    const tx: Transaction = {
      date: new Date().toISOString().split('T')[0],
      description: `Gasto de Presupuesto: ${this.selectedBudget.title}`,
      transactionType: 'EGRESO',
      amount: this.expenseAmount,
      color: this.selectedBudget.color || 'slate',
      bankAccount: selectedBank
    };

    // 1. Create Transaction (deducts from bank)
    this.transactionService.createTransaction(tx).subscribe({
      next: () => {
        // 2. Update Budget
        const newSpent = this.selectedBudget!.spent + this.expenseAmount!;
        let newProgress = Math.round((newSpent / this.selectedBudget!.total) * 100);
        if (newProgress > 100) newProgress = 100;

        const updatedBudget: Budget = {
          ...this.selectedBudget!,
          spent: newSpent,
          progress: newProgress
        };

        this.budgetService.updateBudget(this.selectedBudget!.id as number, updatedBudget).subscribe({
          next: () => {
            this.isSubmittingExpense = false;
            this.closeExpenseModal();
            this.loadBudgets();
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error('Error actualizando presupuesto', err);
            this.isSubmittingExpense = false;
            this.expenseErrorMessage = 'Error al actualizar el presupuesto.';
            this.cdr.markForCheck();
          }
        });
      },
      error: (err) => {
        console.error('Error creando transacción', err);
        this.isSubmittingExpense = false;
        this.expenseErrorMessage = 'Saldo insuficiente en la cuenta seleccionada o error de red.';
        this.cdr.markForCheck();
      }
    });
  }

  loadBudgets() {
    this.budgetService.getBudgets().subscribe({
      next: (data) => {
        this.budgets = data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching budgets', err);
        this.cdr.markForCheck();
      }
    });
  }

  deleteBudget(id: number | undefined) {
    if (!id) return;
    this.budgetToDeleteId = id;
    this.isDeleteModalOpen = true;
  }

  cancelDelete() {
    this.isDeleteModalOpen = false;
    this.budgetToDeleteId = null;
  }

  confirmDelete() {
    if (!this.budgetToDeleteId) return;
    
    this.isDeleting = true;
    this.cdr.markForCheck();

    this.budgetService.deleteBudget(this.budgetToDeleteId).subscribe({
      next: () => {
        this.isDeleting = false;
        this.isDeleteModalOpen = false;
        this.budgetToDeleteId = null;
        this.loadBudgets();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error deleting budget', err);
        this.isDeleting = false;
        this.isDeleteModalOpen = false;
        this.budgetToDeleteId = null;
        this.cdr.markForCheck();
      }
    });
  }
}