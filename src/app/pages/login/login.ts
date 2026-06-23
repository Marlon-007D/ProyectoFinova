import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  username = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  login() {

    const ok = this.auth.login(
      this.username,
      this.password
    );

    if (ok) {

      const returnUrl =
        this.route.snapshot.queryParams['returnUrl']
        || '/dashboard';

      this.router.navigateByUrl(returnUrl);

    } else {

      alert('Usuario o contraseña incorrectos');

    }
  }
}