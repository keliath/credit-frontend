import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateCreditRequestRequest } from '../../../models/credit-request.model';
import * as CreditRequestActions from '../../../store/actions/credit-request.actions';
import * as CreditRequestSelectors from '../../../store/selectors/credit-request.selectors';

@Component({
  selector: 'app-create-credit-request',
  templateUrl: './create-credit-request.component.html',
  styleUrls: ['./create-credit-request.component.scss'],
})
export class CreateCreditRequestComponent implements OnInit {
  creditRequestForm: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.creditRequestForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      purpose: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.loading$ = this.store.select(CreditRequestSelectors.selectLoading);
    this.error$ = this.store.select(CreditRequestSelectors.selectError);
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.creditRequestForm.valid) {
      const request: CreateCreditRequestRequest = {
        amount: this.creditRequestForm.value.amount,
        purpose: this.creditRequestForm.value.purpose,
      };

      this.store.dispatch(
        CreditRequestActions.createCreditRequest({ request })
      );
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.creditRequestForm.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'This field is required';
    }

    if (controlName === 'amount' && control.hasError('min')) {
      return 'Amount must be greater than 0';
    }

    if (controlName === 'purpose' && control.hasError('minlength')) {
      return 'Purpose must be at least 10 characters long';
    }

    return '';
  }
}
