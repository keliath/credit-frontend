import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CreditRequestListResponse,
  getNormalizedStatus,
  getStatusColor,
  translateStatus,
} from '../../models/credit-request.model';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { AppState } from '../../store';
import * as CreditRequestActions from '../../store/actions/credit-request.actions';
import * as CreditRequestSelectors from '../../store/selectors/credit-request.selectors';

@Component({
  selector: 'app-my-credit-requests',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Mis Solicitudes de Crédito</mat-card-title>
          <div class="spacer"></div>
          <button mat-raised-button color="primary" routerLink="/new-request">
            <mat-icon>add</mat-icon>
            Nueva Solicitud
          </button>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading$ | async" class="loading">
            <mat-spinner></mat-spinner>
          </div>

          <table
            mat-table
            [dataSource]="(creditRequests$ | async) || []"
            *ngIf="!(loading$ | async)"
          >
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>#</th>
              <td mat-cell *matCellDef="let request; let i = index">
                {{ i + 1 }}
              </td>
            </ng-container>

            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef>Monto</th>
              <td mat-cell *matCellDef="let request">
                {{
                  formatCurrency(
                    request.amount?.amount || 0,
                    request.amount?.currency || 'USD'
                  )
                }}
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
                    [matTooltip]="
                      getNormalizedStatus(request.status) === 'Rejected'
                        ? 'Motivo de rechazo: ' + request.rejectionReason
                        : null
                    "
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

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
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
      mat-card-header {
        margin-bottom: 20px;
      }
      table {
        width: 100%;
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
export class MyCreditRequestsComponent implements OnInit {
  creditRequests$: Observable<CreditRequestListResponse[]>;
  loading$: Observable<boolean>;
  displayedColumns: string[] = [
    'id',
    'amount',
    'purpose',
    'status',
    'createdAt',
  ];

  translateStatus = translateStatus;
  getNormalizedStatus = getNormalizedStatus;
  public getStatusColor: typeof getStatusColor;

  constructor(
    private store: Store<AppState>,
    private errorHandler: ErrorHandlerService
  ) {
    this.creditRequests$ = this.store
      .select(CreditRequestSelectors.selectCreditRequests)
      .pipe(
        map((requests) => {
          return requests ?? [];
        })
      );
    this.loading$ = this.store.select(
      CreditRequestSelectors.selectCreditRequestLoading
    );
    this.getStatusColor = getStatusColor;
  }

  ngOnInit(): void {
    this.store.dispatch(CreditRequestActions.loadUserCreditRequests());
  }

  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }
}
