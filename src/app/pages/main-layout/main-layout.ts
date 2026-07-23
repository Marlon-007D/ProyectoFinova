import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterModule, Router } from '@angular/router';
import { ThemeService } from '../../services/theme';
import { AuthService } from '../../services/auth';
import { NotificationService, Toast } from '../../services/notification.service';
import { IaService } from '../../services/ia.service';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterModule,
    FormsModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayoutComponent implements OnInit {

  isMenuOpen = false;
  toasts: Toast[] = [];

  // Nova State
  isNovaOpen = false;
  isNovaTyping = false;
  novaInput = '';
  novaMessages: {text: string, isBot: boolean}[] = [
    { text: '¡Hola! Soy Nova, tu asistente financiera. ¿En qué te puedo ayudar hoy?', isBot: true }
  ];
  proactiveMessage: string | null = null;
  proactiveTimeout: any;

  constructor(
    public theme: ThemeService,
    public auth: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private iaService: IaService
  ) { }

  ngOnInit() {
    const user = this.currentUser;
    if (user) {
      this.theme.applyPreferences(user.fontSize || 'normal', user.fontFamily || 'Inter');
    }

    this.notificationService.toasts$.subscribe(toast => {
      this.toasts.push(toast);
      // Auto-remove after 3.5 seconds
      setTimeout(() => this.removeToast(toast.id), 3500);
    });

    this.iaService.proactiveContext$.subscribe(context => {
      // Si el chat está abierto, no mostramos burbuja proactiva
      if (this.isNovaOpen) return;
      
      this.proactiveMessage = 'Pensando...';
      
      this.iaService.generarRespuesta(context).subscribe({
        next: (res) => {
          this.proactiveMessage = res.response;
          if (this.proactiveTimeout) clearTimeout(this.proactiveTimeout);
          this.proactiveTimeout = setTimeout(() => {
            this.proactiveMessage = null;
          }, 10000); // Se oculta en 10 segundos
        },
        error: (err) => {
          this.proactiveMessage = null;
        }
      });
    });
  }

  removeToast(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  get currentUser(): any {
    return this.auth.getUser();
  }

  get userInitial(): string {
    const user = this.currentUser;
    return user && user.username ? user.username.charAt(0).toUpperCase() : 'U';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  // --- NOVA LOGIC ---
  toggleNova() {
    this.isNovaOpen = !this.isNovaOpen;
  }

  sendNovaMessage() {
    if (!this.novaInput.trim() || this.isNovaTyping) return;

    const userText = this.novaInput.trim();
    this.novaMessages.push({ text: userText, isBot: false });
    this.novaInput = '';
    this.isNovaTyping = true;

    // Call Spring Boot Endpoint
    this.iaService.generarRespuesta(userText).subscribe({
      next: (res) => {
        this.isNovaTyping = false;
        this.novaMessages.push({ text: res.response, isBot: true });
      },
      error: (err) => {
        console.error('Error con Nova:', err);
        this.isNovaTyping = false;
        this.novaMessages.push({ text: 'Uy, creo que me desconecté. Asegúrate de que mi cerebro (Ollama) esté corriendo en tu computadora.', isBot: true });
      }
    });
  }

}