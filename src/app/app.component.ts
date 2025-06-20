import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from './store';
import * as AuthSelectors from './store/selectors/auth.selectors';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatProgressSpinnerModule],
  template: `
    <div class="global-spinner" *ngIf="loading$ | async">
      <mat-progress-spinner
        mode="indeterminate"
        diameter="60"
        color="primary"
      ></mat-progress-spinner>
      <div class="spinner-text">Cargando...</div>
    </div>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      .global-spinner {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(2px);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
      }

      .spinner-text {
        font-size: 16px;
        color: #666;
        font-weight: 500;
      }
    `,
  ],
})
export class AppComponent {
  loading$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.loading$ = this.store.select(AuthSelectors.selectAuthLoading);
  }
}
