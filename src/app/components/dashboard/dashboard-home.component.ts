import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { AppState } from '../../store';
import * as AuthSelectors from '../../store/selectors/auth.selectors';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, RouterModule],
  template: `
    <div class="dashboard-home">
      <mat-card class="welcome-card">
        <mat-card-header>
          <mat-card-title>Bienvenido al Sistema de Créditos</mat-card-title>
          <mat-card-subtitle *ngIf="user$ | async as user">
            {{ user.username }} - {{ user.role }}
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="content-section">
            <h2>¿Qué desea hacer?</h2>
            <div class="actions-grid">
              <ng-container *ngIf="isApplicant$ | async">
                <mat-card
                  class="action-card"
                  routerLink="/dashboard/new-request"
                >
                  <mat-icon>add_circle</mat-icon>
                  <h3>Nueva Solicitud</h3>
                  <p>Crear una nueva solicitud de crédito</p>
                </mat-card>
                <mat-card
                  class="action-card"
                  routerLink="/dashboard/my-requests"
                >
                  <mat-icon>list</mat-icon>
                  <h3>Mis Solicitudes</h3>
                  <p>Ver el estado de mis solicitudes</p>
                </mat-card>
              </ng-container>
              <ng-container *ngIf="isAnalyst$ | async">
                <mat-card class="action-card" routerLink="/dashboard/requests">
                  <mat-icon>assessment</mat-icon>
                  <h3>Todas las Solicitudes</h3>
                  <p>Ver todas las solicitudes de crédito</p>
                </mat-card>
                <mat-card class="action-card" routerLink="/dashboard/pending">
                  <mat-icon>pending</mat-icon>
                  <h3>Solicitudes Pendientes</h3>
                  <p>Revisar solicitudes pendientes</p>
                </mat-card>
              </ng-container>
              <mat-card class="action-card" routerLink="/dashboard/profile">
                <mat-icon>person</mat-icon>
                <h3>Mi Perfil</h3>
                <p>Ver y editar mi información personal</p>
              </mat-card>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .dashboard-home {
        padding: 24px;
      }
      .welcome-card {
        max-width: 1200px;
        margin: 0 auto;
      }
      .content-section {
        margin-top: 24px;
      }
      .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
        margin-top: 24px;
      }
      .action-card {
        cursor: pointer;
        transition: transform 0.2s;
        &:hover {
          transform: translateY(-4px);
        }
        mat-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
          margin-bottom: 16px;
          color: #667eea;
        }
        h3 {
          margin: 0 0 8px 0;
          color: #333;
        }
        p {
          margin: 0;
          color: #666;
        }
      }
    `,
  ],
})
export class DashboardHomeComponent {
  user$: Observable<User | null>;
  isAnalyst$: Observable<boolean>;
  isApplicant$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.user$ = this.store.select(AuthSelectors.selectUser);
    this.isAnalyst$ = this.store.select(AuthSelectors.selectIsAnalyst);
    this.isApplicant$ = this.store.select(AuthSelectors.selectIsApplicant);
  }
}
