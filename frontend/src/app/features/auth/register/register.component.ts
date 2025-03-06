import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrintErrorComponent } from '@shared/components/print-error/print-error.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'app-register',
  imports: [
    PrintErrorComponent,
    ReactiveFormsModule,
    RouterLink,
    SpinnerComponent,
  ],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  loading = signal(false);
  error = signal('');

  registerForm = new FormGroup({
    username: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16),
      ],
    }),
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

    const registerData = {
      username: this.registerForm.value.username || '',
      email: this.registerForm.value.email || '',
      password: this.registerForm.value.password || '',
    };

    if (this.registerForm.valid) {
      this.authService.register(registerData).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.log(error.error.message);
          this.error.set(error.error.message);
          this.loading.set(false);
        },
      });
    }
  }

  get username() {
    return this.registerForm.get('username') as FormControl;
  }
}
