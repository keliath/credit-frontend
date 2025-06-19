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
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateCreditRequestRequest } from '../../models/credit-request.model';
import { CreditRequestService } from '../../services/credit-request.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { AppState } from '../../store';
import * as CreditRequestActions from '../../store/actions/credit-request.actions';
import * as CreditRequestSelectors from '../../store/selectors/credit-request.selectors';

@Component({
  selector: 'app-new-credit-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  templateUrl: './new-credit-request.component.html',
  styleUrls: ['./new-credit-request.component.scss'],
})
export class NewCreditRequestComponent implements OnInit {
  creditRequestForm: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  suggestedStatus: 'Aprobado' | 'Rechazado' | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private snackBar: MatSnackBar,
    private creditRequestService: CreditRequestService,
    private actions$: Actions,
    private errorHandler: ErrorHandlerService
  ) {
    this.creditRequestForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(100)]],
      purpose: ['', [Validators.required, Validators.minLength(10)]],
      termInMonths: ['', [Validators.required, Validators.min(1)]],
      monthlyIncome: ['', [Validators.required, Validators.min(400)]],
      workExperience: ['', [Validators.required, Validators.min(0)]],
    });

    this.loading$ = this.store.select(
      CreditRequestSelectors.selectCreditRequestLoading
    );
    this.error$ = this.store.select(
      CreditRequestSelectors.selectCreditRequestError
    );

    // Listen for form changes to calculate suggested status
    this.creditRequestForm.get('amount')?.valueChanges.subscribe((amount) => {
      if (amount) {
        this.suggestedStatus =
          this.creditRequestService.getSuggestedStatus(amount);
      } else {
        this.suggestedStatus = null;
      }
    });

    this.error$.subscribe((error) => {
      if (error) {
        this.errorHandler.handleApiError(
          error,
          'Ocurrió un error al crear la solicitud.'
        );
      }
    });

    this.actions$
      .pipe(ofType(CreditRequestActions.createCreditRequestSuccess))
      .subscribe(() => {
        this.snackBar.open(
          'Solicitud de crédito creada exitosamente',
          'Cerrar',
          { duration: 3000, panelClass: 'success-snackbar' }
        );
        this.creditRequestForm.reset();
        this.suggestedStatus = null;
      });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.creditRequestForm.valid) {
      const request: CreateCreditRequestRequest = {
        amount: this.creditRequestForm.get('amount')?.value,
        purpose: this.creditRequestForm.get('purpose')?.value,
        termInMonths: this.creditRequestForm.get('termInMonths')?.value,
        monthlyIncome: this.creditRequestForm.get('monthlyIncome')?.value,
        workExperience: this.creditRequestForm.get('workExperience')?.value,
        currency: 'usd',
        monthlyIncomeCurrency: 'usd',
      };
      this.store.dispatch(
        CreditRequestActions.createCreditRequest({ request })
      );
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.creditRequestForm.controls).forEach((key) => {
      const control = this.creditRequestForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(field: string): string {
    const control = this.creditRequestForm.get(field);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('min')) {
      return `El valor mínimo es ${control.errors?.['min'].min}`;
    }
    if (control?.hasError('max')) {
      return `El valor máximo es ${control.errors?.['max'].max}`;
    }
    return '';
  }
}
