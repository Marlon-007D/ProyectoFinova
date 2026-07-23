import { Component, OnInit, OnDestroy, signal, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit, OnDestroy {
  username = signal('');
  email = signal('');
  password = signal('');
  securityQuestion = signal('');
  securityAnswer = signal('');
  errorMessage = signal('');
  successMessage = signal('');

  usernameTaken = signal(false);
  usernameSuggestions = signal<string[]>([]);
  emailTaken = signal(false);
  showPassword = signal(false);

  private usernameSubject = new Subject<string>();
  private emailSubject = new Subject<string>();
  private usernameSubscription!: Subscription;
  private emailSubscription!: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.usernameSubscription = this.usernameSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(username => {
      if (username.trim().length > 0) {
        this.auth.checkUsername(username).subscribe(res => {
          this.usernameTaken.set(res.exists);
          this.usernameSuggestions.set(res.suggestions || []);
          this.cdr.markForCheck();
        });
      } else {
        this.usernameTaken.set(false);
        this.usernameSuggestions.set([]);
        this.cdr.markForCheck();
      }
    });

    this.emailSubscription = this.emailSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(email => {
      if (email.trim().length > 0) {
        this.auth.checkEmail(email).subscribe(res => {
          this.emailTaken.set(res.exists);
          this.cdr.markForCheck();
        });
      } else {
        this.emailTaken.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  ngOnDestroy() {
    if (this.usernameSubscription) this.usernameSubscription.unsubscribe();
    if (this.emailSubscription) this.emailSubscription.unsubscribe();
  }


  onUsernameChange(value: string) {
    const newVal = value.replace(/\s+/g, '_');
    this.username.set(newVal);
    this.usernameSubject.next(newVal);
  }

  onEmailChange(value: string) {
    this.email.set(value);
    this.emailSubject.next(value);
  }

  selectSuggestion(suggestion: string) {
    this.username.set(suggestion);
    this.usernameTaken.set(false);
    this.usernameSuggestions.set([]);
    this.usernameSubject.next(suggestion);
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  register() {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.username().trim() || !this.email().trim() || !this.password().trim()) {
      this.errorMessage.set('Por favor, completa todos los campos.');
      return;
    }

    if (!this.securityQuestion() || !this.securityAnswer()) {
      this.errorMessage.set('Debes seleccionar una pregunta de seguridad y proporcionar una respuesta.');
      return;
    }

    if (this.usernameTaken() || this.emailTaken()) {
      this.errorMessage.set('Por favor, resuelve los errores antes de continuar.');
      return;
    }

    const userData = {
      username: this.username(),
      email: this.email(),
      password: this.password(),
      securityQuestion: this.securityQuestion(),
      securityAnswer: this.securityAnswer()
    };

    this.auth.register(userData).subscribe({
      next: (response) => {
        this.successMessage.set('¡Registro exitoso! Iniciando sesión...');
        
        // Auto-login
        this.auth.login(this.username(), this.password()).subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error('Error in auto-login:', err);
            this.router.navigate(['/login']);
            this.cdr.markForCheck();
          }
        });
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        const errorText = err.error || '';
        
        if (errorText.toLowerCase().includes('username is already taken') || errorText.toLowerCase().includes('username')) {
          this.errorMessage.set('El nombre de usuario ya está en uso.');
        } else if (errorText.toLowerCase().includes('email is already in use') || errorText.toLowerCase().includes('email')) {
          this.errorMessage.set('El correo electrónico ya está registrado.');
        } else if (err.status === 400) {
          this.errorMessage.set('El usuario o correo ya existen en el sistema.');
        } else {
          this.errorMessage.set('Error al registrar usuario. Verifica los datos e intenta nuevamente.');
        }
      }
    });
  }
}
