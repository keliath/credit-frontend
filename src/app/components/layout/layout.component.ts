import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store';
import * as AuthActions from '../../store/actions/auth.actions';
import * as AuthSelectors from '../../store/selectors/auth.selectors';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav
        #drawer
        class="sidenav"
        fixedInViewport
        [mode]="'side'"
        [opened]="true"
      >
        <mat-toolbar>Menu</mat-toolbar>
        <mat-nav-list>
          <!-- Menu Analyst -->
          <ng-container *ngIf="(user$ | async)?.role === 'Analyst'">
            <a mat-list-item routerLink="/credit-requests">
              <mat-icon>list</mat-icon>
              <span>Solicitudes</span>
            </a>
          </ng-container>

          <!-- Menu User -->
          <ng-container *ngIf="(user$ | async)?.role === 'User'">
            <a mat-list-item routerLink="/my-credit-requests">
              <mat-icon>list</mat-icon>
              <span>Mis Solicitudes</span>
            </a>
            <a mat-list-item routerLink="/new-credit-request">
              <mat-icon>add</mat-icon>
              <span>Nueva Solicitud</span>
            </a>
          </ng-container>

          <!-- Common items -->
          <a mat-list-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Cerrar Sesión</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <span>Sistema de Créditos</span>
          <span class="spacer"></span>
          <span>{{ (user$ | async)?.username }}</span>
        </mat-toolbar>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .sidenav-container {
        height: 100vh;
      }
      .sidenav {
        width: 250px;
      }
      .content {
        padding: 20px;
      }
      .spacer {
        flex: 1 1 auto;
      }
      mat-nav-list a {
        display: flex;
        align-items: center;
        gap: 10px;
      }
    `,
  ],
})
export class LayoutComponent {
  user$: Observable<any>;

  constructor(private store: Store<AppState>) {
    this.user$ = this.store.select(AuthSelectors.selectUser);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
