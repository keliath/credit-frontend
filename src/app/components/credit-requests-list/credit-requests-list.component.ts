import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CreditRequestFilter,
  CreditRequestListResponse,
  CreditRequestStatus,
  UpdateCreditRequestStatusRequest,
  getNormalizedStatus,
  getStatusColor,
  translateStatus,
} from '../../models/credit-request.model';
import { CreditRequestService } from '../../services/credit-request.service';
import { AppState } from '../../store';
import * as CreditRequestActions from '../../store/actions/credit-request.actions';
import * as CreditRequestSelectors from '../../store/selectors/credit-request.selectors';
import { selectCreditRequestsPagination } from '../../store/selectors/credit-request.selectors';
import { StatusChangeDialogComponent } from '../status-change-dialog/status-change-dialog.component';

@Component({
  selector: 'app-credit-requests-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Solicitudes de Crédito</mat-card-title>
          <div class="spacer"></div>
          <div class="filters">
            <mat-form-field>
              <mat-label>Estado</mat-label>
              <mat-select [formControl]="statusFilter">
                <mat-option value="">Todos</mat-option>
                <mat-option value="PENDING">Pendiente</mat-option>
                <mat-option value="APPROVED">Aprobado</mat-option>
                <mat-option value="REJECTED">Rechazado</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading$ | async" class="loading">
            <mat-spinner></mat-spinner>
          </div>

          <table
            mat-table
            [dataSource]="(creditRequests$ | async) || []"
            matSort
            *ngIf="!(loading$ | async)"
          >
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>#</th>
              <td mat-cell *matCellDef="let request; let i = index">
                {{ i + 1 }}
              </td>
            </ng-container>

            <ng-container matColumnDef="username">
              <th mat-header-cell *matHeaderCellDef>Solicitante</th>
              <td mat-cell *matCellDef="let request">
                {{ request.user?.username }}
              </td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let request">
                {{ request.user?.email }}
              </td>
            </ng-container>

            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef>Monto</th>
              <td mat-cell *matCellDef="let request">
                {{
                  request.amount?.amount
                    | currency : request.amount?.currency : 'symbol'
                }}
              </td>
            </ng-container>

            <ng-container matColumnDef="monthlyIncome">
              <th mat-header-cell *matHeaderCellDef>Ingreso Mensual</th>
              <td mat-cell *matCellDef="let request">
                {{
                  request.monthlyIncome?.amount
                    | currency : request.monthlyIncome?.currency : 'symbol'
                }}
              </td>
            </ng-container>

            <ng-container matColumnDef="workSeniorityYears">
              <th mat-header-cell *matHeaderCellDef>Antigüedad Laboral</th>
              <td mat-cell *matCellDef="let request">
                {{ request.workSeniorityYears }} años
              </td>
            </ng-container>

            <ng-container matColumnDef="termInMonths">
              <th mat-header-cell *matHeaderCellDef>Plazo</th>
              <td mat-cell *matCellDef="let request">
                {{ request.termInMonths }} meses
              </td>
            </ng-container>

            <ng-container matColumnDef="purpose">
              <th mat-header-cell *matHeaderCellDef>Propósito</th>
              <td mat-cell *matCellDef="let request">{{ request.purpose }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let request">
                <ng-container
                  *ngIf="
                    getNormalizedStatus(request.status) === 'Rejected';
                    else normalChip
                  "
                >
                  <mat-chip
                    [color]="
                      getStatusColor(getNormalizedStatus(request.status))
                    "
                    selected
                    [class.status-pending]="
                      getNormalizedStatus(request.status) === 'Pending'
                    "
                    [matTooltip]="
                      getNormalizedStatus(request.status) === 'Rejected'
                        ? 'Motivo de rechazo: ' + request.rejectionReason
                        : null
                    "
                    (click)="openStatusDialog(request)"
                  >
                    {{ translateStatus(getNormalizedStatus(request.status)) }}
                  </mat-chip>
                </ng-container>
                <ng-template #normalChip>
                  <mat-chip
                    [color]="
                      getStatusColor(getNormalizedStatus(request.status))
                    "
                    selected
                    (click)="openStatusDialog(request)"
                  >
                    {{ translateStatus(getNormalizedStatus(request.status)) }}
                  </mat-chip>
                </ng-template>
              </td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>Fecha de Creación</th>
              <td mat-cell *matCellDef="let request">
                {{ request.createdAt | date : 'medium' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let request">
                <button
                  mat-icon-button
                  color="primary"
                  *ngIf="getNormalizedStatus(request.status) === 'Pending'"
                  (click)="openStatusDialog(request)"
                  [attr.aria-label]="
                    'Cambiar estado de solicitud ' + request.id
                  "
                >
                  <mat-icon>edit</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>

          <mat-paginator
            [length]="(pagination$ | async)?.totalCount || 0"
            [pageSize]="(pagination$ | async)?.size || pageSize"
            [pageIndex]="((pagination$ | async)?.page || 1) - 1"
            [pageSizeOptions]="pageSizeOptions"
            (page)="onPageChange($event)"
            aria-label="Select page"
          >
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
      }
      .loading {
        display: flex;
        justify-content: center;
        padding: 20px;
      }
      .spacer {
        flex: 1 1 auto;
      }
      .filters {
        display: flex;
        gap: 16px;
        align-items: center;
      }
      mat-card-header {
        margin-bottom: 20px;
      }
      table {
        width: 100%;
      }
      mat-chip {
        cursor: pointer;
      }
      .mat-mdc-chip.mat-success {
        background-color: #43a047 !important;
        color: white !important;
      }
      .mat-mdc-chip.mat-error {
        background-color: #e53935 !important;
        color: white !important;
      }
    `,
  ],
})
export class CreditRequestsListComponent implements OnInit {
  creditRequests$: Observable<CreditRequestListResponse[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  pagination$: Observable<{
    page: number;
    size: number;
    totalCount: number;
    totalPages: number;
  }>;

  // Filter controls
  statusFilter = new FormControl<CreditRequestStatus | ''>('');
  searchControl = new FormControl<string>('');

  // Table properties
  displayedColumns: string[] = [
    'id',
    'username',
    'email',
    'amount',
    'monthlyIncome',
    'workSeniorityYears',
    'termInMonths',
    'purpose',
    'status',
    'createdAt',
    'actions',
  ];

  // Pagination
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  currentPage = 0;

  CreditRequestStatus = CreditRequestStatus;

  translateStatus = translateStatus;

  getNormalizedStatus = getNormalizedStatus;
  getStatusColor = getStatusColor;

  constructor(
    private store: Store<AppState>,
    private snackBar: MatSnackBar,
    private creditRequestService: CreditRequestService,
    private dialog: MatDialog
  ) {
    this.creditRequests$ = this.store
      .select(CreditRequestSelectors.selectCreditRequests)
      .pipe(map((requests) => requests ?? []));
    this.loading$ = this.store.select(
      CreditRequestSelectors.selectCreditRequestLoading
    );
    this.error$ = this.store.select(
      CreditRequestSelectors.selectCreditRequestError
    );
    this.pagination$ = this.store.select(selectCreditRequestsPagination);
  }

  ngOnInit(): void {
    this.loadCreditRequests({ page: 1, size: this.pageSize });

    // Listen for errors
    this.error$.subscribe((error) => {
      if (error) {
        this.snackBar.open(error, 'Cerrar', {
          duration: 5000,
          panelClass: 'error-snackbar',
        });
      }
    });

    this.statusFilter.valueChanges.subscribe((status) => {
      const filter: CreditRequestFilter = {};
      if (status) {
        filter.status = status;
      }
      this.loadCreditRequests({ ...filter, page: 1, size: this.pageSize });
    });
  }

  loadCreditRequests(
    filter?: CreditRequestFilter & { page?: number; size?: number }
  ): void {
    this.store.dispatch(CreditRequestActions.loadCreditRequests({ filter }));
  }

  openStatusDialog(request: CreditRequestListResponse): void {
    if (getNormalizedStatus(request.status) !== 'Pending') {
      return;
    }
    const dialogRef = this.dialog.open(StatusChangeDialogComponent, {
      width: '440px',
      data: {
        currentStatus: request.status,
        monthlyIncome: request.monthlyIncome?.amount,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const normalizedStatus =
          result.status.charAt(0).toUpperCase() +
          result.status.slice(1).toLowerCase();
        const updateRequest: UpdateCreditRequestStatusRequest = {
          status: normalizedStatus,
          rejectionReason: result.rejectionReason,
        };
        this.store.dispatch(
          CreditRequestActions.updateCreditRequestStatus({
            id: request.id,
            request: updateRequest,
          })
        );
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    const filter: any = { page: this.currentPage + 1, size: this.pageSize };
    if (this.statusFilter.value) {
      filter.status = this.statusFilter.value;
    }
    this.loadCreditRequests(filter);
  }

  getSuggestedStatus(monthlyIncome: number): 'Aprobado' | 'Rechazado' {
    return this.creditRequestService.getSuggestedStatus(monthlyIncome);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  exportToPdf(): void {
    const filter: CreditRequestFilter = {};
    if (this.statusFilter.value) {
      filter.status = this.statusFilter.value;
    }

    this.creditRequestService.exportToPdf(filter).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'solicitudes-credito.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  exportToExcel(): void {
    const filter: CreditRequestFilter = {};
    if (this.statusFilter.value) {
      filter.status = this.statusFilter.value;
    }

    this.creditRequestService.exportToExcel(filter).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'solicitudes-credito.xlsx';
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
