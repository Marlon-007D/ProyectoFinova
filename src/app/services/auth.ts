import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';
  private usersUrl = 'http://localhost:8080/api/users';
  private adminUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, { responseType: 'text' as 'json' });
  }

  checkUsername(username: string): Observable<{exists: boolean, suggestions?: string[]}> {
    return this.http.get<{exists: boolean, suggestions?: string[]}>(`${this.apiUrl}/check-username?username=${username}`);
  }

  checkEmail(email: string): Observable<{exists: boolean}> {
    return this.http.get<{exists: boolean}>(`${this.apiUrl}/check-email?email=${email}`);
  }

  getSecurityQuestion(identifier: string): Observable<{question: string}> {
    return this.http.get<{question: string}>(`${this.apiUrl}/security-question?identifier=${identifier}`);
  }

  resetPassword(identifier: string, answer: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { identifier, answer, newPassword });
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user ? user.role === 'ADMIN' : false;
  }

  getUser(): any {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  getAllUsers(page: number = 0, size: number = 10): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.usersUrl}?page=${page}&size=${size}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateUserStatus(id: number, status: boolean): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put<any>(`${this.usersUrl}/${id}/status?status=${status}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getSystemStats(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.adminUrl}/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getMe(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.usersUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateMyProfile(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put<any>(`${this.usersUrl}/me/profile`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateMyPreferences(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put<any>(`${this.usersUrl}/me/preferences`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  suspendMyAccount(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put<any>(`${this.usersUrl}/me/suspend`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  deleteMyAccount(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete<any>(`${this.usersUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  loadCurrentUser() {
    this.getMe().subscribe({
      next: (user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
      },
      error: (err) => console.error(err)
    });
  }
}