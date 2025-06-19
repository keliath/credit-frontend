import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
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
    MatMenuModule,
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav
        #drawer
        class="sidenav"
        fixedInViewport
        [attr.role]="'navigation'"
        [mode]="isSmallScreen ? 'over' : 'side'"
        [opened]="sidenavOpened"
        (openedChange)="sidenavOpened = $event"
      >
        <div class="sidenav-header">
          <h2>Sistema de Créditos</h2>
          <p class="user-role" *ngIf="user$ | async as user">
            {{ user.role }}
          </p>
        </div>
        <mat-divider></mat-divider>
        <mat-nav-list>
          <a
            mat-list-item
            routerLink="/dashboard"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Inicio</span>
          </a>
          <a mat-list-item routerLink="/profile" routerLinkActive="active">
            <mat-icon matListItemIcon>person</mat-icon>
            <span matListItemTitle>Mi Perfil</span>
          </a>
          <mat-divider></mat-divider>
          <ng-container *ngIf="(user$ | async)?.role === 'User'">
            <div class="menu-section">
              <span class="menu-section-title">Solicitante</span>
              <a
                mat-list-item
                routerLink="/new-request"
                routerLinkActive="active"
              >
                <mat-icon matListItemIcon>add_circle</mat-icon>
                <span matListItemTitle>Nueva Solicitud</span>
              </a>
              <a
                mat-list-item
                routerLink="/my-requests"
                routerLinkActive="active"
              >
                <mat-icon matListItemIcon>list</mat-icon>
                <span matListItemTitle>Mis Solicitudes</span>
              </a>
            </div>
          </ng-container>
          <ng-container *ngIf="(user$ | async)?.role === 'Analyst'">
            <div class="menu-section">
              <span class="menu-section-title">Analista</span>
              <a mat-list-item routerLink="/requests" routerLinkActive="active">
                <mat-icon matListItemIcon>assessment</mat-icon>
                <span matListItemTitle>Todas las Solicitudes</span>
              </a>
            </div>
          </ng-container>
          <mat-divider></mat-divider>
          <a mat-list-item (click)="logout()">
            <mat-icon matListItemIcon>exit_to_app</mat-icon>
            <span matListItemTitle>Cerrar Sesión</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary" class="toolbar">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="drawer.toggle()"
            class="sidenav-toggle"
          >
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          <span class="toolbar-title">
            {{ getGreeting() }}, {{ (user$ | async)?.username }}
          </span>
          <span class="toolbar-spacer"></span>
          <button
            mat-icon-button
            [matMenuTriggerFor]="userMenu"
            class="user-menu-button"
          >
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <div class="user-menu-header" *ngIf="user$ | async as user">
              <p class="user-name">{{ user.username }}</p>
              <p class="user-email">{{ user.email }}</p>
              <p class="user-role">{{ user.role }}</p>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item routerLink="/profile">
              <mat-icon>person</mat-icon>
              <span>Mi Perfil</span>
            </button>
            <button mat-menu-item (click)="logout()">
              <mat-icon>exit_to_app</mat-icon>
              <span>Cerrar Sesión</span>
            </button>
          </mat-menu>
        </mat-toolbar>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent {
  user$: Observable<any>;
  sidenavOpened = true;
  isSmallScreen = false;

  constructor(private store: Store<AppState>) {
    this.user$ = this.store.select(AuthSelectors.selectUser);
    this.updateSidenavMode();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateSidenavMode();
  }

  ngOnInit() {
    this.updateSidenavMode();
  }

  updateSidenavMode() {
    this.isSmallScreen = window.innerWidth < 1440;
    this.sidenavOpened = !this.isSmallScreen;
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }
}
