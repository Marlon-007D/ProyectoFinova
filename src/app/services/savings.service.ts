import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SavingsGoal {
  id?: number;
  title: string;
  saved: number;
  total: number;
  progress: number;
  remaining: number;
  color: string;
  active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SavingsService {

  private apiUrl = 'http://localhost:8080/api/savings';

  constructor(private http: HttpClient) { }

  getSavingsGoals(): Observable<SavingsGoal[]> {
    return this.http.get<SavingsGoal[]>(this.apiUrl);
  }

  createSavingsGoal(savingsGoal: SavingsGoal): Observable<SavingsGoal> {
    return this.http.post<SavingsGoal>(this.apiUrl, savingsGoal);
  }

  updateSavingsGoal(id: number, savingsGoal: SavingsGoal): Observable<SavingsGoal> {
    return this.http.put<SavingsGoal>(`${this.apiUrl}/${id}`, savingsGoal);
  }

  deleteSavingsGoal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
