import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response && response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, email, password });
  }

  logout() {
    localStorage.removeItem('user');
  }

  isLoggedIn() {
    return !!localStorage.getItem('user');
  }
}