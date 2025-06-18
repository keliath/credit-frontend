import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { AppState } from '../../store';
import * as AuthActions from '../../store/actions/auth.actions';
import * as AuthSelectors from '../../store/selectors/auth.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user$: Observable<User | null>;
  isAnalyst$: Observable<boolean>;
  isApplicant$: Observable<boolean>;
  sidenavOpened = true;

  constructor(private store: Store<AppState>, private router: Router) {
    this.user$ = this.store.select(AuthSelectors.selectUser);
    this.isAnalyst$ = this.store.select(AuthSelectors.selectIsAnalyst);
    this.isApplicant$ = this.store.select(AuthSelectors.selectIsApplicant);
  }

  ngOnInit(): void {
    // Check if user is authenticated
    this.user$.subscribe((user) => {
      console.log('Dashboard user state:', user);
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }
}
