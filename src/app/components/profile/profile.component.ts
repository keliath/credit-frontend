import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User, translateRole } from '../../models/user.model';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { AppState } from '../../store';
import * as AuthSelectors from '../../store/selectors/auth.selectors';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  user$: Observable<User | null>;
  translateRole = translateRole;

  constructor(
    private store: Store<AppState>,
    private errorHandler: ErrorHandlerService
  ) {
    this.user$ = this.store.select(AuthSelectors.selectUser);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
