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
}
