import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatProgressSpinnerModule],
  template: `
    <div class="global-spinner" *ngIf="loading$ | async">
      <mat-progress-spinner
        mode="indeterminate"
        diameter="60"
      ></mat-progress-spinner>
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
        background: rgba(255, 255, 255, 0.7);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class AppComponent {
  loading$: Observable<boolean>;
  constructor(private store: Store<{ auth: { loading: boolean } }>) {
    this.loading$ = this.store.select((state) => state.auth.loading);
  }
}
