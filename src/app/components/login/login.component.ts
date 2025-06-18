import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../../models/user.model';
import { AppState } from '../../store';
import * as AuthActions from '../../store/actions/auth.actions';
import * as AuthSelectors from '../../store/selectors/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTabsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  selectedTab = 0;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.loading$ = this.store.select(AuthSelectors.selectAuthLoading);
    this.error$ = this.store.select(AuthSelectors.selectAuthError);

    this.error$.subscribe((error) => {
      if (error) {
        this.snackBar.open(error, 'Cerrar', { duration: 5000 });
      }
    });
  }

  ngOnInit(): void {
    // Subscribe to success actions
    this.store.select(AuthSelectors.selectUser).subscribe((user) => {
      if (user) {
        if (user.role === 'Analyst') {
          this.router.navigate(['/credit-requests']);
        } else {
          this.router.navigate(['/my-credit-requests']);
        }
      }
    });

    // Listen for errors
    this.error$.subscribe((error) => {
      if (error) {
        this.snackBar.open(error, 'Cerrar', { duration: 5000 });
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.store.dispatch(
        AuthActions.login({
          credentials: {
            email: email!,
            password: password!,
          },
        })
      );
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const userData: RegisterRequest = this.registerForm.value;
      this.store.dispatch(AuthActions.register({ userData }));
    }
  }

  getErrorMessage(form: FormGroup, field: string): string {
    const control = form.get(field);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    if (control?.hasError('minlength')) {
      return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
