import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit {
  users: any[] = [];
  currentPage = 0;
  totalPages = 0;
  pageSize = 10;
  isLoading = true;

  constructor(private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page: number = 0) {
    this.isLoading = true;
    this.auth.getAllUsers(page, this.pageSize).subscribe({
      next: (data) => {
        this.users = data.content;
        this.currentPage = data.number;
        this.totalPages = data.totalPages;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleStatus(user: any) {
    const newStatus = !user.enabled;
    this.auth.updateUserStatus(user.id, newStatus).subscribe({
      next: () => {
        user.enabled = newStatus;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error updating status:', err);
        alert('No se pudo actualizar el estado.');
        this.cdr.detectChanges();
      }
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.loadUsers(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.loadUsers(this.currentPage - 1);
    }
  }
}
