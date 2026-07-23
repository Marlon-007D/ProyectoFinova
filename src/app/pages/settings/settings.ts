import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class SettingsComponent implements OnInit {
  activeTab = 'profile'; // 'profile', 'appearance', 'danger'
  
  userProfile = {
    username: '',
    email: '',
    password: '',
    profilePicture: '' as string | null
  };

  preferences = {
    fontSize: 'normal',
    fontFamily: 'Inter'
  };

  message = '';
  isError = false;

  // Danger Modal State
  isDangerModalOpen = false;
  dangerActionType: 'suspend' | 'delete' | null = null;
  isSubmittingDanger = false;

  constructor(
    private auth: AuthService,
    public theme: ThemeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.auth.getMe().subscribe({
      next: (user) => {
        this.userProfile.username = user.username;
        this.userProfile.email = user.email;
        this.userProfile.profilePicture = user.profilePicture;
        this.preferences.fontSize = user.fontSize || 'normal';
        this.preferences.fontFamily = user.fontFamily || 'Inter';
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userProfile.profilePicture = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    this.auth.updateMyProfile(this.userProfile).subscribe({
      next: () => {
        this.showMessage('Perfil actualizado con éxito');
        this.auth.loadCurrentUser(); // Reload in sidebar
      },
      error: (err) => this.showMessage(err.error || 'Error al actualizar perfil', true)
    });
  }

  savePreferences() {
    this.auth.updateMyPreferences(this.preferences).subscribe({
      next: () => {
        this.showMessage('Preferencias actualizadas');
        this.theme.applyPreferences(this.preferences.fontSize, this.preferences.fontFamily);
      },
      error: () => this.showMessage('Error al actualizar preferencias', true)
    });
  }

  openDangerModal(actionType: 'suspend' | 'delete') {
    this.dangerActionType = actionType;
    this.isDangerModalOpen = true;
  }

  cancelDangerAction() {
    this.isDangerModalOpen = false;
    this.dangerActionType = null;
  }

  confirmDangerAction() {
    if (!this.dangerActionType) return;
    
    this.isSubmittingDanger = true;
    this.cdr.markForCheck();

    if (this.dangerActionType === 'suspend') {
      this.auth.suspendMyAccount().subscribe({
        next: () => this.auth.logout(),
        error: () => {
          this.isSubmittingDanger = false;
          this.isDangerModalOpen = false;
          this.showMessage('Error al suspender cuenta', true);
        }
      });
    } else if (this.dangerActionType === 'delete') {
      this.auth.deleteMyAccount().subscribe({
        next: () => this.auth.logout(),
        error: () => {
          this.isSubmittingDanger = false;
          this.isDangerModalOpen = false;
          this.showMessage('Error al eliminar cuenta', true);
        }
      });
    }
  }

  private showMessage(msg: string, error = false) {
    this.message = msg;
    this.isError = error;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.message = '';
      this.cdr.detectChanges();
    }, 3000);
  }
}
