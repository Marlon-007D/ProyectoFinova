import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  step = signal(1);
  identifier = signal('');
  securityQuestion = signal('');
  securityAnswer = signal('');
  newPassword = signal('');
  
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  checkIdentifier() {
    this.errorMessage.set('');
    if (!this.identifier().trim()) {
      this.errorMessage.set('Ingresa tu usuario o correo.');
      return;
    }
    this.isLoading.set(true);
    this.auth.getSecurityQuestion(this.identifier()).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.question) {
          this.securityQuestion.set(res.question);
          this.step.set(2);
        } else {
          this.errorMessage.set('Este usuario no configuró una pregunta de seguridad.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Usuario o correo no encontrado.');
      }
    });
  }

  resetPassword() {
    this.errorMessage.set('');
    if (!this.securityAnswer().trim() || !this.newPassword().trim()) {
      this.errorMessage.set('Completa todos los campos.');
      return;
    }
    this.isLoading.set(true);
    this.auth.resetPassword(this.identifier(), this.securityAnswer(), this.newPassword()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('¡Contraseña restablecida exitosamente!');
        this.step.set(3);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 400 && err.error === 'Respuesta de seguridad incorrecta') {
          this.errorMessage.set('La respuesta de seguridad es incorrecta.');
        } else {
          this.errorMessage.set('Hubo un error al restablecer tu contraseña.');
        }
      }
    });
  }
}
