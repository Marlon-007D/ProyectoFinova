import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService, Transaction } from '../../services/transaction.service';
import { BankService } from '../../services/bank.service';
import { BankAccount } from '../../services/transaction.service';
import { NotificationService } from '../../services/notification.service';
import { IaService } from '../../services/ia.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class TransactionsComponent implements OnInit {

  Math = Math;
  transactions: Transaction[] = [];

  // Delete Modal State
  isDeleteModalOpen = false;
  transactionToDeleteId: number | null = null;
  isDeleting = false;

  banks: BankAccount[] = [];

  isModalOpen = false;
  isSubmitting = false;

  // Filter State
  searchTerm = '';
  filterType = 'TODOS';
  filterStartDate = '';
  filterEndDate = '';

  // Pagination State
  currentPage = 1;
  pageSize = 5;

  newTransaction: any = {
    date: new Date().toISOString().split('T')[0],
    description: '',
    transactionType: 'EGRESO',
    amount: null,
    bankAccountId: null
  };

  constructor(
    private transactionService: TransactionService,
    private bankService: BankService,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService,
    private iaService: IaService
  ) {}

  ngOnInit() {
    this.loadTransactions();
    this.loadBanks();
  }

  // --- Filtering & Pagination Logic ---

  get filteredTransactions(): Transaction[] {
    return this.transactions.filter(t => {
      // Filter by Search Term (Description or Bank Name)
      const term = this.searchTerm.toLowerCase();
      const matchesSearch = !term || 
        t.description.toLowerCase().includes(term) || 
        (t.bankAccount?.name || '').toLowerCase().includes(term);

      // Filter by Type
      const matchesType = this.filterType === 'TODOS' || 
        (this.filterType === 'INGRESO' && t.transactionType === 'INGRESO') ||
        (this.filterType === 'EGRESO' && (t.transactionType === 'EGRESO' || t.transactionType === 'GASTO'));

      // Filter by Date Range
      const tDate = new Date(t.date);
      // Remove time portion for comparison
      tDate.setHours(0, 0, 0, 0);

      let matchesStartDate = true;
      if (this.filterStartDate) {
        const start = new Date(this.filterStartDate);
        start.setHours(0, 0, 0, 0);
        // Timezone adjustment fix for comparison by adding local offset if needed, or simply string compare
        // It's safer to compare ISO strings or getTime()
        matchesStartDate = tDate >= start;
      }

      let matchesEndDate = true;
      if (this.filterEndDate) {
        const end = new Date(this.filterEndDate);
        end.setHours(0, 0, 0, 0);
        matchesEndDate = tDate <= end;
      }

      return matchesSearch && matchesType && matchesStartDate && matchesEndDate;
    });
  }

  get paginatedTransactions(): Transaction[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTransactions.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTransactions.length / this.pageSize) || 1;
  }

  onFilterChange() {
    this.currentPage = 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // --- End Filtering & Pagination ---

  loadBanks() {
    this.bankService.getBanks().subscribe({
      next: (data) => {
        // filter out inactive banks just in case, though backend should only return active ones
        this.banks = data.filter(b => b.active !== false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.cdr.markForCheck();
      }
    });
  }

  openModal() {
    this.isModalOpen = true;
    this.newTransaction = {
      date: new Date().toISOString().split('T')[0],
      description: '',
      transactionType: 'EGRESO',
      amount: null,
      bankAccountId: this.banks.length > 0 ? this.banks[0].id : null
    };

    // Disparar consejo proactivo a Nova
    this.iaService.triggerProactiveAdvice('El usuario está a punto de registrar un nuevo movimiento (ingreso o gasto). Dale un consejo muy breve sobre ser responsable con el dinero o registrar bien sus datos.');
  }

  closeModal() {
    this.isModalOpen = false;
  }

  createTransaction() {
    if (!this.newTransaction.description || !this.newTransaction.amount || !this.newTransaction.bankAccountId) {
      return;
    }

    this.isSubmitting = true;

    // The backend expects the BankAccount object containing the ID
    const payload: Transaction = {
      date: this.newTransaction.date,
      description: this.newTransaction.description,
      transactionType: this.newTransaction.transactionType,
      amount: this.newTransaction.amount,
      color: 'emerald',
      bankAccount: { id: this.newTransaction.bankAccountId } as BankAccount
    };

    this.transactionService.createTransaction(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeModal();
        this.loadTransactions(); // refresh list
        this.notification.showSuccess('Guardado', 'Movimiento registrado correctamente.');
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        this.notification.showError('Error', 'No se pudo guardar el movimiento.');
        this.cdr.markForCheck();
      }
    });
  }

  loadTransactions() {
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching transactions', err);
        this.cdr.markForCheck();
      }
    });
  }

  deleteTransaction(id: number | undefined) {
    if (!id) return;
    this.transactionToDeleteId = id;
    this.isDeleteModalOpen = true;
  }

  cancelDelete() {
    this.isDeleteModalOpen = false;
    this.transactionToDeleteId = null;
  }

  confirmDelete() {
    if (!this.transactionToDeleteId) return;
    
    this.isDeleting = true;
    this.cdr.markForCheck();

    this.transactionService.deleteTransaction(this.transactionToDeleteId).subscribe({
      next: () => {
        this.isDeleting = false;
        this.isDeleteModalOpen = false;
        this.transactionToDeleteId = null;
        this.loadTransactions();
        this.notification.showSuccess('Eliminado', 'El movimiento ha sido eliminado.');
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error deleting transaction', err);
        this.isDeleting = false;
        this.isDeleteModalOpen = false;
        this.transactionToDeleteId = null;
        this.notification.showError('Error', 'No se pudo eliminar el movimiento.');
        this.cdr.markForCheck();
      }
    });
  }
}