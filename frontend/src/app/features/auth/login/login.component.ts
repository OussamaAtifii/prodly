import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PrintErrorComponent } from '@shared/components/print-error/print-error.component';
import { AuthService } from '../services/auth.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { environment } from 'src/environments/environment';
import { LoginData } from '../models/login-data.model';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    PrintErrorComponent,
    RouterLink,
    SpinnerComponent,
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  loading = signal(false);
  loadingDemo = signal(false);
  error = signal('');

  constructor() {}

  loginForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(255),
      ],
    }),
  });

  onSubmit() {
    this.loading.set(true);

    const loginData = {
      email: this.loginForm.value.email || '',
      password: this.loginForm.value.password || '',
    };

    this.authService.login(loginData).subscribe({
      next: (value) => {
        console.log(value);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.error.set(error.error.message);
        this.loading.set(false);
      },
    });
  }

  loginWithDemo() {
    this.loadingDemo.set(true);

    const loginData: LoginData = {
      email: environment.DEMO_USER_EMAIL,
      password: environment.DEMO_USER_PASSWORD,
    };

    this.authService.login(loginData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.error.set(error.error.message);
        this.loadingDemo.set(false);
      },
    });
  }
}
