import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { AppState } from '../store';
import * as AuthActions from '../store/actions/auth.actions';
import * as AuthSelectors from '../store/selectors/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(AuthSelectors.selectUser).pipe(
      take(1),
      map((user) => {
        // If we have a user, allow access
        if (user) {
          return true;
        }

        // Check for token
        const token = localStorage.getItem('token');
        if (!token) {
          return this.router.createUrlTree(['/login']);
        }

        // If we have a token but no user, dispatch whoami
        this.store.dispatch(AuthActions.whoami());
        return true;
      })
    );
  }
}
