import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  login() {
    this.errorMessage = '';
    this.auth.login(this.username, this.password).subscribe({
      next: (response) => {
        if (this.auth.isAdmin()) {
          this.router.navigateByUrl('/admin/dashboard');
        } else {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
          this.router.navigateByUrl(returnUrl);
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        if (err.error === 'CUENTA_SUSPENDIDA') {
          this.errorMessage = 'Tu cuenta ha sido suspendida. Por favor, contacta con el administrador.';
        } else {
          this.errorMessage = 'Usuario o contraseña incorrectos';
        }
        this.cdr.markForCheck();
      }
    });
  }
}