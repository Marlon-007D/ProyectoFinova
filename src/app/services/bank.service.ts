import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BankAccount } from './transaction.service';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  private apiUrl = 'http://localhost:8080/api/banks';

  constructor(private http: HttpClient) { }

  getBanks(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.apiUrl);
  }

  createBank(bank: BankAccount): Observable<BankAccount> {
    return this.http.post<BankAccount>(this.apiUrl, bank);
  }

  updateBank(id: number, bank: BankAccount): Observable<BankAccount> {
    return this.http.put<BankAccount>(`${this.apiUrl}/${id}`, bank);
  }

  deleteBank(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
