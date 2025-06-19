import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CreditRequestStatus } from '../../models/credit-request.model';

@Component({
  selector: 'app-status-change-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>Cambiar Estado</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div
          *ngIf="data.monthlyIncome !== undefined && data.monthlyIncome >= 1500"
          class="alert-recommend"
        >
          <mat-icon color="primary" style="vertical-align: middle;"
            >info</mat-icon
          >
          Se recomienda aprobar la solicitud (ingreso mensual alto)
        </div>
        <mat-form-field class="full-width">
          <mat-label>Nuevo Estado</mat-label>
          <mat-select formControlName="status">
            <mat-option value="APPROVED">Aprobado</mat-option>
            <mat-option value="REJECTED">Rechazado</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field
          class="full-width"
          *ngIf="form.get('status')?.value === 'REJECTED'"
        >
          <mat-label>Razón del Rechazo</mat-label>
          <textarea
            matInput
            formControlName="rejectionReason"
            rows="3"
          ></textarea>
          <mat-error *ngIf="form.get('rejectionReason')?.hasError('required')">
            La razón del rechazo es requerida
          </mat-error>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="form.invalid"
        >
          Guardar
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
      }
      mat-dialog-content {
        min-width: 300px;
      }
      .alert-recommend {
        background: #e3f2fd;
        color: #1565c0;
        padding: 8px 12px;
        border-radius: 4px;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
      }
    `,
  ],
})
export class StatusChangeDialogComponent {
  form: FormGroup;
  CreditRequestStatus = CreditRequestStatus;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StatusChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { currentStatus: string; monthlyIncome?: number }
  ) {
    this.form = this.fb.group({
      status: ['', Validators.required],
      rejectionReason: [''],
    });

    this.form.get('status')?.valueChanges.subscribe((status) => {
      const rejectionReasonControl = this.form.get('rejectionReason');
      if (status === 'REJECTED') {
        rejectionReasonControl?.setValidators([Validators.required]);
      } else {
        rejectionReasonControl?.clearValidators();
      }
      rejectionReasonControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
