import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BankAccount {
  id?: number;
  name: string;
  accountType: string;
  accountNumber?: string;
  cardNumber?: string;
  cvv?: string;
  expiryDate?: string;
  balance: number;
  color: string;
  active?: boolean;
}

export interface Transaction {
  id?: number;
  date: string;
  description: string;
  transactionType: string;
  amount: number;
  color: string;
  bankAccount: BankAccount;
  active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) { }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  updateTransaction(id: number, transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, transaction);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
