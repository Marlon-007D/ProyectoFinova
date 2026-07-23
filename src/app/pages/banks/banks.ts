import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BankService } from '../../services/bank.service';
import { BankAccount, TransactionService, Transaction } from '../../services/transaction.service';
import { NotificationService } from '../../services/notification.service';
import { IaService } from '../../services/ia.service';

@Component({
  selector: 'app-banks',
  standalone: true,
  imports: [NgClass, CommonModule, FormsModule, RouterModule],
  templateUrl: './banks.html',
  styleUrl: './banks.css'
})
export class BanksComponent implements OnInit {

  banks: BankAccount[] = [];

  // Create Bank State
  isCreateModalOpen = false;
  isSubmittingCreate = false;
  isConnecting = false;

  selectedInstitution = '';
  accountNumber = '';
  cardNumber = '';
  expiryDate = '';
  cvv = '';
  accountType = 'Ahorros';
  accountError = '';

  institutions = [
    { name: 'Banco Pichincha', color: 'amber' },
    { name: 'Banco de Guayaquil', color: 'rose' },
    { name: 'Banco del Pacífico', color: 'blue' },
    { name: 'Produbanco', color: 'emerald' },
    { name: 'Cooperativa JEP', color: 'red' }
  ];

  // Delete Modal State
  isDeleteModalOpen = false;
  bankToDeleteId: number | null = null;
  isDeleting = false;

  // Sync State
  isSyncingId: number | null = null;
  syncMessage: string = '';
  syncMessageBankId: number | null = null;

  constructor(
    private bankService: BankService,
    private transactionService: TransactionService,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService,
    private iaService: IaService
  ) {}

  ngOnInit() {
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

  deleteBank(id: number | undefined) {
    if (!id) return;
    this.bankToDeleteId = id;
    this.isDeleteModalOpen = true;
  }

  cancelDelete() {
    this.isDeleteModalOpen = false;
    this.bankToDeleteId = null;
  }

  confirmDelete() {
    if (!this.bankToDeleteId) return;
    
    this.isDeleting = true;
    this.cdr.markForCheck();

    this.bankService.deleteBank(this.bankToDeleteId).subscribe({
      next: () => {
        this.isDeleting = false;
        this.isDeleteModalOpen = false;
        this.bankToDeleteId = null;
        this.loadBanks();
        this.notification.showSuccess('Cuenta eliminada', 'La cuenta bancaria se desvinculó correctamente.');
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.isDeleting = false;
        this.isDeleteModalOpen = false;
        this.bankToDeleteId = null;
        this.notification.showError('Error', 'No se pudo eliminar la cuenta bancaria.');
        this.cdr.markForCheck();
      }
    });
  }


  get isAccountValid(): boolean {
    return /^\d{10}$/.test(this.accountNumber);
  }

  get isCardValid(): boolean {
    return /^\d{16}$/.test(this.cardNumber);
  }

  get isExpiryValid(): boolean {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(this.expiryDate)) {
      return false;
    }
    const parts = this.expiryDate.split('/');
    const expMonth = parseInt(parts[0], 10);
    const expYear = parseInt(parts[1], 10) + 2000;
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    
    return true;
  }

  get isCvvValid(): boolean {
    return /^\d{3}$/.test(this.cvv);
  }

  onNumberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.expiryDate = value;
  }

  // --- Create Bank Logic ---

  openCreateModal() {
    this.isCreateModalOpen = true;
    this.selectedInstitution = '';
    this.accountNumber = '';
    this.cardNumber = '';
    this.expiryDate = '';
    this.cvv = '';
    this.accountType = 'Ahorros';
    this.accountError = '';
    this.isConnecting = false;

    // Disparar consejo proactivo a Nova
    this.iaService.triggerProactiveAdvice('El usuario está a punto de vincular una nueva cuenta bancaria. Dale un consejo muy breve sobre la seguridad de sus datos y que no comparta sus claves con nadie.');
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
  }

  createBank() {
    if (!this.selectedInstitution || !this.isAccountValid || !this.isCardValid || !this.isExpiryValid || !this.isCvvValid || !this.accountType) return;
    
    this.isConnecting = true;
    this.accountError = '';
    this.cdr.markForCheck();

    // Simular tiempo de conexión con la API del Banco (2 segundos)
    setTimeout(() => {
      this.isConnecting = false;
      this.isSubmittingCreate = true;
      this.cdr.markForCheck();

      const inst = this.institutions.find(i => i.name === this.selectedInstitution);
      const color = inst ? inst.color : 'slate';
      
      // Enmascarar número de cuenta (últimos 4 dígitos)
      const last4 = this.accountNumber.length >= 4 ? this.accountNumber.slice(-4) : this.accountNumber;
      const maskedName = `${this.selectedInstitution} (***${last4})`;

      // Generar saldo realista entre 100 y 3000
      const fakeBalance = Math.floor(Math.random() * (3000 - 100 + 1)) + 100;

      const newBank: BankAccount = {
        name: maskedName,
        accountType: this.accountType,
        accountNumber: this.accountNumber,
        cardNumber: this.cardNumber,
        cvv: this.cvv,
        expiryDate: this.expiryDate,
        balance: fakeBalance,
        color: color
      };

      this.bankService.createBank(newBank).subscribe({
        next: () => {
          this.isSubmittingCreate = false;
          this.closeCreateModal();
          this.loadBanks();
          this.notification.showSuccess('Cuenta vinculada', 'Se ha agregado tu cuenta bancaria con éxito.');
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error(err);
          this.isSubmittingCreate = false;
          this.isConnecting = false;
          this.accountError = err.error?.message || err.message || 'Esta cuenta ya está vinculada.';
          this.notification.showError('Error de seguridad', this.accountError);
          this.cdr.markForCheck();
        }
      });
    }, 2000);
  }

  // --- Sync Logic ---
  syncBank(bank: BankAccount) {
    if (!bank || !bank.id || this.isSyncingId === bank.id) return;
    
    this.isSyncingId = bank.id;
    this.syncMessage = '';
    this.syncMessageBankId = null;
    this.cdr.markForCheck();

    // Comprobar Cooldown en localStorage (1 minuto)
    const cooldownKey = `finova_last_sync_${bank.id}`;
    const lastSyncTime = localStorage.getItem(cooldownKey);
    const now = Date.now();
    const cooldownMs = 60000; // 1 minuto de cooldown

    setTimeout(() => {
      this.isSyncingId = null;

      if (lastSyncTime && (now - Number(lastSyncTime) < cooldownMs)) {
        // Bloqueo: No ha pasado suficiente tiempo, fingimos que no hay nuevos datos
        this.showSyncMessage(bank.id!, 'Tus datos ya están actualizados. No hay nuevos movimientos recientes.');
      } else {
        // Éxito: Ha pasado el tiempo, inyectamos dinero falso
        const fakeDeposit = Math.floor(Math.random() * (1500 - 50 + 1)) + 50;

        const tx: Transaction = {
          date: new Date().toISOString().split('T')[0],
          description: 'Sincronización: Nuevo Ingreso Detectado',
          transactionType: 'INGRESO',
          amount: fakeDeposit,
          color: bank.color || 'emerald',
          bankAccount: bank
        };

        this.transactionService.createTransaction(tx).subscribe({
          next: () => {
            localStorage.setItem(cooldownKey, now.toString()); // Guardamos tiempo de última sincronización exitosa
            this.showSyncMessage(bank.id!, `¡Sincronizado! Se detectó un ingreso de $${fakeDeposit.toFixed(2)}`);
            this.loadBanks(); // Reload balances
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error('Error sincronizando banco', err);
            this.showSyncMessage(bank.id!, 'Error de conexión con el banco.');
            this.cdr.markForCheck();
          }
        });
      }
      this.cdr.markForCheck();
    }, 1500);
  }

  private showSyncMessage(bankId: number, message: string) {
    this.syncMessageBankId = bankId;
    this.syncMessage = message;
    this.cdr.markForCheck();
    setTimeout(() => {
      if (this.syncMessageBankId === bankId) {
        this.syncMessage = '';
        this.syncMessageBankId = null;
        this.cdr.markForCheck();
      }
    }, 4000); // El mensaje desaparece en 4 segundos
  }
}